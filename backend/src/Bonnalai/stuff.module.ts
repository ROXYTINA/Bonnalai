import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema, OtherDocument, OtherDocumentSchema, Subject, SubjectSchema, Year, YearSchema } from './entities/bonalai.entities.js';
import { StuffController } from './stuff.controller.js';
import { StuffService } from './stuff.service.js';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Year.name, schema: YearSchema },
            { name: Subject.name, schema: SubjectSchema },
            { name: Document.name, schema: DocumentSchema },
            { name: OtherDocument.name, schema: OtherDocumentSchema },
        ]),
    ],
    controllers: [StuffController],
    providers: [StuffService],
    exports: [MongooseModule],
})

export class StuffModule {}