/**
 * Config-driven annexure definitions (JSON under `data/annexures/`).
 * Loaded into certification workspace as `annexureSchemas[tab/subtab]`.
 */

/** How this annex is rendered in MERN. */
export type AnnexureRenderMode =
  | "table"
  | "comparison"
  | "dwelling"
  | "rainwater"
  | "waterEfficiency"
  | "waterBalance"
  | "wastewaterReuse"
  | "reference";

export type AnnexureDwellingFieldDef = {
  param: string;
  label: string;
  type: "text" | "number" | "select" | "readonly";
  step?: string;
  options?: Record<string, string>;
  computed?: boolean;
  section?: string;
  placement?: 'beforeFenestration' | 'afterFenestration';
};

export type AnnexureDwellingOrientationColumnDef = {
  param: string;
  header: string;
  type: "text" | "number" | "select" | "readonly";
  step?: string;
  width?: string;
  options?: Record<string, string>;
  computed?: boolean;
};

export type AnnexureDwellingRowTableFooterCellDef = {
  kind: 'empty' | 'label' | 'field';
  colspan?: number;
  text?: string;
  param?: string;
};

export type AnnexureDwellingRowTableFooterRowDef = {
  cells: AnnexureDwellingRowTableFooterCellDef[];
};

export type AnnexureDwellingLayoutDef = {
  layoutMode?: 'sections' | 'rowTable';
  addTowerLabel?: string;
  addRowLabel?: string;
  defaultTowerCount?: number;
  minTowers?: number;
  maxTowers?: number;
  orientationRowCount?: number;
  minOrientationRows?: number;
  maxOrientationRows?: number;
  towerNameParam?: string;
  complianceHeaderParam?: string;
  complianceColumnCount?: number;
  rowTableFooter?: AnnexureDwellingRowTableFooterRowDef[];
  globalFields?: AnnexureDwellingFieldDef[];
  towerFields?: AnnexureDwellingFieldDef[];
  orientationColumns?: AnnexureDwellingOrientationColumnDef[];
};

/** Laravel `__get_dwelling_data` param names (stored as JSON map keyed by tower index). */
export type AnnexureDwellingStoreDef = {
  /** Params with one value per tower (JSON array of length 1). */
  towerScalarParams?: string[];
  /** Params with `orientationRowCount` values per tower. */
  orientationParams?: string[];
  /** Single string per tower (e.g. `enegry_tower`). */
  towerStringParams?: string[];
  globalParams?: string[];
};

/** One parameter row: label + base/design textareas (Laravel `param[]` JSON arrays). */
export type AnnexureComparisonRowDef = {
  label: string;
  baseParam: string;
  designParam: string;
  /** Optional rowspan label in first column (e.g. Fenestration). */
  groupLabel?: string;
  /** When true, render `groupLabel` with rowspan on this row. */
  groupStart?: boolean;
};

export type AnnexureComparisonSectionDef = {
  title: string;
  rows: AnnexureComparisonRowDef[];
};

export type AnnexureComparisonLayoutDef = {
  columnHeaders?: [string, string, string];
  defaultRowCount?: number;
  sections: AnnexureComparisonSectionDef[];
};

export type AnnexureExpr =
  | { const: number | string }
  | { ref: string }
  | { op: "add" | "sub" | "mul" | "div"; args: AnnexureExpr[] }
  | { op: "neg"; arg: AnnexureExpr }
  | { op: "eq" | "neq" | "lt" | "lte" | "gt" | "gte"; left: AnnexureExpr; right: AnnexureExpr }
  | { op: "and" | "or"; args: AnnexureExpr[] }
  | { op: "not"; arg: AnnexureExpr }
  | { op: "if"; cond: AnnexureExpr; then: AnnexureExpr; else: AnnexureExpr }
  | { op: "parseNum"; arg: AnnexureExpr }
  | { op: "isEmpty"; arg: AnnexureExpr }
  | { op: "sumRows"; field: string }
  | { op: "sumRowsInclude"; field: string; includeField: string; includeValues: (number | string)[] }
  | { op: "sumRowsExclude"; field: string; excludeField: string; excludeValues: (number | string)[] }
  | { op: "minRowsPositive"; field: string }
  | { op: "allRowsYes"; field: string }
  | { op: "mapGet"; mapKey: string; key: AnnexureExpr; default?: number | string }
  | { op: "formatNum"; arg: AnnexureExpr; decimals?: number }
  | { op: "min"; args: AnnexureExpr[] };

export type AnnexureWhenRule = {
  /** When true, `targets` are visible (hidden otherwise). Omit = always visible. */
  when?: AnnexureExpr;
  targets: string[];
};

export type AnnexureColumnDef = {
  id: string;
  /** Laravel `__get_rating_data` param name (array JSON in DB). */
  param: string;
  header: string;
  type: "text" | "number" | "select" | "readonly";
  width?: string;
  step?: string;
  options?: Record<string, string>;
  /** If true, value is computed by rowPipeline (not user-edited). */
  computed?: boolean;
  /** Optional visibility for this column header/cell. */
  showWhen?: AnnexureExpr;
};

export type AnnexureTableHeaderCellDef = {
  text?: string;
  colspan?: number;
};

export type AnnexureSourceMappingDef = {
  target: string;
  source: string;
  readonly?: boolean;
  prefillOnly?: boolean;
};

export type AnnexureSourceAnnexDef = {
  tab?: string;
  subtab: string;
  mappings: AnnexureSourceMappingDef[];
};

export type AnnexureVentilationSummarySourceDef = {
  id: string;
  label: string;
  subtab: string;
  dwellingField: string;
  mandatoryField: string;
  creditField: string;
  floorFilter: 'lt5' | 'gte5' | 'always';
};

export type AnnexureRainfallSectionDef = {
  fixedRowCount?: number;
  yearOptions?: Record<string, string>;
  monthOptions?: Record<string, string>;
};

export type AnnexureRainwaterLayoutDef = {
  rainfall: AnnexureRainfallSectionDef;
  caseOptions?: Record<string, string>;
  surfaceTable?: AnnexureTableDef;
  summary?: AnnexureSummaryRowDef[];
};

export type WaterEfficiencyPresetDef = {
  id: string;
  fixtureType: string;
  detailParam: string;
  prefix: string;
  category: "flush" | "flow";
  defaults: {
    duration?: string;
    daily?: string;
    base?: string;
    unit?: string;
  };
};

export type AnnexureWaterEfficiencyLayoutDef = {
  addRowLabel?: string;
  minDynamicRows?: number;
  maxDynamicRows?: number;
  presetRows: WaterEfficiencyPresetDef[];
};

export type WaterBalanceRowDef = {
  label: string;
  dailyParam: string;
  annualParam: string;
  editableDaily?: boolean;
  source?: "wcTwoFlush" | "wcTwoFlow";
};

export type WaterBalanceSectionDef = {
  id: string;
  title: string;
  totalDailyParam: string;
  totalAnnualParam: string;
  rows: WaterBalanceRowDef[];
};

export type AnnexureWaterBalanceLayoutDef = {
  annualDays?: number;
  consumptionFromAnnex?: {
    tab?: string;
    subtab?: string;
    flushDailyParam?: string;
    flowDailyParam?: string;
  };
  sections: WaterBalanceSectionDef[];
};

export type WastewaterReuseSectionDef = {
  title: string;
  rows: WaterBalanceRowDef[];
};

export type AnnexureWastewaterReuseLayoutDef = {
  annualDays?: number;
  wasteFromAnnex?: {
    tab?: string;
    subtab?: string;
    flushParam?: string;
    flowParam?: string;
  };
  stpCapacityParam?: string;
  stpCapacitySubtab?: string;
  reuseSection: WastewaterReuseSectionDef;
};

export type AnnexureVentilationSummaryDef = {
  tab?: string;
  floorCountSubtab?: string;
  floorCountParam?: string;
  sources: AnnexureVentilationSummarySourceDef[];
};

export type AnnexureTableDef = {
  title?: string;
  addRowLabel?: string;
  allowAddRows?: boolean;
  defaultRowCount?: number;
  minRows?: number;
  maxRows?: number;
  stickyFirstColumns?: number;
  headerRows?: AnnexureTableHeaderCellDef[][];
  columns: AnnexureColumnDef[];
};

export type AnnexureFooterCellDef = {
  kind: "label" | "field" | "spacer";
  colspan?: number;
  text?: string;
  param?: string;
  type?: "readonly";
  /** When true, footer scalar is user-editable (stored in `scalarParams`). */
  editable?: boolean;
  inputType?: "text" | "number";
  step?: string;
  /** Field id from row columns or scalar key for aggregates */
  aggregateOf?: string;
};

export type AnnexureFooterRowDef = {
  cells: AnnexureFooterCellDef[];
};

export type AnnexureSummaryRowDef = {
  label: string;
  param: string;
  type: "readonly";
};

export type AnnexureSummaryGroupDef = {
  title: string;
  rows: AnnexureSummaryRowDef[];
};

export type AnnexureRowStep = {
  set: string;
  expr: AnnexureExpr;
};

export type AnnexureScalarStep = {
  set: string;
  expr: AnnexureExpr;
};

/** Optional: restrict schema to these rating type IDs (null = all). */
export type AnnexureSchemaDefinition = {
  id: string;
  title: string;
  schemaVersion: number;
  ratingTypeIds?: number[] | null;
  /** `reference` = Laravel blade sourced; add `table` JSON later for full editor. */
  renderMode?: AnnexureRenderMode;
  /** Laravel dot include (e.g. `.rating.greenhomes.rwh-one`). */
  bladeInclude?: string | null;
  /** Legacy Laravel blade filename (optional); blades are no longer shipped in-repo. */
  referenceFile?: string | null;
  referenceDescription?: string;
  /** Relative path under `data/greenhome/{version}/` to baseline catalog JSON. */
  baselineCatalogPath?: string;
  /** Populated at load from catalog + used by `mapGet` (e.g. `lpdBaselines`). */
  lookupMaps?: Record<string, Record<string, number | string>>;
  /** Laravel tab for rating_data (blade hidden `table` field). */
  storageTable?: string;
  /** Base case / design case textarea grid (no calculations). */
  comparisonLayout?: AnnexureComparisonLayoutDef;
  /** All `baseParam` / `designParam` names for save/hydrate. */
  comparisonParams?: string[];
  dwellingLayout?: AnnexureDwellingLayoutDef;
  dwellingStore?: AnnexureDwellingStoreDef;
  dwellingRowPipeline?: AnnexureRowStep[];
  dwellingTowerPipeline?: AnnexureScalarStep[];
  sourceAnnex?: AnnexureSourceAnnexDef;
  ventilationSummary?: AnnexureVentilationSummaryDef;
  rainwaterLayout?: AnnexureRainwaterLayoutDef;
  waterEfficiencyLayout?: AnnexureWaterEfficiencyLayoutDef;
  waterBalanceLayout?: AnnexureWaterBalanceLayoutDef;
  wastewaterReuseLayout?: AnnexureWastewaterReuseLayoutDef;
  table?: AnnexureTableDef;
  footerRows?: AnnexureFooterRowDef[];
  summary?: AnnexureSummaryRowDef[];
  /** Multiple summary blocks (e.g. circulation + sensor sections). */
  summaryGroups?: AnnexureSummaryGroupDef[];
  /** Per-row derived fields, evaluated in order for each row. */
  rowPipeline?: AnnexureRowStep[];
  /** Single-value fields (footer totals + summary), evaluated after rows & aggregates. */
  scalarPipeline?: AnnexureScalarStep[];
  /** Params stored as a single JSON string (one DB row) instead of per-column arrays. */
  bundleStorageParam?: string;
  /** Column `param` names included in bundle (excluding scalars listed separately). */
  bundledRowParams?: string[];
  /** Scalar param names (single value per annex, not JSON array). */
  scalarParams?: string[];
};
