import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type YearDocument = HydratedDocument<Year>;
export type SubjectDocument = HydratedDocument<Subject>;
export type DocumentDocument = HydratedDocument<Document>;
export type OtherDocumentDocument = HydratedDocument<OtherDocument>;

@Schema()
export class Year {
    @Prop({ required: true })
    name: string;
}

@Schema()
export class Subject {
    @Prop({ required: true })
    name: string;

    @Prop()
    code?: string;

    @Prop({ type: Types.ObjectId, ref: Year.name, required: true })
    year: Types.ObjectId;
}

@Schema()
export class Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    filePath: string;

    @Prop()
    description?: string;

    @Prop({ type: Date, default: Date.now })
    uploadedAt: Date;

    @Prop({ type: Types.ObjectId, ref: Subject.name, required: true })
    subject: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Year.name, required: true })
    year: Types.ObjectId;
}

@Schema()
export class OtherDocument {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    filePath: string;

    @Prop()
    description?: string;

    @Prop({ type: Date, default: Date.now })
    uploadedAt: Date;
}

export const YearSchema = SchemaFactory.createForClass(Year);
export const SubjectSchema = SchemaFactory.createForClass(Subject);
export const DocumentSchema = SchemaFactory.createForClass(Document);
export const OtherDocumentSchema = SchemaFactory.createForClass(OtherDocument);

