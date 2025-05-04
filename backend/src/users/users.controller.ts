import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Query,
    Param,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
  
  @Controller('users')
  @UseGuards(JwtAuthGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    // GET /users
    @Get()
    async getGroup(@Req() req: RequestWithUser) {
        console.log('→ getGroup • req.user.userId:', req.user.userId);
        const res = await this.usersService.findByEmployer(req.user.userId);
        console.log('→ getGroup • findByEmployer returned:', res);  
        return res;
    }
  
    // GET /users/search?q=...
    @Get('search')
    async search(
      @Query('q') query: string,
    ) {
      return this.usersService.searchAvailable(query);
    }
  
    // POST /users  { email }
    @Post()
    async add(
      @Body('email') email: string,
      @Req() req: RequestWithUser,
    ) {
      return this.usersService.addToGroup(email, req.user.userId);
    }
  
    // PATCH /users/:id  { ratePerKg }
    @Patch(':id')
    async updateRate(
      @Param('id') id: string,
      @Body('ratePerKg') ratePerKg: number,
      @Req() req: RequestWithUser,
    ) {
      return this.usersService.updateRate(id, req.user.userId, ratePerKg);
    }
  
    // DELETE /users/:id
    @Delete(':id')
    async remove(
      @Param('id') id: string,
      @Req() req: RequestWithUser,
    ) {
      return this.usersService.removeFromGroup(id, req.user.userId);
    }
  }
  