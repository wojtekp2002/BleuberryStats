// src/harvest/harvest.service.ts

import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    if (role === 'EMPLOYEE') {
      return this.harvestModel.find({ employee: userId }).sort({ date: -1 });
    } else if (role === 'EMPLOYER') {
      const employees = await this.userModel.find({ employer: userId }).select('_id');
      const ids = employees.map(e => e._id);
      return this.harvestModel
        .find({ employee: { $in: ids } })
        .sort({ date: -1 })
        .populate('employee');
    }
    return [];
  }

  // Wypłata pojedynczego wpisu
  async payoutOne(employerId: string, harvestId: string) {
    const harvest = await this.harvestModel.findById(harvestId).populate('employee');
    if (!harvest) throw new BadRequestException('Nie znaleziono wpisu');

    if (!harvest.employee.employer || String(harvest.employee.employer) !== employerId) {
      throw new ForbiddenException('Nie możesz wypłacać temu pracownikowi');
    }

    harvest.paidOut = true;
    await harvest.save();
    return harvest;
  }

  // Masowa wypłata wpisów dla danego pracownika
  async payoutAll(employerId: string, employeeId: string) {
    const employee = await this.userModel.findById(employeeId);
    if (!employee || String(employee.employer) !== employerId) {
      throw new ForbiddenException('Nie możesz wypłacać temu pracownikowi');
    }
    await this.harvestModel.updateMany(
      { employee: employee._id, paidOut: false },
      { paidOut: true }
    );
    return { message: 'Wypłacono wszystko', employeeId };
  }

  // Agregacja nieopłaconych zbiorów per pracownik dla pracodawcy
  async getEmployerSummary(employerId: string) {
    const employees = await this.userModel
      .find({ employer: employerId, role: 'EMPLOYEE' })
      .select('_id email')
      .exec();

    const summary = await Promise.all(
      employees.map(async emp => {
        const agg = await this.harvestModel.aggregate([
          { $match: { employee: emp._id, paidOut: false } },
          {
            $group: {
              _id: null,
              totalKg: { $sum: '$kg' },
              totalAmount: { $sum: '$amount' },
            },
          },
        ]);
        const { totalKg = 0, totalAmount = 0 } = agg[0] || {};
        return {
          employeeId: String(emp._id),
          email: emp.email,
          totalKg,
          totalAmount,
        };
      })
    );

    return summary;
  }
}
