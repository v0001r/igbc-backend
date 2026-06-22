import type { Repository } from "typeorm";
import type { CertificateActionLog } from "./certificate-action-log.entity";

export async function fetchLatestCertificateLogsByApplication(
  repository: Repository<CertificateActionLog>,
  applicationIds: number[],
): Promise<Map<number, CertificateActionLog>> {
  if (!applicationIds.length) return new Map();

  const logs = await repository
    .createQueryBuilder("log")
    .distinctOn(["log.application_id"])
    .where("log.application_id IN (:...applicationIds)", { applicationIds })
    .orderBy("log.application_id", "ASC")
    .addOrderBy("log.created_at", "DESC")
    .getMany();

  return new Map(logs.map((log) => [log.applicationId, log]));
}
