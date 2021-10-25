import * as fs from 'fs';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';

export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    try {
      const publicKey = fs.readFileSync(process.env.JWT_PUBKEY);
      const privateKey = fs.readFileSync(process.env.JWT_PRIVKEY);

      return {
        publicKey: publicKey,
        privateKey: privateKey,
      };
    } catch {
      return {
        secret: process.env.JWT_SECRET,
      };
    }
  }
}
