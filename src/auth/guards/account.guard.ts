import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Tutor } from 'src/tutors/entities/tutor.entity';
import { NO_ACCOUNT_GUARD_KEY } from '../decorators/no-account-guard.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const noAccountGuard = this.reflector.getAllAndOverride<boolean>(
      NO_ACCOUNT_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || noAccountGuard) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const tutor = request.body as Tutor;

    if (!tutor?.email_verified_at) {
      throw new UnauthorizedException("Ce compte n'est pas vérifié");
    }

    if (tutor.account_status !== 'actif') {
      throw new UnauthorizedException(`Compte ${tutor.account_status}`);
    }

    return true;
  }
}
