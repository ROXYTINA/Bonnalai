import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'

@Injectable()
export class TestService {
    constructor(private supabaseService: SupabaseService) {}

    async findAll() {
        const supabase = this.supabaseService.getClient()

        const { data, error } = await supabase
            .from('test')
            .select('*')

        if (error) throw new Error(error.message)

        return data
    }

    async create(title: string) {
        const supabase = this.supabaseService.getClient()

        const { data, error } = await supabase
            .from('tests')
            .insert({ title })

        if (error) throw new Error(error.message)

        return data
    }
}