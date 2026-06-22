import { CertificationAccessService } from "./certification-access.service";
import type { CertificationApplication } from "./certification-application.entity";

describe("CertificationAccessService", () => {
  const service = new CertificationAccessService();

  const baseApp = {
    isSubmitted: false,
    isPending: false,
    clientReportStatus: "pending",
    certificateStatus: "pending",
  } as CertificationApplication;

  it("allows edit when not submitted", () => {
    expect(service.canEditApplication(baseApp)).toBe(true);
    expect(service.canEditSection(baseApp, "water", "fixtures", [])).toBe(true);
  });

  it("blocks edit when submitted without pending", () => {
    const app = { ...baseApp, isSubmitted: true, isPending: false } as CertificationApplication;
    expect(service.canEditApplication(app)).toBe(false);
    expect(service.canEditSection(app, "water", "fixtures", [])).toBe(false);
  });

  it("allows pending section only when is_pending", () => {
    const app = { ...baseApp, isSubmitted: true, isPending: true } as CertificationApplication;
    const pending = [{ tab: "water", subtab: "fixtures", pendingPoints: 2 }];
    expect(service.canEditApplication(app)).toBe(false);
    expect(service.canEditSection(app, "water", "fixtures", pending)).toBe(true);
    expect(service.canEditSection(app, "energy", "hvac", pending)).toBe(false);
  });

  it("shows certificate tab when submitted, not pending, report accepted", () => {
    const app = {
      ...baseApp,
      isSubmitted: true,
      isPending: false,
      clientReportStatus: "accepted",
    } as CertificationApplication;
    expect(service.canViewCertificateTab(app, { cycleStatus: "accepted" })).toBe(true);
  });

  it("hides certificate tab when pending", () => {
    const app = {
      ...baseApp,
      isSubmitted: true,
      isPending: true,
      clientReportStatus: "accepted",
    } as CertificationApplication;
    expect(service.canViewCertificateTab(app, { cycleStatus: "accepted" })).toBe(false);
  });
});
