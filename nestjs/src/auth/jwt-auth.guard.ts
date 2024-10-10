import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSIONS } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // xử lý cái @Public
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Token không hợp lệ or không có token ở Bearer Token ở Header request!',
        )
      );
    }

    // check permissions
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path as string;
    // console.log('check targetMethod', targetMethod);
    // console.log('check targetEndpoint', targetEndpoint);
    const permission = user?.permissions ?? [];
    // console.log(permission);
    let isExist = permission.find(
      (permission) =>
        targetMethod === permission.method &&
        targetEndpoint === permission.apiPath,
    );
    if (targetEndpoint.startsWith('/api/v1/auth')) isExist = true;
    // console.log(targetMethod);
    // console.log(targetEndpoint);
    // console.log('check isExist', isExist);

    if (!isExist && !isSkipPermission) {
      throw new ForbiddenException(
        'Bạn không có quyển để truy cập endpoint này!',
      );
    }

    return user;
  }
}
