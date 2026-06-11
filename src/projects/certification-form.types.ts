export type RatingDocumentDto = {
  id: string;
  tab: string;
  subtab: string;
  paramName: string;
  fileName: string;
  filePath: string;
  fileType: string | null;
  updatedAt?: string;
};

export type RatingDataRowDto = {
  id: string;
  tab: string;
  subtab: string;
  paramName: string;
  value: string | null;
  updatedAt?: string;
};

export type CertificationFormResponse = {
  projectId: string;
  ratingType: string;
  versionType: string;
  currentTab: string | null;
  currentSubtab: string | null;
  data: RatingDataRowDto[];
  documents: RatingDocumentDto[];
};

export const FILE_FIELD_TYPES = new Set(["u", "M"]);

export function isFileFieldType(type: string): boolean {
  return FILE_FIELD_TYPES.has(type);
}
