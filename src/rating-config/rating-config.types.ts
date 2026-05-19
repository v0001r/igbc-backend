export type RatingConfigTab = {
  name: string;
  slug: string;
  action?: string;
  checklist?: boolean;
  points?: number;
};

export type RatingConfigSubtab = {
  name: string;
  sub_slug: string;
  checklist?: boolean;
  required?: boolean;
  "pre-certificate"?: boolean;
  certificate?: boolean;
  points?: number;
};

export type RatingConfigFieldDef = {
  display_name?: string;
  name?: string;
  type?: string;
  readonly?: boolean;
  validation?: string;
  required?: boolean;
  valid_message?: string;
  "pre-certificate"?: boolean;
  certificate?: boolean;
  number?: string;
  options?: unknown;
  subtab?: string;
  related_to?: string;
  links?: unknown;
};

export type RatingRuntimeConfig = {
  tabs: RatingConfigTab[];
  subtabs_by_tab?: Record<string, RatingConfigSubtab[]>;
  subtabs?: Record<string, RatingConfigSubtab[]>;
  params: Record<string, unknown>;
  optionMap?: Record<string, unknown>;
};

export type RatingConfigEntryMeta = {
  key: string;
  label: string;
  registerId?: string;
  ratingTypeIds?: number[];
  abbreviations?: string[];
  defaultVersion: string;
  versionPaths: Record<string, string>;
};

export type AnnexureBladeRoute = {
  tab: string;
  subtab: string;
  version: string;
  bladeInclude: string | null;
  ratingTypeId5Only: boolean;
  ratingTypeExclude5: boolean;
};

export type ResolvedAnnexureDto = {
  tab: string;
  subtab: string;
  bladeInclude: string;
  customUiOnly: boolean;
} | null;

export type CertificationSectionDto = {
  tab: string;
  subtab: string;
  title: string;
  fields: RatingConfigFieldDef[];
  annexure: ResolvedAnnexureDto;
};

export type FieldRuleSetDto = import("./field-rules/field-rules.types").FieldRuleSet;

export type CertificationWorkspaceResponse = {
  projectId: string;
  projectCode: string;
  projectName: string;
  projectLabel: string;
  ratingTypeId: number;
  ratingTypeName: string;
  ratingKey: string;
  ratingLabel: string;
  versionType: string;
  config: RatingRuntimeConfig;
  form: import("../projects/certification-form.types").CertificationFormResponse;
  annexureRoutes: AnnexureBladeRoute[];
  /** Laravel-ported show/hide/readonly/compute rules keyed by `tab/subtab`. */
  fieldRules: Record<string, FieldRuleSetDto>;
};
