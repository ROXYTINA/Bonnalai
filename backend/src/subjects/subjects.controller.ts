import { Controller, Get, Post, Body } from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';

@Controller('subjects')
export class SubjectsController {
    constructor(private readonly service: SubjectsService) {}

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}