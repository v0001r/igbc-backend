import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class EventsStorageService {
  private readonly bucketName: string;
  private readonly region: string;
  private readonly publicBaseUrl?: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.getFirstNonEmptyConfig("AWS_S3_BUCKET", "AWS_BUCKET", "AWS_BUCKET_NAME");
    this.region = this.getFirstNonEmptyConfig("AWS_REGION", "AWS_DEFAULT_REGION") || "ap-south-1";
    this.publicBaseUrl = this.getFirstNonEmptyConfig("AWS_URL");
    const usePathStyleRaw = this.getFirstNonEmptyConfig("AWS_USE_PATH_STYLE_ENDPOINT") || "false";
    const forcePathStyle = `${usePathStyleRaw}`.toLowerCase() === "true";

    this.s3Client = new S3Client({
      region: this.region,
      forcePathStyle,
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID", ""),
        secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY", ""),
      },
    });
  }

  async uploadBanner(file: UploadedImageFile, eventId: string) {
    if (!this.bucketName) {
      throw new BadRequestException(
        "S3 bucket is not configured. Set AWS_S3_BUCKET or AWS_BUCKET in environment",
      );
    }
    const extension = this.getFileExtension(file.originalname, file.mimetype);
    const key = `events/banners/${eventId}/${Date.now()}-${this.sanitizeFileName(file.originalname)}.${extension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || "application/octet-stream",
      }),
    );

    if (this.publicBaseUrl) {
      return `https://${this.publicBaseUrl}/${key}`;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private sanitizeFileName(fileName: string) {
    const base = fileName.replace(/\.[^/.]+$/, "");
    const cleaned = base.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
    return cleaned || "banner";
  }

  private getFileExtension(fileName: string, mimeType?: string) {
    const dotIndex = fileName.lastIndexOf(".");
    if (dotIndex > -1 && dotIndex < fileName.length - 1) {
      return fileName.slice(dotIndex + 1).toLowerCase();
    }
    if (mimeType === "image/png") return "png";
    if (mimeType === "image/jpeg") return "jpg";
    if (mimeType === "image/webp") return "webp";
    return "bin";
  }

  private getFirstNonEmptyConfig(...keys: string[]) {
    for (const key of keys) {
      const raw = this.configService.get<string>(key);
      if (!raw) continue;
      const cleaned = raw.trim().replace(/^['"]|['"]$/g, "");
      if (cleaned) return cleaned;
    }
    return "";
  }
}
