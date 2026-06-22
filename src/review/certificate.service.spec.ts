import { BadRequestException } from "@nestjs/common";
import { CertificateService } from "./certificate.service";
import type { CertificationApplication } from "../certification-application/certification-application.entity";

describe("CertificateService.accept", () => {
  const certApp = {
    id: 1,
    projectId: 8,
    isSubmitted: true,
    isPending: false,
    clientReportStatus: "accepted",
    certificateStatus: "accepted",
  } as CertificationApplication;

  const buildService = () => {
    const certificationAccessService = {
      canViewCertificateTab: jest.fn().mockReturnValue(true),
      canAcceptCertificate: jest.fn().mockReturnValue(false),
      canDownloadCertificate: jest.fn().mockReturnValue(true),
    };
    const service = new CertificateService(
      { findOne: jest.fn().mockResolvedValue(certApp) } as never,
      { findOne: jest.fn() } as never,
      { find: jest.fn() } as never,
      { findOne: jest.fn() } as never,
      {
        resolveAccess: jest.fn().mockResolvedValue({
          role: "owner",
          user: { id: "user-1", userType: "client" },
          project: { createdByUserId: "user-1" },
        }),
      } as never,
      { getCurrentCycle: jest.fn().mockResolvedValue({ cycleStatus: "accepted" }) } as never,
      { sumAwardedPointsForProject: jest.fn() } as never,
      certificationAccessService as never,
      { resolveLevel: jest.fn() } as never,
      { storeCertificate: jest.fn() } as never,
      { resolveForProject: jest.fn() } as never,
      { log: jest.fn() } as never,
      { transaction: jest.fn() } as never,
    );
    return { service, certificationAccessService };
  };

  it("returns 400 when certificate was already accepted", async () => {
    const { service } = buildService();
    await expect(service.accept("owner@example.com", 8)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.accept("owner@example.com", 8)).rejects.toThrow(
      "Certificate has already been accepted",
    );
  });
});
