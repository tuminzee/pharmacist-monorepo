import { requireAuth } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { promisify } from 'util';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private requireAuth: any;

  constructor() {
    this.requireAuth = promisify(requireAuth());
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      await this.requireAuth(request, response);
      request['userId'] = request.auth.userId;
      this.logger.log(`User ${request.auth.userId} is authenticated`);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
