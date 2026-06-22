import { CertificateLevelService } from "./certification-access.service";

describe("CertificateLevelService", () => {
  const service = new CertificateLevelService();

  it("resolves default final levels", () => {
    expect(service.resolveLevel(2, "final", 55).level).toBe("Certified");
    expect(service.resolveLevel(2, "final", 65).level).toBe("Silver");
    expect(service.resolveLevel(2, "final", 75).level).toBe("Gold");
    expect(service.resolveLevel(2, "final", 85).level).toBe("Platinum");
    expect(service.resolveLevel(2, "final", 40).unrated).toBe(true);
  });

  it("resolves green interiors final levels", () => {
    expect(service.resolveLevel(5, "final", 35).level).toBe("Certified");
    expect(service.resolveLevel(5, "final", 50).level).toBe("Silver");
    expect(service.resolveLevel(5, "final", 70).level).toBe("Gold");
    expect(service.resolveLevel(5, "final", 90).level).toBe("Platinum");
  });

  it("resolves green interiors precert levels", () => {
    expect(service.resolveLevel(5, "precert", 25).level).toBe("Certified");
    expect(service.resolveLevel(5, "precert", 40).level).toBe("Silver");
    expect(service.resolveLevel(5, "precert", 50).level).toBe("Gold");
    expect(service.resolveLevel(5, "precert", 65).level).toBe("Platinum");
  });
});
