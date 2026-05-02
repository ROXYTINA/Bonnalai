import { Injectable } from '@nestjs/common';

@Injectable()
export class YearsService {
    private years: any[] = [];

    create(year: any) {
        const newYear = {
            id: Date.now(),
            ...year,
        };
        this.years.push(newYear);
        return newYear;
    }

    findAll() {
        return this.years;
    }
}