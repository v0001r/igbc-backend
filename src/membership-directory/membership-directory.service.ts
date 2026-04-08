import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ListMembersDto } from "./dto/list-members.dto";
import { UpsertMemberDto } from "./dto/upsert-member.dto";
import { MembershipDirectoryMember } from "./membership-directory.entity";

@Injectable()
export class MembershipDirectoryService implements OnModuleInit {
  constructor(
    @InjectRepository(MembershipDirectoryMember)
    private readonly memberRepository: Repository<MembershipDirectoryMember>,
  ) {}

  async onModuleInit() {
    const count = await this.memberRepository.count();
    if (count > 0) {
      return;
    }

    const dummyMembers: Array<Partial<MembershipDirectoryMember>> = [
      {
        logo: "AR",
        name: "Arcline Architects",
        membershipType: "Founding Membership",
        website: "https://arcline.example.com",
        category: "Architects",
        email: "hello@arcline.example.com",
        phone: "+91 40 4000 1001",
      },
      {
        logo: "EV",
        name: "EcoVolt Engineers",
        membershipType: "Annual Membership",
        website: "https://ecovolt.example.com",
        category: "Engineers",
        email: "contact@ecovolt.example.com",
        phone: "+91 40 4000 1002",
      },
      {
        logo: "BD",
        name: "BuildDwell Developers",
        membershipType: "Annual Membership",
        website: "https://builddwell.example.com",
        category: "Builders & Developers",
        email: "info@builddwell.example.com",
        phone: "+91 40 4000 1003",
      },
      {
        logo: "GC",
        name: "GreenCore Corporate",
        membershipType: "Founding Membership",
        website: "https://greencore.example.com",
        category: "Corporate",
        email: "connect@greencore.example.com",
        phone: "+91 40 4000 1004",
      },
      {
        logo: "SC",
        name: "Sustain Consultants",
        membershipType: "Individual Membership",
        website: "https://sustainconsult.example.com",
        category: "Service Consultants",
        email: "team@sustainconsult.example.com",
        phone: "+91 40 4000 1005",
      },
      {
        logo: "EA",
        name: "EnergyAudit Alliance",
        membershipType: "Individual Membership",
        website: "https://energyaudit.example.com",
        category: "Energy Auditors",
        email: "mail@energyaudit.example.com",
        phone: "+91 40 4000 1006",
      },
    ];

    await this.memberRepository.save(this.memberRepository.create(dummyMembers));
  }

  async listMembers(query: ListMembersDto) {
    const qb = this.memberRepository.createQueryBuilder("member");

    if (query.search?.trim()) {
      qb.andWhere("LOWER(member.name) LIKE :search", {
        search: `%${query.search.trim().toLowerCase()}%`,
      });
    }

    if (query.category?.trim() && query.category !== "All") {
      qb.andWhere("member.category = :category", { category: query.category });
    }

    if (query.membershipType && query.membershipType !== "All") {
      qb.andWhere("member.membershipType = :membershipType", {
        membershipType: query.membershipType,
      });
    }

    if (query.startsWith?.trim() && query.startsWith !== "All") {
      qb.andWhere("UPPER(member.name) LIKE :startsWith", {
        startsWith: `${query.startsWith.trim().toUpperCase()}%`,
      });
    }

    qb.orderBy("member.name", "ASC");
    return qb.getMany();
  }

  async createMember(payload: UpsertMemberDto) {
    const entity = this.memberRepository.create({
      ...payload,
      logo: payload.logo ?? payload.name.slice(0, 2).toUpperCase(),
    });
    return this.memberRepository.save(entity);
  }

  async updateMember(id: string, payload: UpsertMemberDto) {
    await this.memberRepository.update(id, {
      ...payload,
      logo: payload.logo ?? payload.name.slice(0, 2).toUpperCase(),
    });
    return this.memberRepository.findOneByOrFail({ id });
  }

  async deleteMember(id: string) {
    await this.memberRepository.delete(id);
    return { success: true };
  }
}
