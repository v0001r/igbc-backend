import { IsEmail, IsIn, IsNotEmpty, Matches, MinLength } from "class-validator";

export class CreateSupportEntryDto {
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  designation!: string;

  @IsNotEmpty()
  department!: string;

  @Matches(/^\d{10,15}$/, {
    message: "Phone must be numeric and between 10 to 15 digits",
  })
  phone!: string;

  @IsEmail()
  email!: string;

  @IsIn(["active", "inactive"])
  status!: "active" | "inactive";
}
