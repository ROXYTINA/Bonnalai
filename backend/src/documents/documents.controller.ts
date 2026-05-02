import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly service: DocumentsService) {}

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('by-subject')
    bySubject(@Query('id') id: number) {
        return this.service.findBySubject(id);
    }

    @Get('by-year')
    byYear(@Query('id') id: number) {
        return this.service.findByYear(id);
    }
}