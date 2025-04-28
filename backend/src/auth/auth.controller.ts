import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; role: string; employer: string; ratePerKg: number }
  ) {
    try {
      const user = await this.authService.register(
        body.email,
        body.password,
        body.role,
        body.employer,
        body.ratePerKg,
      );
      return { message: 'Zarejestrowano pomyślnie', user };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ) {
    try {
      const { user, token } = await this.authService.login(body.email, body.password);
      return {
        message: 'Zalogowano!',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          employer: user.employer,
          ratePerKg: user.ratePerKg,
        },
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
