import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmployer(employerId: string) {
    return this.userModel
      .find({ employer: employerId, role: 'EMPLOYEE' })
      .select('email ratePerKg')
      .exec();
  }

  async createEmployee(employerId: string, email: string, password: string, ratePerKg: number) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Taki email jest już użyty');
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashed,
      role: 'EMPLOYEE',
      employer: employerId,
      ratePerKg,
    });
    return user.save();
  }

  async updateEmployee(employerId: string, id: string, ratePerKg: number) {
    const user = await this.userModel.findById(id);
    if (!user || String(user.employer) !== employerId) throw new ForbiddenException();
    user.ratePerKg = ratePerKg;
    return user.save();
  }

  async deleteEmployee(employerId: string, id: string) {
    const user = await this.userModel.findById(id);
    if (!user || String(user.employer) !== employerId) throw new ForbiddenException();
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
