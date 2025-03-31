import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Verification } from './entities/verification.entity';
import { generateOtp } from './utils/otp.util';

@Injectable()
export class VerificationService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 15;
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(Verification)
    private tokenRepository: Repository<Verification>,

    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
  ) {}

  async generateOtp(userId: number, size = 6): Promise<string> {
    const now = new Date();

    const tutor = await this.tutorsRepository.findOne({
      where: { id: userId },
    });

    if (!tutor) {
      throw new NotFoundException("Le tuteur n'existe pas");
    }

    const recentToken = await this.tokenRepository.findOne({
      where: {
        tutor,
        expires_at: MoreThan(
          new Date(now.getTime() - this.minRequestIntervalMinutes * 60 * 1000),
        ),
      },
    });

    if (recentToken) {
      throw new UnprocessableEntityException('Attendez quelques minutes...');
    }

    const otp = generateOtp(size);
    const hashedToken = await bcrypt.hash(otp, this.saltRounds);

    const tokenEntity = this.tokenRepository.create({
      tutor,
      token: hashedToken,
      expires_at: new Date(
        now.getTime() + this.tokenExpirationMinutes * 60 * 1000,
      ),
    });

    await this.tokenRepository.delete({ tutor });

    await this.tokenRepository.save(tokenEntity);

    return otp;
  }

  async validateOtp(userId: number, token: string): Promise<boolean> {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: userId },
    });

    if (!tutor) {
      throw new NotFoundException("Le tuteur n'existe pas");
    }

    const validToken = await this.tokenRepository.findOne({
      where: { tutor, expires_at: MoreThan(new Date()) },
    });

    if (validToken && (await bcrypt.compare(token, validToken.token))) {
      await this.tokenRepository.remove(validToken);
      return true;
    } else {
      return false;
    }
  }

  async generateResetToken(email: string): Promise<string> {
    const tutor = await this.tutorsRepository.findOneBy({ email });
    if (!tutor) throw new Error('Tuteur introuvable');

    const token = uuidv4();
    const expires_at = new Date(
      Date.now() + 1000 * 60 * this.tokenExpirationMinutes,
    );

    await this.tokenRepository.insert({
      tutor,
      token: token,
      expires_at,
    });

    return token;
  }

  async verifyResetToken(token: string, email: string): Promise<Tutor> {
    const tutor = await this.tutorsRepository.findOneBy({ email });
    if (!tutor) throw new Error('Tuteur introuvable');

    const record = await this.tokenRepository.findOne({
      where: { tutor: { id: tutor.id }, token: token },
    });

    if (!record || new Date(record.expires_at) < new Date()) {
      throw new Error('Token invalide ou expiré');
    }

    return tutor;
  }

  async deleteResetToken(token: string) {
    await this.tokenRepository.delete({ token });
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cleanUpExpiredTokens() {
    await this.tokenRepository.delete({
      expires_at: LessThan(new Date()),
    });
  }
}
