import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserFromToken } from 'src/constants/interfaces/user-from-token.interface';

export const CurrentTutor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromToken => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as UserFromToken;
  },
);
