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
    // Rzutujemy zawsze na ObjectId
    const uid = new Types.ObjectId(userId);
    console.log('→ HarvestService.getHarvests • role:', role, '• uid:', uid);

    if (role === 'EMPLOYEE') {
      const personal = await this.harvestModel
        .find({ employee: uid })
        .sort({ date: -1 })
        .exec();
      console.log('→ HarvestService.getHarvests • employee harvests:', personal);
      return personal;
    }

    if (role === 'EMPLOYER') {
      // 1) Kto jest w Twojej grupie?
      const employees = await this.userModel
        .find({ employer: uid, role: 'EMPLOYEE' })
        .select('_id')
        .exec();
      console.log('→ HarvestService.getHarvests • employees:', employees);

      const ids = employees.map(e => e._id);
      // 2) Szukamy wpisów dla tych empów:
      const all = await this.harvestModel
        .find({ employee: { $in: ids } })
        .sort({ date: -1 })
        .populate('employee')
        .exec();
      console.log('→ HarvestService.getHarvests • employer harvests:', all);
      return all;
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
