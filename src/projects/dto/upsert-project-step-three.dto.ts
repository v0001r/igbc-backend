import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyObject, IsObject } from "class-validator";

export class UpsertProjectStepThreeDto {
  @ApiProperty({
    description: "Complete step-3 contacts form payload (store as-is)",
    example: {
      parentOrganization: {
        rating: "IGBC Green Homes - Individual Dwelling Unit",
        isIgbcMember: true,
        organizationName: "ABC Constructions",
      },
      projectOwner: {
        firstName: "Ravi",
        lastName: "Kumar",
        mobile: "+91XXXXXXXXXX",
        email: "ravi@example.com",
      },
      projectCoordinator: {
        firstName: "Anita",
        lastName: "Sharma",
      },
      architect: {
        firstName: "John",
        lastName: "Doe",
      },
      consultant: {
        firstName: "Jane",
        lastName: "Doe",
      },
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  formData!: Record<string, unknown>;
}
