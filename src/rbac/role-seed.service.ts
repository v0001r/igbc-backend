import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { Role } from "./role.entity";
import { ROLE_USER_TYPE_MAP, RoleName, USER_TYPE_ROLE_MAP } from "./role.enum";

@Injectable()
export class RoleSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedRoles();
    await this.backfillUserRoles();
  }

  private async seedRoles(): Promise<void> {
    for (const roleName of Object.values(RoleName)) {
      const existing = await this.roleRepository.findOne({ where: { roleName } });
      if (!existing) {
        await this.roleRepository.save(this.roleRepository.create({ roleName }));
      }
    }
  }

  private async backfillUserRoles(): Promise<void> {
    const roles = await this.roleRepository.find();
    const roleByName = new Map(roles.map((r) => [r.roleName, r.id]));
    const users = await this.userRepository.find();
    for (const user of users) {
      const roleName = USER_TYPE_ROLE_MAP[user.userType] ?? RoleName.CLIENT;
      const roleId = roleByName.get(roleName);
      const updates: Partial<User> = {};
      if (roleId && user.roleId !== roleId) {
        updates.roleId = roleId;
      }
      if (!user.status) {
        updates.status = "active";
      }
      if (Object.keys(updates).length > 0) {
        await this.userRepository.update(user.id, updates);
      }
    }
  }

  async findRoleByName(roleName: RoleName): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { roleName } });
  }

  getUserTypeForRole(roleName: RoleName): "a" | "s" | "T" | "m" {
    return ROLE_USER_TYPE_MAP[roleName];
  }
}
