import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Client } from "./client.entity";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Organization } from "./organization.entity";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      ...registerDto,
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
      userType: registerDto.userType ?? "m",
    });
    const savedUser = await this.usersRepository.save(user);
    const savedClient = await this.clientRepository.save(this.clientRepository.create({ user: savedUser }));
    await this.organizationRepository.save(this.organizationRepository.create({ client: savedClient }));
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByEmailWithClient(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: {
        client: {
          organization: true,
        },
      },
    });
  }

  async getPublicProfileByEmail(email: string) {
    const user = await this.findByEmailWithClient(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.toPublicUser(user);
  }

  async getMembershipDirectoryEntries() {
    const users = await this.usersRepository.find({
      where: { prefShowProfilePublicly: true },
      relations: {
        client: {
          organization: true,
        },
      },
      order: { displayName: "ASC" },
    });

    return {
      members: users.map((user) => {
        const organizationType = user.client?.organization?.organizationType ?? "";
        const normalizedOrgType = organizationType.toLowerCase();
        const membershipType = normalizedOrgType.includes("founding")
          ? "Founding Membership"
          : normalizedOrgType.includes("annual")
            ? "Annual Membership"
            : "Individual Membership";
        const displayName = user.client?.organization?.organizationName || user.displayName;

        return {
          id: user.id,
          logo: this.getInitials(displayName),
          name: displayName,
          membershipType,
          website: "N/A",
          category: organizationType || "General",
          contactEmail: user.email,
          contactPhone: user.mobile || user.telephone || "",
        };
      }),
    };
  }

  async getUsersByIds(userIds: string[]) {
    const uniqueIds = [...new Set(userIds.filter((id) => Boolean(id?.trim())))];
    if (uniqueIds.length === 0) {
      return [];
    }

    return this.usersRepository.find({
      where: uniqueIds.map((id) => ({ id })),
    });
  }

  async updateProfileByEmail(email: string, updateProfileDto?: UpdateProfileDto) {
    const user = await this.findByEmailWithClient(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const payload = updateProfileDto ?? {};

    const userUpdates = this.pickDefined<Partial<User>>({
      salutation: payload.salutation,
      firstName: payload.firstName,
      middleName: payload.middleName,
      lastName: payload.lastName,
      displayName: payload.displayName,
      state: payload.state,
      country: payload.country,
      mobile: payload.mobile,
      telephone: payload.telephone,
      prefEmailNotifications: payload.prefEmailNotifications,
      prefSmsAlerts: payload.prefSmsAlerts,
      prefNewsletter: payload.prefNewsletter,
      preferredLanguage: payload.preferredLanguage,
      prefShowProfilePublicly: payload.prefShowProfilePublicly,
      prefShowEmailToMembers: payload.prefShowEmailToMembers,
    });

    const clientUpdates = this.pickDefined<Partial<Client>>({
      city: payload.city,
      pincode: payload.pincode,
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
    });

    const organizationUpdates = this.pickDefined<Partial<Organization>>({
      organizationName: payload.organizationName,
      designation: payload.designation,
      department: payload.department,
      yearsOfExperience: payload.yearsOfExperience,
      employeeId: payload.employeeId,
      organizationType: payload.organizationType,
    });

    console.log("userUpdates", userUpdates);
    console.log("clientUpdates", clientUpdates);
    console.log("organizationUpdates", organizationUpdates);
    const updatedUser = this.usersRepository.merge(user, userUpdates);
    await this.usersRepository.save(updatedUser);

    const existingClient =
      user.client ??
      this.clientRepository.create({
        user,
      });

    const updatedClient = this.clientRepository.merge(existingClient, clientUpdates);
    const savedClient = await this.clientRepository.save(updatedClient);

    const existingOrganization =
      user.client?.organization ??
      this.organizationRepository.create({
        client: savedClient,
      });
    const updatedOrganization = this.organizationRepository.merge(existingOrganization, organizationUpdates);
    await this.organizationRepository.save(updatedOrganization);

    const userWithClient = await this.findByEmailWithClient(email);
    if (!userWithClient) {
      throw new NotFoundException("User not found");
    }
    return this.toPublicUser(userWithClient);
  }

  private pickDefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
  }

  private toPublicUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, client, ...publicUser } = user;
    return {
      ...publicUser,
      city: client?.city,
      pincode: client?.pincode,
      addressLine1: client?.addressLine1,
      addressLine2: client?.addressLine2,
      organizationName: client?.organization?.organizationName,
      designation: client?.organization?.designation,
      department: client?.organization?.department,
      yearsOfExperience: client?.organization?.yearsOfExperience,
      employeeId: client?.organization?.employeeId,
      organizationType: client?.organization?.organizationType,
    };
  }

  private getInitials(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      return "IG";
    }
    const parts = trimmed.split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  }
}
