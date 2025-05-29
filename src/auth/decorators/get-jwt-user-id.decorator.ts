import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetJwtUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest();
    return request.user?.id;
  },
);
