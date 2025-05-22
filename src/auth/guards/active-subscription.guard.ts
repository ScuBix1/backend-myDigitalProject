import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { JwtPayload } from 'src/constants/interfaces/jwt-payload.interface';
import { TutorSubscription } from 'src/subscriptions/entities/tutorSubscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActiveSubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(TutorSubscription)
    private tutorSubRepo: Repository<TutorSubscription>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.body as JwtPayload;

    if (user.role !== 'tutor' || !user || !user.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé ou non authentifié",
      );
    }

    const sub = await this.tutorSubRepo.findOne({
      where: {
        tutor: { id: +user.id },
        is_active: true,
      },
      relations: ['tutor'],
    });

    if (!sub || new Date(sub.end_date) < new Date()) {
      throw new ForbiddenException(
        "Vous n'avez pas d'abonnement actif pour accéder à cette ressource.",
      );
    }

    if (sub.tutor && sub.tutor.account_status !== 'actif') {
      throw new UnauthorizedException(
        'Vous devez vérifier votre adresse email',
      );
    }

    return true;
  }
}
