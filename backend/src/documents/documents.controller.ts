import {Controller, Get, Post, Body, Query, UploadedFile, UseInterceptors} from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('documents')
export class DocumentsController {
    constructor(private readonly service: DocumentsService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any
    ) {
        return this.service.upload(file, body);
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
