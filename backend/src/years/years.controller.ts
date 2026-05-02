import { Controller, Get, Post, Body } from '@nestjs/common';
import { YearsService } from './years.service.js';

@Controller('years')
export class YearsController {
    constructor(private readonly service: YearsService) {}

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}