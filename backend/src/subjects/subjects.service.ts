import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service.js';

// const MOCK_SUBJECTS = [
//   { id: 1, name: 'Mathematics', title: 'Math' },
//   { id: 2, name: 'English Literature', title: 'English' },
//   { id: 3, name: 'Science', title: 'Science' },
//   { id: 4, name: 'History', title: 'History' },
//   { id: 5, name: 'Physical Education', title: 'PE' },
// ];

@Injectable()
export class SubjectsService {
    private readonly logger = new Logger(SubjectsService.name);

    constructor(private readonly supabaseService: SupabaseService) {}

    async create(subject: any) {
        const supabase: SupabaseClient = this.supabaseService.getClient();
        const { data, error } = await supabase.from('subjects').insert([subject]).select('*').single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async findAll() {
        try {
            const supabase: SupabaseClient = this.supabaseService.getClient();
            const { data, error } = await supabase.from('subjects').select('*').order('id', { ascending: false });

            if (error) {
                this.logger.error(`Supabase error while loading subjects: ${error.message}`);
                // return MOCK_SUBJECTS;
            }

            return data && data.length > 0 ? data : [];
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to fetch subjects from Supabase: ${message}`);
            // return MOCK_SUBJECTS;
        }
    }
}