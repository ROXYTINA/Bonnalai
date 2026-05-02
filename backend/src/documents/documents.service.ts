import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
    private documents: any[] = [];

    create(doc: any) {
        const newDoc = {
            id: Date.now(),
            ...doc,
        };
        this.documents.push(newDoc);
        return newDoc;
    }

    findAll() {
        return this.documents;
    }

    findBySubject(id: number) {
        return this.documents.filter(d => d.subject_id == id);
    }

    findByYear(id: number) {
        return this.documents.filter(d => d.year_id == id);
    }
}