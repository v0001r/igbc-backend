import { Injectable } from "@nestjs/common";
import { RatingConfigService } from "../rating-config/rating-config.service";
import {
  fieldIsRequired,
  getFieldsForTabSubtab,
  getSubtabsForTab,
} from "../rating-config/rating-config.resolver";
import { isFileFieldType, type CertificationFormResponse } from "./certification-form.types";
import type { RegistrationRatingContext } from "./rating-form.service";

export type CompletionMissingItem = {
  tab: string;
  subtab: string;
  field: string;
};

@Injectable()
export class CertificationCompletionService {
  constructor(private readonly ratingConfigService: RatingConfigService) {}

  validateCompletion(
    ctx: RegistrationRatingContext,
    form: CertificationFormResponse,
  ): { complete: boolean; missing: CompletionMissingItem[] } {
    const config = this.ratingConfigService.getConfig(ctx.ratingType, ctx.versionType);
    const tabs = Array.isArray(config.tabs) ? config.tabs : [];
    const missing: CompletionMissingItem[] = [];

    for (const tabDef of tabs) {
      const tab = tabDef.slug;
      const subtabs = getSubtabsForTab(config, tab);
      for (const subtabDef of subtabs) {
        const subtab = subtabDef.sub_slug;
        const fields = getFieldsForTabSubtab(config, tab, subtab).filter(
          (f) => f.name && f.type !== "hr",
        );
        if (fields.length === 0) continue;

        for (const field of fields) {
          if (!fieldIsRequired(field)) continue;
          if (!this.fieldHasValue(form, tab, subtab, field.name!, field.type ?? "")) {
            missing.push({ tab, subtab, field: field.name! });
          }
        }
      }
    }

    return { complete: missing.length === 0, missing };
  }

  private fieldHasValue(
    form: CertificationFormResponse,
    tab: string,
    subtab: string,
    paramName: string,
    type: string,
  ): boolean {
    if (isFileFieldType(type)) {
      return form.documents.some(
        (d) => d.tab === tab && d.subtab === subtab && d.paramName === paramName,
      );
    }
    const row = form.data.find(
      (d) => d.tab === tab && d.subtab === subtab && d.paramName === paramName,
    );
    return Boolean((row?.value ?? "").trim());
  }
}
