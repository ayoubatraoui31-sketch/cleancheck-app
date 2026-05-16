import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface UploadResult {
  secure_url: string;
  public_id: string;
  thumbnail_url?: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImage(
  file: Buffer | string,
  folder: string = 'cleancheck',
  options: { watermark?: boolean; metadata?: Record<string, string> } = {}
): Promise<UploadResult> {
  const uploadOptions: Record<string, unknown> = {
    folder: `cleancheck/${folder}`,
    resource_type: 'image',
    quality: 'auto:good',
    fetch_format: 'auto',
    ...(options.metadata && { context: options.metadata }),
  };

  if (options.watermark) {
    uploadOptions.overlay = {
      font_family: 'Arial',
      font_size: 20,
      text: `CleanCheck - ${new Date().toLocaleString('fr-FR')}`,
      gravity: 'south_east',
      color: '#FFFFFF',
      opacity: 80,
    };
  }

  const result = await new Promise<UploadResult>((resolve, reject) => {
    cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
      uploadOptions,
      (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'));
        else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            thumbnail_url: cloudinary.url(result.public_id, {
              width: 400,
              height: 300,
              crop: 'fill',
              quality: 'auto',
            }),
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      }
    );
  });

  return result;
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
