import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApExamRegistration } from "./ap-exam-registration.entity";
import { PaymentUpdateDto } from "./dto/payment-update.dto";
import { RegisterApExamDto } from "./dto/register-ap-exam.dto";

@Injectable()
export class ApExamService {
  private static readonly FIXED_EXAM_TIME = "11:00 AM";
  private static readonly FIXED_EXAM_FEE = 3000;

  constructor(
    @InjectRepository(ApExamRegistration)
    private readonly apExamRepository: Repository<ApExamRegistration>,
  ) {}

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
      paymentStatus: registration.paymentStatus,
      examId: registration.examId,
    };
  }
}
