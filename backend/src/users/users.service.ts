import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /** Lista pracowników dla danego pracodawcy */
  async findByEmployer(employerId: string) {
    //Rzutujemy string na ObjectId
    const employerOid = new Types.ObjectId(employerId);
    console.log('→ findByEmployer • employerOid:', employerOid);

    const employees = await this.userModel
      .find({ employer: employerOid, role: 'EMPLOYEE' })
      .select('email ratePerKg')
      .exec();

    console.log('→ findByEmployer • found:', employees);
    return employees;
  }

  /** Podpowiedzi: rolę EMPLOYEE bez przypisanego pracodawcy */
  async searchAvailable(query: string) {
    return this.userModel
      .find({
        role: 'EMPLOYEE',
        employer: null,
        email: { $regex: query, $options: 'i' },
      })
      .select('email')
      .limit(10)
      .exec();
  }

  /** Dodaje istniejącego pracownika do grupy (ustawia pole employer) */
  async addToGroup(email: string, employerId: string) {
    const employeeDoc = await this.userModel
      .findOne({ email, role: 'EMPLOYEE' })
      .exec();
    
        console.log('→ addToGroup • found employeeDoc:', employeeDoc);

        if (!employeeDoc) {
        throw new BadRequestException('Nie znaleziono pracownika o podanym emailu');
        }

        if (employeeDoc.employer) {
        throw new BadRequestException('Pracownik już należy do jakiejś grupy');
        }

        employeeDoc.employer = new Types.ObjectId(employerId);
        await employeeDoc.save();

        console.log('→ addToGroup • after save employeeDoc.employer:', employeeDoc.employer);

    return { message: 'Dodano pracownika do grupy', employeeId: employeeDoc._id };
  }

  /** Aktualizuje stawkę za kg dla pracownika w Twojej grupie */
  async updateRate(
    employeeId: string,
    employerId: string,
    ratePerKg: number
  ) {
    const employeeDoc = await this.userModel.findById(employeeId).exec();
    if (!employeeDoc || String(employeeDoc.employer) !== employerId) {
      throw new ForbiddenException('Nie masz uprawnień do zmiany stawki tego pracownika');
    }

    employeeDoc.ratePerKg = ratePerKg;
    await employeeDoc.save();

    return { message: 'Zaktualizowano stawkę', employeeId };
  }

  /** Usuwa pracownika z grupy (ustawia employer=null) */
  async removeFromGroup(employeeId: string, employerId: string) {
    const employeeDoc = await this.userModel.findById(employeeId).exec();
    if (!employeeDoc || String(employeeDoc.employer) !== employerId) {
      throw new ForbiddenException('Nie masz uprawnień do usunięcia tego pracownika');
    }

    employeeDoc.employer = null;
    await employeeDoc.save();

    return { message: 'Usunięto pracownika z grupy', employeeId };
  }
}
