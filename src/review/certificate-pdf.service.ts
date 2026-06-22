import { Injectable, OnModuleInit } from "@nestjs/common";
import { createHash } from "crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import puppeteer from "puppeteer";

export type CertificateRenderInput = {
  projectId: number;
  projectName: string;
  address: string;
  registrationNo: string;
  ratingSystemName: string;
  versionLabel: string;
  level: string;
  issueMonthYear: string;
  certificateStage?: "final" | "precert";
  watermark?: boolean;
};

type CertificateDesign = {
  borderColor: string;
  innerBorderColor: string;
  validityText: string;
};

@Injectable()
export class CertificatePdfService implements OnModuleInit {
  private readonly uploadRoot = join(process.cwd(), "uploads");
  private readonly assetsDir = join(this.uploadRoot, "certificate-assets");
  /** Repo root (parent of igbc-backend) — IGBC_LOGO.png, cii_eng.png, signature.png */
  private readonly projectRoot = join(process.cwd(), "..");
  private static readonly BORDER_WIDTH_MM = 15;
  private static readonly INNER_PADDING_MM = 6;
  /** A4 landscape — standard certificate page */
  private static readonly PAGE_WIDTH_MM = 297;
  private static readonly PAGE_HEIGHT_MM = 210;

  onModuleInit() {
    this.syncAssetsFromRoot();
  }

  generateHtml(input: CertificateRenderInput): string {
    const design = this.resolveDesign(input.level, input.certificateStage ?? "final");
    const assetBase = "/uploads/certificate-assets";
    const watermarkStyle = input.watermark
      ? `<div class="watermark">PREVIEW</div>`
      : "";

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>IGBC Certificate</title>
<style>
  @page {
    size: A4 landscape;
    margin: 0;
  }
  * { box-sizing: border-box; }
  html, body {
    width: ${CertificatePdfService.PAGE_WIDTH_MM}mm;
    height: ${CertificatePdfService.PAGE_HEIGHT_MM}mm;
    margin: 0;
    padding: 0;
    color: #111;
    background: #fff;
    font-family: 'Times New Roman', Georgia, serif;
    overflow: hidden;
  }
  @media screen {
    html, body {
      width: auto;
      height: auto;
      min-height: 100%;
      overflow: auto;
      background: #e8e8e8;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 12px;
    }
    page.cert-page {
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
    }
  }
  page.cert-page {
    display: block;
    width: ${CertificatePdfService.PAGE_WIDTH_MM}mm;
    height: ${CertificatePdfService.PAGE_HEIGHT_MM}mm;
    margin: 0;
    padding: 0;
    background: #fff;
    page-break-after: avoid;
    page-break-inside: avoid;
    overflow: hidden;
  }
  .certificate-frame {
    width: 100%;
    height: 100%;
    border: ${CertificatePdfService.BORDER_WIDTH_MM}mm solid ${design.borderColor};
    margin: 0;
    position: relative;
    background: #fff;
    overflow: hidden;
  }
  .certificate-inner {
    border: 0.5mm solid ${design.innerBorderColor};
    margin: 2.5mm;
    height: calc(100% - 5mm);
    padding: ${CertificatePdfService.INNER_PADDING_MM}mm;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    gap: 3mm;
    overflow: hidden;
  }
  .header-logos {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    padding: 0 2mm;
  }
  .logo-igbc { width: 42mm; height: auto; max-height: 40mm; object-fit: contain; }
  .logo-cii { width: 52mm; height: auto; max-height: 40mm; object-fit: contain; }
  .content {
    text-align: center;
    padding: 0 6mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
    margin-top: -60px;
  }
  h1.title {
    font-size: 4.6mm;
    font-weight: 700;
    font-style: italic;
    margin: 0 0 1.5mm;
  }
  .intro {
    font-size: 4.2mm;
    font-style: italic;
    margin: 0 0 1.5mm;
  }
  .project-name {
    font-size: 6.5mm;
    font-weight: 900;
    margin: 1mm 0 1mm;
    line-height: 1.15;
  }
  .address-block {
    font-size: 4.8mm;
    line-height: 1.35;
    margin-bottom: 1.5mm;
  }
  .body-text {
    font-size: 4.8mm;
    font-style: italic;
    line-height: 1.35;
    color: #655353;
    margin: 0 0 1mm;
  }
  .rating-name {
    font-size: 5.6mm;
    font-weight: 900;
    font-style: italic;
    margin: 1mm 0 0.8mm;
  }
  .version-label {
    font-size: 4.8mm;
    margin-bottom: 1mm;
    color: #453a3a;
  }
  .level {
    font-size: 7mm;
    font-weight: 600;
    margin: 1.5mm 0 0.8mm;
  }
  .date {
    font-size: 5.4mm;
    font-weight: 300;
    margin: 0 0 0.8mm;
  }
  .validity {
    font-size: 4.2mm;
    font-style: italic;
    margin: 0;
  }
  .signatures {
    width: 100%;
    min-height: 30mm;
    max-height: 32mm;
    padding-top: 2mm;
    text-align: center;
    flex-shrink: 0;
    overflow: hidden;
  }
  .signatures img {
    width: 90%;
    max-height: 28mm;
    height: auto;
    object-fit: contain;
    display: inline-block;
    vertical-align: bottom;
  }
  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 18mm;
    color: rgba(200, 0, 0, 0.12);
    font-weight: bold;
    z-index: 5;
    pointer-events: none;
    white-space: nowrap;
    letter-spacing: 2mm;
  }
  @media print {
    html, body { background: #fff; }
    body { padding: 0; }
    page.cert-page { box-shadow: none; }
  }
</style></head><body>
<page class="cert-page">
  <div class="certificate-frame">
    ${watermarkStyle}
    <div class="certificate-inner">
      <div class="header-logos">
        <img src="${assetBase}/IGBC_LOGO.png" alt="IGBC" class="logo-igbc" />
        <img src="${assetBase}/cii_eng.png" alt="CII" class="logo-cii" />
      </div>
      <div class="content">
        <h1 class="title">Indian Green Building Council (IGBC)</h1>
        <p class="intro">hereby certifies that</p>
        <div class="project-name">${this.escape(input.projectName)}</div>
        <div class="address-block">
          ${this.escape(input.address)}<br/>
          (IGBC Registration No: ${this.escape(input.registrationNo)})
        </div>
        <p class="body-text">
          has successfully achieved the Green Interior Standards required for<br/>
          the following level of certification under the
        </p>
        <div class="rating-name">${this.escape(input.ratingSystemName)}</div>
        <div class="version-label">(${this.escape(input.versionLabel)})</div>
        <div class="level">${this.escape(input.level)}</div>
        <div class="date">${this.escape(input.issueMonthYear)}</div>
        <p class="validity">${this.escape(design.validityText)}</p>
      </div>
      <div class="signatures">
        <img src="${assetBase}/signature.png" alt="Signatures" />
      </div>
    </div>
  </div>
</page>
</body></html>`;
  }

  async storeCertificate(projectId: number, html: string, suffix: string) {
    this.syncAssetsFromRoot();
    const pdfHtml = this.embedAssetImages(html);
    const pdfBuffer = await this.renderPdfFromHtml(pdfHtml);
    const sha256 = createHash("sha256").update(pdfBuffer).digest("hex");
    const versionKey = sha256.slice(0, 12);
    const relativeKey = `/uploads/projects/${projectId}/certificates/${suffix}_${versionKey}.pdf`;
    const absoluteDir = join(this.uploadRoot, "projects", String(projectId), "certificates");
    mkdirSync(absoluteDir, { recursive: true });
    writeFileSync(join(process.cwd(), relativeKey.replace(/^\//, "")), pdfBuffer);
    return { downloadUrl: relativeKey, sha256, pdfBuffer };
  }

  private embedAssetImages(html: string): string {
    let result = html;
    for (const file of ["IGBC_LOGO.png", "cii_eng.png", "signature.png"]) {
      const assetPath = join(this.assetsDir, file);
      if (!existsSync(assetPath)) continue;
      const dataUri = `data:image/png;base64,${readFileSync(assetPath).toString("base64")}`;
      result = result.replaceAll(`/uploads/certificate-assets/${file}`, dataUri);
    }
    return result;
  }

  private async renderPdfFromHtml(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdf = await page.pdf({
        format: "A4",
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private resolveDesign(level: string, stage: "final" | "precert"): CertificateDesign {
    const normalized = level.toLowerCase();
    let bucket: "platinum" | "gold" | "silver" | "certified" | "not_rated" = "certified";
    if (normalized.includes("platinum")) bucket = "platinum";
    else if (normalized.includes("gold")) bucket = "gold";
    else if (normalized.includes("silver")) bucket = "silver";
    else if (normalized.includes("not rated") || normalized.includes("unrated")) bucket = "not_rated";

    const finalMap: Record<string, CertificateDesign> = {
      platinum: {
        borderColor: "#666666",
        innerBorderColor: "#b7b7b7",
        validityText: "(This certification is valid for next 3 years)",
      },
      gold: {
        borderColor: "#f3bd67",
        innerBorderColor: "#d1aa65",
        validityText: "(This certification is valid for next 3 years)",
      },
      silver: {
        borderColor: "#d9d9d9",
        innerBorderColor: "#b7b7b7",
        validityText: "(This certification is valid for next 3 years)",
      },
      certified: {
        borderColor: "#f3bd67",
        innerBorderColor: "#d1aa65",
        validityText: "(This certification is valid for next 3 years)",
      },
      not_rated: {
        borderColor: "#000000",
        innerBorderColor: "#333333",
        validityText: "(This certification is valid for next 3 years)",
      },
    };

    const precertMap: Record<string, CertificateDesign> = {
      platinum: {
        borderColor: "#5f5f5f",
        innerBorderColor: "#5f5f5f",
        validityText:
          "(Precertification is valid for 3 years, renewed based on six monthly progress updates till certification)",
      },
      gold: {
        borderColor: "#f6821f",
        innerBorderColor: "#fcaa61",
        validityText:
          "(Precertification is valid for 3 years, renewed based on six monthly progress updates till certification)",
      },
      silver: {
        borderColor: "#9aa3ab",
        innerBorderColor: "#9aa3ab",
        validityText:
          "(Precertification is valid for 3 years, renewed based on six monthly progress updates till certification)",
      },
      certified: {
        borderColor: "#ef8a2d",
        innerBorderColor: "#ef8a2d",
        validityText:
          "(Precertification is valid for 3 years, renewed based on six monthly progress updates till certification)",
      },
      not_rated: {
        borderColor: "#000000",
        innerBorderColor: "#000000",
        validityText:
          "(Precertification is valid for 3 years, renewed based on six monthly progress updates till certification)",
      },
    };

    const map = stage === "precert" ? precertMap : finalMap;
    return map[bucket] ?? finalMap.certified;
  }

  private syncAssetsFromRoot() {
    mkdirSync(this.assetsDir, { recursive: true });
    for (const file of ["IGBC_LOGO.png", "cii_eng.png", "signature.png"]) {
      const candidates = [
        join(this.projectRoot, file),
        join(process.cwd(), file),
      ];
      const source = candidates.find((path) => existsSync(path));
      if (!source) continue;
      copyFileSync(source, join(this.assetsDir, file));
    }
  }

  private escape(value: string) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
