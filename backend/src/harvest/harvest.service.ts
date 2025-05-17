import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Harvest } from 'src/schemas/harvest.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class HarvestService {
  constructor(
    @InjectModel(Harvest.name) private harvestModel: Model<Harvest>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Dodawanie wpisu zbioru
  async addHarvest(employerId: string, employeeId: string, kg: number) {
    const employee = await this.userModel.findById(employeeId);
    if (!employee) throw new BadRequestException('Nie znaleziono pracownika');
    if (!employee.employer || String(employee.employer) !== employerId) {
      throw new ForbiddenException('Nie możesz dodawać zbiorów temu pracownikowi');
    }
    const amount = kg * (employee.ratePerKg || 1.0);
    const harvest = new this.harvestModel({
      employee: employee._id,
      kg,
      amount,
      paidOut: false,
    });
    await harvest.save();
    return harvest;
  }

  // Pobieranie wpisów zbiorów – w zależności od roli
  async getHarvests(userId: string, role: string) {
    const uid = new Types.ObjectId(userId);
    if (role === 'EMPLOYEE') {
      return this.harvestModel.find({ employee: uid }).sort({ date: -1 }).exec();
    }
    if (role === 'EMPLOYER') {
      const employees = await this.userModel
        .find({ employer: uid, role: 'EMPLOYEE' })
        .select('_id')
        .exec();
      const ids = employees.map(e => e._id);
      return this.harvestModel
        .find({ employee: { $in: ids } })
        .sort({ date: -1 })
        .populate('employee')
        .exec();
    }
    return [];
  }

  // Wypłata pojedynczego wpisu
  async payoutOne(employerId: string, harvestId: string) {
    const harvest = await this.harvestModel.findById(harvestId).populate('employee');
    if (!harvest) throw new BadRequestException('Nie znaleziono wpisu');
    if (!harvest.employee.employer || String(harvest.employee.employer) !== employerId) {
      throw new ForbiddenException('Nie masz uprawnień');
    }
    harvest.paidOut = true;
    harvest.payoutDate = new Date();
    await harvest.save();
    return harvest;
  }

  // Masowa wypłata wpisów dla pracownika
  async payoutAll(employerId: string, employeeId: string) {
    const employee = await this.userModel.findById(employeeId);
    if (!employee || String(employee.employer) !== employerId) {
      throw new ForbiddenException('Nie masz uprawnień');
    }
    await this.harvestModel.updateMany(
      { employee: employee._id, paidOut: false },
      { paidOut: true, payoutDate: new Date() }
    );
    return { message: 'Wypłacono wszystko', employeeId };
  }

  // Podsumowanie nieopłaconych zbiorów
  async getEmployerSummary(employerId: string) {
    const employerOid = new Types.ObjectId(employerId);
    const employees = await this.userModel
      .find({ employer: employerOid, role: 'EMPLOYEE' })
      .select('_id email')
      .exec();
    const summary = await Promise.all(
      employees.map(async emp => {
        const agg = await this.harvestModel.aggregate([
          { $match: { employee: emp._id, paidOut: false } },
          { $group: { _id: null, totalKg: { $sum: '$kg' }, totalAmount: { $sum: '$amount' } } }
        ]);
        const { totalKg = 0, totalAmount = 0 } = agg[0] || {};
        return { employeeId: String(emp._id), email: emp.email, totalKg, totalAmount };
      })
    );
    return summary;
  }
}