import { Controller, Post, Get, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('harvest')
export class HarvestController {
  constructor(private harvestService: HarvestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addHarvest(
    @Body() body: { employeeId: string; kg: number },
    @Req() req: RequestWithUser
  ) {
    const user = req.user;
    if (!user || user.role !== 'EMPLOYER') {
      throw new Error('Brak uprawnień');
    }
    return this.harvestService.addHarvest(user.userId, body.employeeId, body.kg);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getHarvests(@Req() req: RequestWithUser) {
    const user = req.user;
    if (!user) throw new Error('Brak danych użytkownika');
    return this.harvestService.getHarvests(user.userId, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':harvestId/payout')
  async payoutOne(@Param('harvestId') harvestId: string, @Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || user.role !== 'EMPLOYER') {
      throw new Error('Brak uprawnień');
    }
    return this.harvestService.payoutOne(user.userId, harvestId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('payout-all/:employeeId')
  async payoutAll(@Param('employeeId') employeeId: string, @Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || user.role !== 'EMPLOYER') {
      throw new Error('Brak uprawnień');
    }
    return this.harvestService.payoutAll(user.userId, employeeId);
  }
}
