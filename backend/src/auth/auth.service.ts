import { Injectable } from '@nestjs/common';
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

  async register(email: string, password: string, role: string, employer: string, ratePerKg: number) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new Error('Użytkownik o takim email już istnieje');
  
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashed,
      role: role || 'EMPLOYEE',
      employer: employer || null,
      ratePerKg: ratePerKg || 1.0,
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
