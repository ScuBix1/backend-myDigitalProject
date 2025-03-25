import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { Verification } from './entities/verification.entity';
import { VerificationService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Verification, Tutor])],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
