import { Bucket, GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { ConfigKey, StorageConfig } from '@madify-api/utils/config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMAGE_PROVIDE, ImageService } from '../image/image.service';

@Injectable()
export class StorageService implements OnModuleInit {
  private storage: Storage;
  private config: StorageConfig;
  private bucket: Bucket;

  constructor(
    @Inject(IMAGE_PROVIDE) private imageService: ImageService,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    this.config = this.configService.get<StorageConfig>(ConfigKey.STORAGE);

    this.storage = new Storage({
      apiEndpoint: this.config.apiEndpoint,
      credentials: {
        client_email: this.config.clientEmail,
        client_id: this.config.clientId,
        private_key: this.config.privateKey,
      },
    });
    this.bucket = this.storage.bucket(this.config.bucketName);
  }

  async uploadFile(
    filePath: string,
    base64: string,
    mimeType: string
  ): Promise<string> {
    const path = this.imageService.generateFilePath(filePath, mimeType);
    const fileBuffer = this.imageService.createFileBufferFromBase64(base64);
    await this.saveFileToBucket(path, fileBuffer, mimeType);
    return path;
  }

  private async saveFileToBucket(
    filePath: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<void> {
    const file = this.bucket.file(filePath);
    await file.save(fileBuffer, {
      metadata: { contentType: mimeType, gzip: true },
      private: true,
    });
  }

  async generateSignedUrl(filePath: string): Promise<string> {
    if (!filePath) return;

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + this.config.expired,
    };

    const [signedUrl] = await this.bucket.file(filePath).getSignedUrl(options);

    return signedUrl;
  }

  // async deleteFile(destination: string) {
  //   const bucket = this.storage.bucket(this.bucketName);
  //   const file = bucket.file(destination);
  //   await file.delete();
  //   console.log(`File ${destination} deleted.`);
  // }
}
