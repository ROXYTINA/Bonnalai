import { Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StuffService } from "./stuff.service";

@Controller('stuff')
export class StuffController {
    constructor(private stuffService: StuffService) {}

    //get all stuff
    @Get('/')
    getAllStuff() {
        return this.stuffService.getAllStuff();
    }

    //get stuff by id
    @Get('/:id')
    getStuff(@Param('id') id: string) {
        return this.stuffService.getStuff(id);
    }

    //create new stuff with file upload
    @Post('/')
    @UseInterceptors(FileInterceptor('file'))
    createStuff(
        @UploadedFile() file: Express.Multer.File | undefined,
        @Body('subject') subject: string,
        @Body('department') department: string,
        @Body('fileName') fileName: string,
        @Body('fileCode') fileCode: string
    ) {
        return this.stuffService.createStuff(file, { subject, department, fileName, fileCode });
    }

    //delete stuff
    @Delete('/:id')
    deleteStuff(@Param('id') id: string) {
        return this.stuffService.deleteStuff(id);
    }

}