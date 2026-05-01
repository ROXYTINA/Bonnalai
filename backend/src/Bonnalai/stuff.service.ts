import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Year, Document, OtherDocument, Subject } from './entities/bonalai.entities.js';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class StuffService {

    constructor(
        @InjectModel(Document.name)
        private documentModel: Model<Document>,

        @InjectModel(OtherDocument.name)
        private otherDocumentModel: Model<OtherDocument>,

        @InjectModel(Subject.name)
        private subjectModel: Model<Subject>,

        @InjectModel(Year.name)
        private yearModel: Model<Year>,
    ) {}

    private ensureObjectId(id: string, label: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error(`${label} must be a valid ObjectId.`);
        }
        return new Types.ObjectId(id);
    }

    private isSubjectPopulated(value: unknown): value is Subject {
        return typeof value === 'object' && value !== null && 'name' in value;
    }

    private isYearPopulated(value: unknown): value is Year {
        return typeof value === 'object' && value !== null && 'name' in value;
    }

    // Get all documents
    async getAllDocuments() {
        const documents = await this.documentModel
            .find()
            .populate('subject')
            .populate('year')
            .lean();
        return documents.map(doc => ({
            ...doc,
            subjectName: this.isSubjectPopulated(doc.subject) ? doc.subject.name : 'N/A',
            subjectCode: this.isSubjectPopulated(doc.subject) ? doc.subject.code || 'N/A' : 'N/A',
            yearName: this.isYearPopulated(doc.year) ? doc.year.name : 'N/A',
            fileCode: doc._id ? `DOC-${String(doc._id)}` : 'N/A',
        }));
    }

    // Get document by ID
    async getDocument(id: string) {
        if (!Types.ObjectId.isValid(id)) return null;
        const doc = await this.documentModel
            .findById(id)
            .populate('subject')
            .populate('year')
            .lean();
        if (!doc) return null;
        return {
            ...doc,
            subjectName: this.isSubjectPopulated(doc.subject) ? doc.subject.name : 'N/A',
            yearName: this.isYearPopulated(doc.year) ? doc.year.name : 'N/A',
            fileCode: doc._id ? `DOC-${String(doc._id)}` : 'N/A',
        };
    }

    // Create a new document
    async createDocument(file: Express.Multer.File | undefined, body: { title: string; description?: string; subjectId: string; yearId: string }) {
        try {
            console.log('File received:', file);
            console.log('Body:', body);

            let filePath: string = '';

            // If file is received, save it to disk
            if (file && file.buffer) {
                const uploadsDir = path.resolve('uploads');
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
                const fullPath = path.join(uploadsDir, filename);
                filePath = `/uploads/${filename}`; // URL for frontend
                fs.writeFileSync(fullPath, file.buffer);
                console.log('File saved to:', fullPath);
            }

            // Validate subject and year existence
            const subjectId = this.ensureObjectId(body.subjectId, 'subjectId');
            const yearId = this.ensureObjectId(body.yearId, 'yearId');

            const subject = await this.subjectModel.findById(subjectId).lean();
            if (!subject) {
                throw new Error(`Subject with ID ${body.subjectId} does not exist.`);
            }

            const year = await this.yearModel.findById(yearId).lean();
            if (!year) {
                throw new Error(`Year with ID ${body.yearId} does not exist.`);
            }

            const document = new this.documentModel({
                title: body.title,
                description: body.description,
                filePath: filePath,
                subject: subjectId,
                year: yearId,
            });

            return await document.save();
        } catch (error) {
            console.error('Error saving document:', error.message);
            throw new Error(`Failed to save document: ${error.message}`);
        }
    }

    // Delete a document
    async deleteDocument(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return { message: 'success' };
        }
        const doc = await this.documentModel.findById(id).lean();
        if (doc && doc.filePath) {
            // Remove leading slash if present
            const filePath = doc.filePath.startsWith('/') ? doc.filePath.slice(1) : doc.filePath;
            const fullPath = path.resolve(filePath);
            try {
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log('Deleted file:', fullPath);
                }
            } catch (err) {
                console.warn('Could not delete file:', fullPath, err);
            }
        }
        await this.documentModel.deleteOne({ _id: id });
        return { message: 'success' };
    }

    // Get all other documents
    async getAllOtherDocuments() {
        return await this.otherDocumentModel.find().lean();
    }

    // Create a new other document
    async createOtherDocument(file: Express.Multer.File | undefined, body: { title: string; description?: string }) {
        console.log('File received:', file);
        console.log('Body:', body);

        let filePath: string = '';

        // If file is received, save it to disk
        if (file && file.buffer) {
            const uploadsDir = path.resolve('uploads');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
            const fullPath = path.join(uploadsDir, filename);
            filePath = `/uploads/${filename}`; // URL for frontend
            fs.writeFileSync(fullPath, file.buffer);
            console.log('File saved to:', fullPath);
        }

        const otherDocument = new this.otherDocumentModel({
            title: body.title,
            description: body.description,
            filePath: filePath,
        });
        return await otherDocument.save();
    }

    // Delete an other document
    async deleteOtherDocument(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return { message: 'success' };
        }
        const doc = await this.otherDocumentModel.findById(id).lean();
        if (doc && doc.filePath) {
            // Remove leading slash if present
            const filePath = doc.filePath.startsWith('/') ? doc.filePath.slice(1) : doc.filePath;
            const fullPath = path.resolve(filePath);
            try {
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log('Deleted file:', fullPath);
                }
            } catch (err) {
                console.warn('Could not delete file:', fullPath, err);
            }
        }
        await this.otherDocumentModel.deleteOne({ _id: id });
        return { message: 'success' };
    }

    // Add a method to fetch documents by yearId
    async getDocumentsByYear(yearId: string) {
        const yearObjectId = this.ensureObjectId(yearId, 'yearId');
        const documents = await this.documentModel
            .find({ year: yearObjectId })
            .populate('subject')
            .populate('year')
            .lean();
        return documents.map(doc => ({
            ...doc,
            subjectName: this.isSubjectPopulated(doc.subject) ? doc.subject.name : 'N/A',
            subjectCode: this.isSubjectPopulated(doc.subject) ? doc.subject.code || 'N/A' : 'N/A',
            yearName: this.isYearPopulated(doc.year) ? doc.year.name : 'N/A',
            fileCode: doc._id ? `DOC-${String(doc._id)}` : 'N/A',
        }));
    }
}