import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminsModule } from 'src/admins/admins.module';
import { AdminsService } from 'src/admins/admins.service';
import { StudentsModule } from 'src/students/students.module';
import { StudentsService } from 'src/students/students.service';
import { TutorsModule } from 'src/tutors/tutors.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TutorsModule,
    PassportModule,
    AdminsModule,
    StudentsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '5d',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, AdminsService, StudentsService],
  controllers: [AuthController],
})
export class AuthModule {}
