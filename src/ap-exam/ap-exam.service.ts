import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { ApExamRegistration } from "./ap-exam-registration.entity";
import { ApExamStorageService } from "./ap-exam-storage.service";
import { PaymentUpdateDto } from "./dto/payment-update.dto";
import { RegisterApExamDto } from "./dto/register-ap-exam.dto";
import { RescheduleExamDto } from "./dto/reschedule-exam.dto";
import { UpdateExamResultDto } from "./dto/update-exam-result.dto";
import { UploadExamReportDto } from "./dto/upload-exam-report.dto";

type UploadedReportFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class ApExamService {
  private static readonly FIXED_EXAM_TIME = "11:00 AM";
  private static readonly FIXED_EXAM_FEE = 3000;

  constructor(
    @InjectRepository(ApExamRegistration)
    private readonly apExamRepository: Repository<ApExamRegistration>,
    private readonly usersService: UsersService,
    private readonly apExamStorageService: ApExamStorageService,
  ) {}

  async getAdminExamList(requesterEmail: string, query?: { page?: number; limit?: number; search?: string }) {
    await this.ensureAdminAccess(requesterEmail);

    const page = Math.max(query?.page ?? 1, 1);
    const limit = Math.min(Math.max(query?.limit ?? 10, 1), 100);
    const qb = this.apExamRepository.createQueryBuilder("exam");
    qb.where("(exam.resultStatus IS NULL OR TRIM(exam.resultStatus) = '')");

    if (query?.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        "LOWER(exam.email) LIKE :search OR LOWER(exam.firstName) LIKE :search OR LOWER(exam.lastName) LIKE :search OR LOWER(COALESCE(exam.examId, '')) LIKE :search",
        { search },
      );
    }

    qb.orderBy("exam.examDate", "DESC")
      .addOrderBy("exam.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [records, total] = await qb.getManyAndCount();
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      items: records.map((record) => ({
        registrationId: record.id,
        examId: record.examId ?? null,
        fullName: `${record.firstName} ${record.lastName}`.trim(),
        email: record.email,
        mobileNumber: record.mobileNumber,
        examDate: record.examDate,
        examTime: record.examTime,
        paymentStatus: record.paymentStatus,
        feeAmount: record.feeAmount,
        rescheduleCount: record.rescheduleCount ?? 0,
        reportUrl: record.reportUrl ?? null,
        examScore: record.examScore ?? null,
        resultStatus: record.resultStatus ?? null,
      })),
    };
  }

  async getAdminManageCertificateList(
    requesterEmail: string,
    query?: { page?: number; limit?: number; search?: string },
  ) {
    await this.ensureAdminAccess(requesterEmail);

    const page = Math.max(query?.page ?? 1, 1);
    const limit = Math.min(Math.max(query?.limit ?? 10, 1), 100);
    const qb = this.apExamRepository.createQueryBuilder("exam");
    qb.where("exam.resultStatus = :resultStatus", { resultStatus: "pass" });

    if (query?.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        "LOWER(exam.email) LIKE :search OR LOWER(exam.firstName) LIKE :search OR LOWER(exam.lastName) LIKE :search OR LOWER(COALESCE(exam.examId, '')) LIKE :search",
        { search },
      );
    }

    qb.orderBy("exam.resultUpdatedAt", "DESC")
      .addOrderBy("exam.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [records, total] = await qb.getManyAndCount();
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      items: records.map((record) => ({
        registrationId: record.id,
        examId: record.examId ?? null,
        fullName: `${record.firstName} ${record.lastName}`.trim(),
        email: record.email,
        mobileNumber: record.mobileNumber,
        examDate: record.examDate,
        examTime: record.examTime,
        score: record.examScore ?? null,
        reportUrl: record.reportUrl ?? null,
        resultStatus: record.resultStatus,
        resultUpdatedAt: record.resultUpdatedAt ?? null,
        actions: {
          view: true,
        },
      })),
    };
  }

  async getExamView(registrationId: string) {
    const registration = await this.findByIdOrThrow(registrationId);
    return this.toResponse(registration);
  }

  async uploadExamReportAndScore(
    registrationId: string,
    requesterEmail: string,
    reportFile: UploadedReportFile | undefined,
    dto: UploadExamReportDto,
  ) {
    await this.ensureAdminAccess(requesterEmail);
    const registration = await this.findByIdOrThrow(registrationId);
    if (!reportFile) {
      throw new BadRequestException("Report file is required");
    }
    const reportUrl = await this.apExamStorageService.uploadReport(reportFile, registration.id);
    registration.reportUrl = reportUrl;
    registration.examScore = dto.score;
    registration.reportUploadedAt = new Date();
    registration.resultStatus = undefined;
    registration.resultUpdatedAt = undefined;

    const updated = await this.apExamRepository.save(registration);
    return {
      registrationId: updated.id,
      examId: updated.examId ?? null,
      reportUrl: updated.reportUrl,
      examScore: updated.examScore,
      reportUploadedAt: updated.reportUploadedAt,
      message: "Report and score uploaded successfully",
    };
  }

  async updateExamResult(registrationId: string, requesterEmail: string, dto: UpdateExamResultDto) {
    await this.ensureAdminAccess(requesterEmail);
    const registration = await this.findByIdOrThrow(registrationId);
    if (!registration.reportUrl) {
      throw new BadRequestException("Upload report before setting pass/fail result");
    }

    registration.resultStatus = dto.result;
    registration.resultUpdatedAt = new Date();
    const updated = await this.apExamRepository.save(registration);
    return {
      registrationId: updated.id,
      examId: updated.examId ?? null,
      result: updated.resultStatus,
      resultUpdatedAt: updated.resultUpdatedAt,
      message: "Exam result updated successfully",
    };
  }

  async createRegistration(registerDto: RegisterApExamDto) {
    const email = registerDto.personalInformation.email.toLowerCase();
    const existing = await this.apExamRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException("Duplicate email registration is not allowed");
    }

    const registration = this.buildRegistrationPayload(registerDto);
    const saved = await this.apExamRepository.save(
      this.apExamRepository.create({
        ...registration,
        paymentStatus: "pending",
      }),
    );
    return this.toResponse(saved);
  }

  async updateRegistration(registrationId: string, registerDto: RegisterApExamDto) {
    const existing = await this.findByIdOrThrow(registrationId);
    const nextEmail = registerDto.personalInformation.email.toLowerCase();
    const conflictingEmail = await this.apExamRepository.findOne({
      where: { email: nextEmail },
    });
    if (conflictingEmail && conflictingEmail.id !== registrationId) {
      throw new ConflictException("Duplicate email registration is not allowed");
    }

    const updatedPayload = this.buildRegistrationPayload(registerDto);
    const updated = await this.apExamRepository.save(
      this.apExamRepository.merge(existing, updatedPayload),
    );
    return this.toResponse(updated);
  }

  async getRegistrationByEmail(email: string) {
    const registration = await this.apExamRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!registration) {
      throw new NotFoundException("AP exam registration not found");
    }
    return this.toResponse(registration);
  }

  async getUserExamList(email: string) {
    const normalizedEmail = email.toLowerCase();
    const registrations = await this.apExamRepository.find({
      where: { email: normalizedEmail },
      order: { examDate: "ASC" },
    });

    return {
      email: normalizedEmail,
      exams: registrations.map((registration) => {
        const isExamPassed = this.hasExamDatePassed(registration.examDate);
        const canReschedule =
          registration.paymentStatus === "success" &&
          !isExamPassed &&
          (registration.rescheduleCount ?? 0) < 1;

        return {
          registrationId: registration.id,
          examId: registration.examId,
          examName: "IGBC AP Exam",
          examDate: registration.examDate,
          examTime: registration.examTime,
          paymentStatus: registration.paymentStatus,
          examStatus: isExamPassed ? "past" : "upcoming",
          actions: {
            reschedule: canReschedule,
          },
          rescheduleCount: registration.rescheduleCount ?? 0,
        };
      }),
    };
  }

  async rescheduleExam(registrationId: string, rescheduleDto: RescheduleExamDto) {
    const registration = await this.findByIdOrThrow(registrationId);

    if (registration.paymentStatus !== "success") {
      throw new BadRequestException("Reschedule is allowed only after successful payment");
    }

    if (this.hasExamDatePassed(registration.examDate)) {
      throw new BadRequestException("Cannot reschedule because exam date has already passed");
    }

    if ((registration.rescheduleCount ?? 0) >= 1) {
      throw new BadRequestException("Reschedule is allowed only one time");
    }

    const nextExamDate = this.parseAndValidateRescheduleDate(rescheduleDto.newExamDate);
    const today = this.getTodayAtMidnight();
    if (nextExamDate < today) {
      throw new BadRequestException("New exam date cannot be in the past");
    }

    const currentExamDate = this.parseDateString(registration.examDate);
    if (rescheduleDto.mode === "prepone" && !(nextExamDate < currentExamDate)) {
      throw new BadRequestException("For prepone, new exam date must be before current exam date");
    }
    if (rescheduleDto.mode === "postpone" && !(nextExamDate > currentExamDate)) {
      throw new BadRequestException("For postpone, new exam date must be after current exam date");
    }

    registration.previousExamDate = registration.examDate;
    registration.examDate = this.formatAsDateString(nextExamDate);
    registration.rescheduleCount = (registration.rescheduleCount ?? 0) + 1;
    registration.lastRescheduledAt = new Date();

    const updated = await this.apExamRepository.save(registration);
    return {
      registrationId: updated.id,
      examId: updated.examId,
      examDate: updated.examDate,
      examTime: updated.examTime,
      rescheduleCount: updated.rescheduleCount ?? 0,
      message: "Exam rescheduled successfully",
    };
  }

  async getReviewData(registrationId: string) {
    const registration = await this.findByIdOrThrow(registrationId);
    return this.toResponse(registration);
  }

  async updatePaymentStatus(registrationId: string, paymentDto: PaymentUpdateDto) {
    const registration = await this.findByIdOrThrow(registrationId);
    registration.paymentStatus = paymentDto.status;
    registration.paymentTransactionId = paymentDto.transactionId;

    if (paymentDto.status === "success") {
      if (!registration.examId) {
        registration.examId = await this.generateUniqueExamId();
      }
    }

    const updated = await this.apExamRepository.save(registration);
    return {
      registrationId: updated.id,
      examId: updated.examId,
      paymentStatus: updated.paymentStatus,
      message:
        updated.paymentStatus === "success"
          ? "Payment successful. AP exam registration confirmed."
          : "Payment failed. Please retry payment to confirm registration.",
      notifications:
        updated.paymentStatus === "success"
          ? {
              email: "triggered",
              sms: "triggered",
            }
          : {
              email: "not_triggered",
              sms: "not_triggered",
            },
    };
  }

  getSelectableSaturdays(year: number, month: number) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      throw new BadRequestException("Month must be between 1 and 12");
    }

    const firstSaturday = this.findNthSaturday(year, month, 1);
    const thirdSaturday = this.findNthSaturday(year, month, 3);
    return {
      year,
      month,
      selectableDates: [this.formatAsDateString(firstSaturday), this.formatAsDateString(thirdSaturday)],
      fixedTime: ApExamService.FIXED_EXAM_TIME,
      feeAmount: ApExamService.FIXED_EXAM_FEE,
    };
  }

  validateExamDate(examDateInput: string) {
    const examDate = this.parseAndValidateExamDate(examDateInput);
    const validUntil = new Date(examDate);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    return {
      isValid: true,
      examDate: this.formatAsDateString(examDate),
      examTime: ApExamService.FIXED_EXAM_TIME,
      validUntil: this.formatAsDateString(validUntil),
    };
  }

  private buildRegistrationPayload(registerDto: RegisterApExamDto): Partial<ApExamRegistration> {
    const examDate = this.parseAndValidateExamDate(registerDto.examSlotSelection.examDate);
    const validUntil = new Date(examDate);
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    return {
      email: registerDto.personalInformation.email.toLowerCase(),
      firstName: registerDto.personalInformation.firstName,
      lastName: registerDto.personalInformation.lastName,
      mobileNumber: registerDto.personalInformation.mobileNumber,
      addressLine1: registerDto.addressDetails.addressLine1,
      addressLine2: registerDto.addressDetails.addressLine2,
      city: registerDto.addressDetails.city,
      state: registerDto.addressDetails.state,
      pincode: registerDto.addressDetails.pincode,
      highestQualification: registerDto.educationalDetails.highestQualification,
      yearsOfExperience: registerDto.educationalDetails.yearsOfExperience,
      organizationName: registerDto.organizationDetails?.organizationName,
      designation: registerDto.organizationDetails?.designation,
      examDate: this.formatAsDateString(examDate),
      examTime: ApExamService.FIXED_EXAM_TIME,
      validUntil: this.formatAsDateString(validUntil),
      feeAmount: ApExamService.FIXED_EXAM_FEE,
    };
  }

  private async generateUniqueExamId(): Promise<string> {
    const year = new Date().getFullYear();
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      const examId = `IGBC-AP-${year}-${suffix}`;
      const exists = await this.apExamRepository.findOne({
        where: { examId },
      });
      if (!exists) {
        return examId;
      }
    }
    throw new ConflictException("Could not generate unique Exam ID. Please retry.");
  }

  private async findByIdOrThrow(registrationId: string): Promise<ApExamRegistration> {
    const registration = await this.apExamRepository.findOne({
      where: { id: registrationId },
    });
    if (!registration) {
      throw new NotFoundException("AP exam registration not found");
    }
    return registration;
  }

  private parseAndValidateExamDate(examDateInput: string): Date {
    const examDate = new Date(examDateInput);
    if (Number.isNaN(examDate.getTime())) {
      throw new BadRequestException("Exam date is invalid");
    }

    // Convert to local midnight to avoid timezone-related date shifts.
    const normalizedExamDate = new Date(
      examDate.getFullYear(),
      examDate.getMonth(),
      examDate.getDate(),
    );

    if (!this.isFirstOrThirdSaturday(normalizedExamDate)) {
      throw new BadRequestException("Exam date must be on 1st or 3rd Saturday only");
    }

    return normalizedExamDate;
  }

  private isFirstOrThirdSaturday(date: Date): boolean {
    if (date.getDay() !== 6) {
      return false;
    }
    const dayOfMonth = date.getDate();
    return (dayOfMonth >= 1 && dayOfMonth <= 7) || (dayOfMonth >= 15 && dayOfMonth <= 21);
  }

  private findNthSaturday(year: number, month: number, nth: 1 | 3): Date {
    const firstDay = new Date(year, month - 1, 1);
    const dayOffset = (6 - firstDay.getDay() + 7) % 7;
    const firstSaturdayDate = 1 + dayOffset;
    const targetDate = nth === 1 ? firstSaturdayDate : firstSaturdayDate + 14;
    return new Date(year, month - 1, targetDate);
  }

  private formatAsDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private hasExamDatePassed(examDateString: string): boolean {
    const examDate = this.parseDateString(examDateString);
    return examDate < this.getTodayAtMidnight();
  }

  private parseAndValidateRescheduleDate(examDateInput: string): Date {
    const parsed = this.parseDateString(examDateInput);
    if (parsed.getDay() !== 6) {
      throw new BadRequestException("Reschedule date must be a Saturday");
    }
    return parsed;
  }

  private parseDateString(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    const parsedDate = new Date(year, month - 1, day);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException("Date is invalid");
    }
    return parsedDate;
  }

  private getTodayAtMidnight(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private toResponse(registration: ApExamRegistration) {
    return {
      registrationId: registration.id,
      personalInformation: {
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        mobileNumber: registration.mobileNumber,
      },
      addressDetails: {
        addressLine1: registration.addressLine1,
        addressLine2: registration.addressLine2,
        city: registration.city,
        state: registration.state,
        pincode: registration.pincode,
      },
      educationalDetails: {
        highestQualification: registration.highestQualification,
        yearsOfExperience: registration.yearsOfExperience,
      },
      organizationDetails: {
        organizationName: registration.organizationName,
        designation: registration.designation,
      },
      examSlotSelection: {
        examDate: registration.examDate,
        examTime: registration.examTime,
        validUntil: registration.validUntil,
      },
      feeDetails: {
        amount: registration.feeAmount,
        currency: "INR",
      },
      assessment: {
        reportUrl: registration.reportUrl ?? null,
        score: registration.examScore ?? null,
        reportUploadedAt: registration.reportUploadedAt ?? null,
        resultStatus: registration.resultStatus ?? null,
        resultUpdatedAt: registration.resultUpdatedAt ?? null,
      },
      paymentStatus: registration.paymentStatus,
      examId: registration.examId,
    };
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
      throw new ForbiddenException("Admin access only");
    }
  }
}
