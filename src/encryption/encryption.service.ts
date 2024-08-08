import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  async generateUUID(
    size: number = 32,
    encoding: BufferEncoding = 'hex',
  ): Promise<string> {
    return crypto.randomBytes(size).toString(encoding);
  }
}
