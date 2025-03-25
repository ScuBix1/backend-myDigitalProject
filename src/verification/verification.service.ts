import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MoreThan, Repository } from 'typeorm';
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
  ) {}

  async generateOtp(userId: number, size = 6): Promise<string> {
    const now = new Date();

    const recentToken = await this.tokenRepository.findOne({
      where: {
        userId,
        createdAt: MoreThan(
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
      userId,
      token: hashedToken,
      expiresAt: new Date(
        now.getTime() + this.tokenExpirationMinutes * 60 * 1000,
      ),
    });

    await this.tokenRepository.delete({ userId });

    await this.tokenRepository.save(tokenEntity);

    return otp;
  }

  async validateOtp(userId: number, token: string): Promise<boolean> {
    const validToken = await this.tokenRepository.findOne({
      where: { userId, expiresAt: MoreThan(new Date()) },
    });

    if (validToken && (await bcrypt.compare(token, validToken.token))) {
      await this.tokenRepository.remove(validToken);
      return true;
    } else {
      return false;
    }
  }

  async cleanUpExpiredTokens() {}
}
