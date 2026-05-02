import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectsService {
    private subjects: any[] = [];

    create(subject: any) {
        const newSubject = {
            id: Date.now(),
            ...subject,
        };
        this.subjects.push(newSubject);
        return newSubject;
    }

    findAll() {
        return this.subjects;
    }
}