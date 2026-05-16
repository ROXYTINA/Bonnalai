import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service.js';

// const MOCK_YEARS = [
//   { id: 1, year: '2023', name: '2023 - Grade 10' },
//   { id: 2, year: '2024', name: '2024 - Grade 11' },
//   { id: 3, year: '2025', name: '2025 - Grade 12' },
//   { id: 4, year: '2026', name: '2026 - College Year 1' },
// ];

@Injectable()
export class YearsService {
    private readonly logger = new Logger(YearsService.name);

    constructor(private readonly supabaseService: SupabaseService) {}

    async create(year: any) {
        const supabase: SupabaseClient = this.supabaseService.getClient();
        const { data, error } = await supabase.from('years').insert([year]).select('*').single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async findAll() {
        try {
            const supabase: SupabaseClient = this.supabaseService.getClient();
            const { data, error } = await supabase.from('years').select('*').order('id', { ascending: false });

            if (error) {
                this.logger.error(`Supabase error while loading years: ${error.message}`);
                // return MOCK_YEARS;
            }

            return data && data.length > 0 ? data : [];
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to fetch years from Supabase: ${message}`);
            // return MOCK_YEARS;
        }
    }
}