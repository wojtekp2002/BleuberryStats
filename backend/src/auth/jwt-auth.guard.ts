import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Brak nagłówka Authorization');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Brak tokenu');
    }
    try {
      // Weryfikacja tokenu przy użyciu klucza z .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      request.user = decoded; // Przekazanie danych tokenu do request.user
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token niepoprawny lub wygasł');
    }
  }
}