import { 
    Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards,
    ForbiddenException, BadRequestException 
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  
  @Controller('users')
  @UseGuards(JwtAuthGuard)
  export class UsersController {
    constructor(private usersService: UsersService) {}
  
    @Get()
    async list(@Req() req: any) {           
      const user = req.user;
      if (user.role !== 'EMPLOYER') {
        throw new ForbiddenException('Brak uprawnień');
      }
      return this.usersService.findByEmployer(user.userId);
    }
  
    @Post()
    async create(
      @Body() body: { email: string; password: string; ratePerKg: number },
      @Req() req: any,                       
    ) {
      const user = req.user;
      if (user.role !== 'EMPLOYER') {
        throw new ForbiddenException('Brak uprawnień');
      }
      return this.usersService.createEmployee(
        user.userId,
        body.email,
        body.password,
        body.ratePerKg,
      );
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() body: { ratePerKg: number },
      @Req() req: any,                       
    ) {
      const user = req.user;
      if (user.role !== 'EMPLOYER') {
        throw new ForbiddenException('Brak uprawnień');
      }
      return this.usersService.updateEmployee(user.userId, id, body.ratePerKg);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {  
      const user = req.user;
      if (user.role !== 'EMPLOYER') {
        throw new ForbiddenException('Brak uprawnień');
      }
      return this.usersService.deleteEmployee(user.userId, id);
    }
  }
  