import {
  Controller, Post, Get, Patch, Body, Param, Req, UseGuards, ForbiddenException
} from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('harvest')
@UseGuards(JwtAuthGuard)
export class HarvestController {
  constructor(private harvestService: HarvestService) {}

  @Post()
  async addHarvest(
    @Body() body: { employeeId: string; kg: number },
    @Req() req: RequestWithUser
  ) {
    if (req.user.role !== 'EMPLOYER') {
      throw new ForbiddenException('Brak uprawnień');
    }
    return this.harvestService.addHarvest(req.user.userId, body.employeeId, body.kg);
  }

  @Get()
  async getHarvests(@Req() req: RequestWithUser) {
    console.log('→ getHarvests • req.user =', req.user);
    const out = await this.harvestService.getHarvests(
      req.user.userId, 
      req.user.role
    );
    console.log('→ getHarvests → found:', out);
    return out;
  }

  @Patch(':harvestId/payout')
  async payoutOne(
    @Param('harvestId') harvestId: string,
    @Req() req: RequestWithUser
  ) {
    if (req.user.role !== 'EMPLOYER') {
      throw new ForbiddenException('Brak uprawnień');
    }
    return this.harvestService.payoutOne(req.user.userId, harvestId);
  }

  @Patch('payout-all/:employeeId')
  async payoutAll(
    @Param('employeeId') employeeId: string,
    @Req() req: RequestWithUser
  ) {
    if (req.user.role !== 'EMPLOYER') {
      throw new ForbiddenException('Brak uprawnień');
    }
    return this.harvestService.payoutAll(req.user.userId, employeeId);
  }

  @Get('summary')
  async summary(@Req() req: RequestWithUser) {
    if (req.user.role !== 'EMPLOYER') {
      throw new ForbiddenException('Brak uprawnień');
    }
    return this.harvestService.getEmployerSummary(req.user.userId);
  }
}
