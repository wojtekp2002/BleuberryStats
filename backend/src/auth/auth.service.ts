import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(
    email: string,
    password: string,
    role: 'EMPLOYEE' | 'EMPLOYER',
    adminCode?: string,
  ) {
    //Jeśli pracodawca, sprawdzanie adminCode
    if (role === 'EMPLOYER') {
      if (adminCode !== 'admin1234') {
        throw new UnauthorizedException('Niepoprawny kod administratora');
      }
    }

    //Unikalność emaila
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('Użytkownik o takim emailu już istnieje');
    }

    //Hash hasła
    const hashed = await bcrypt.hash(password, 10);

    // Twórz usera z domyślną rolą
    const user = new this.userModel({
      email,
      password: hashed,
      role,
      employer: role === 'EMPLOYEE' ? null : undefined,
      ratePerKg: role === 'EMPLOYEE' ? undefined : undefined, 
    });
    await user.save();
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new Error('Nie znaleziono użytkownika z takim adresem e-mail');
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Niepoprawne dane logowania');
  
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return { user, token };
  }
  
}
