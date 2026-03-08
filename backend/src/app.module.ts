import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StuffModule } from './Bonnalai/stuff.module';
import { files } from './Bonnalai/stuff.entities';

// Ensure uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, uploadsDir);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
                    cb(null, filename);
                },
            }),
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'stuff.sqlite',
            entities: [files],
            synchronize: true,
        }),
        StuffModule,
    ],
})
export class AppModule {}
