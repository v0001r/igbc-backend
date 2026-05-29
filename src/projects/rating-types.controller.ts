import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RatingTypeService } from "./rating-type.service";

@ApiTags("rating-types")
@Controller("rating-types")
export class RatingTypesController {
  constructor(private readonly ratingTypeService: RatingTypeService) {}

  @ApiOperation({ summary: "List all rating types from database" })
  @Get()
  list() {
    return this.ratingTypeService.findAll();
  }

  @ApiOperation({ summary: "Get rating type by id" })
  @Get(":id")
  getById(@Param("id", ParseIntPipe) id: number) {
    return this.ratingTypeService.findById(id);
  }

  @ApiOperation({ summary: "Whether certification workspace config exists for this rating type" })
  @Get(":id/certification-available")
  async certificationAvailable(@Param("id", ParseIntPipe) id: number) {
    const row = await this.ratingTypeService.findById(id);
    if (!row) {
      return { id, available: false };
    }
    return {
      id,
      ratingName: row.ratingName,
      configKey: this.ratingTypeService.resolveConfigKeyForRow(row),
      versionType: this.ratingTypeService.resolveVersionForRow(
        row,
        this.ratingTypeService.resolveConfigKeyForRow(row) ?? "",
      ),
      available: this.ratingTypeService.hasCertificationConfig(row),
    };
  }
}
