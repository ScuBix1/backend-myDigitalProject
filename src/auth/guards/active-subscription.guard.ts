import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
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
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user.role !== 'tutor' || !user || !user.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé ou non authentifié",
      );
    }

    const sub = await this.tutorSubRepo.findOne({
      where: {
        tutor: { id: user.id },
        is_active: true,
      },
    });

    if (!sub || new Date(sub.end_date) < new Date()) {
      throw new ForbiddenException(
        "Vous n'avez pas d'abonnement actif pour accéder à cette ressource.",
      );
    }

    return true;
  }
}
