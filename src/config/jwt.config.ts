import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';

const JwtModuleConfig = () => {
  const options: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const twelveHoursInSeconds = 12 * 60 * 60; // 43200
      const envExpires = Number(configService.get<string>('JWT_EXPIRES_IN'));
      const expiresIn = Number.isFinite(envExpires) && envExpires > 0 ? envExpires : twelveHoursInSeconds;

      return {
        secret: configService.getOrThrow<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn,
        },
      };
    },
  };
  return JwtModule.registerAsync(options);
};

export default JwtModuleConfig;
