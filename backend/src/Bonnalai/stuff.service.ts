import { Injectable } from "@nestjs/common";
import { files } from "./stuff.entities";
// @ts-ignore
import { Repository } from "typeorm";
// @ts-ignore
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class StuffService {

    constructor(
        @InjectRepository(files)
        private stuffRepository: Repository<files>,
    ) {}

    //get all stuff
    async getAllStuff() {
        return await this.stuffRepository.find();
    }

    //get stuff by id
    async getStuff(id: string) {
        return await this.stuffRepository.findOne({
            where: { id: parseInt(id) },
        });
    }

    //create new stuff
    async createStuff(file: Express.Multer.File | undefined, body: { subject: string; department: string; fileName: string; fileCode: string }) {
        console.log('File received:', file);
        console.log('Body:', body);

        let filePath: string | null = null;

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

        const stuff = this.stuffRepository.create({
            subject: body.subject,
            department: body.department,
            fileName: body.fileName,
            fileCode: body.fileCode,
            filePath: filePath,
        } as any);
        return await this.stuffRepository.save(stuff);
    }


    //delete stuff
    async deleteStuff(id: string) {
        const doc = await this.stuffRepository.findOne({ where: { id: parseInt(id) } });
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
        await this.stuffRepository.delete(parseInt(id));
        return { message: 'success' };
    }
}