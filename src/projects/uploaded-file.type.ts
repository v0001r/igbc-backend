/** Minimal upload file shape from multer memory storage */
export type UploadedFile = {
  buffer: Buffer;
  originalname: string;
  mimetype?: string;
};
