import { Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StuffService } from "./stuff.service.js";
import { CreateStuffDto } from "./dto/create-stuff.dto.js";

@Controller('stuff')
export class StuffController {
    constructor(private stuffService: StuffService) {}

    //get all documents
    @Get('/')
    getAllDocuments() {
        return this.stuffService.getAllDocuments();
    }

    //get document by id
    @Get('/:id')
    getDocument(@Param('id') id: string) {
        return this.stuffService.getDocument(id);
    }

    //create new document with file upload
    @Post('/')
    @UseInterceptors(FileInterceptor('file'))
    async createDocument(
        @UploadedFile() file: Express.Multer.File | undefined,
        @Body() createStuffDto: CreateStuffDto
    ) {
        try {
            return await this.stuffService.createDocument(file, {
                subjectId: createStuffDto.subjectId,
                yearId: createStuffDto.yearId,
                title: createStuffDto.title,
                description: createStuffDto.description,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //delete document
    @Delete('/:id')
    deleteDocument(@Param('id') id: string) {
        return this.stuffService.deleteDocument(id);
    }

    // Add a new endpoint to fetch documents by yearId
    @Get('/year/:yearId')
    getDocumentsByYear(@Param('yearId') yearId: string) {
        return this.stuffService.getDocumentsByYear(yearId);
    }

}