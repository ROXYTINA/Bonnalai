import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service.js';

// const MOCK_DOCUMENTS = [
//   {
//     id: 1,
//     title: 'Mathematics Chapter 5 - Algebra',
//     description: 'Complete notes on algebraic expressions and equations',
//     subject_id: 1,
//     year_id: 2,
//     file_url: 'https://example.com/files/math-ch5.pdf',
//   },
//   {
//     id: 2,
//     title: 'English Literature - Shakespeare Analysis',
//     description: 'Essay notes on Hamlet themes and character development',
//     subject_id: 2,
//     year_id: 2,
//     file_url: 'https://example.com/files/english-hamlet.pdf',
//   },
//   {
//     id: 3,
//     title: 'Science Lab Report - Chemistry Experiment',
//     description: 'Complete lab report on acid-base neutralization',
//     subject_id: 3,
//     year_id: 1,
//     file_url: 'https://example.com/files/science-lab.pdf',
//   },
//   {
//     id: 4,
//     title: 'History Research Paper - World War II',
//     description: 'Comprehensive research on WWII causes and impact',
//     subject_id: 4,
//     year_id: 2,
//     file_url: 'https://example.com/files/history-wwii.pdf',
//   },
//   {
//     id: 5,
//     title: 'Physical Education - Sports Science',
//     description: 'Notes on biomechanics and athletic training',
//     subject_id: 5,
//     year_id: 3,
//     file_url: null,
//   },
// ];

@Injectable()

export class DocumentsService {

  private readonly logger = new Logger(DocumentsService.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  async upload(file: Express.Multer.File, body: any) {
     const supabase: SupabaseClient = this.supabaseService.getClient();
     const fileName = `${Date.now()}-${file.originalname}`;
    const { error } = await supabase.storage
      .from('documents')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      throw new Error(error.message);
    }
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);
    const fileUrl = urlData.publicUrl;

    const { data: doc } = await supabase
      .from('documents')
      .insert([
        {
          title: body.title,
          description: body.description,
          subject_id: body.subject_id,
          year_id: body.year_id,
          file_url: fileUrl,
        },
      ]);
    return {
      message: 'File uploaded successfully',
      document: doc,
    };

  }


  //MOCK DATA for testing
  // async findAll() {
  //   try {
  //     const supabase: SupabaseClient = this.supabaseService.getClient();
  //     const { data, error } = await supabase.from('documents').select('*').order('id', { ascending: false });
  //     if (error) {
  //       this.logger.error('Supabase error while loading documents: ' + error.message);
  //       return MOCK_DOCUMENTS;
  //     }
  //     return data && data.length > 0 ? data : MOCK_DOCUMENTS;
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : String(error);
  //     this.logger.error('Failed to fetch documents from Supabase: ' + message);
  //     return MOCK_DOCUMENTS;
  //   }
  // }

  // async findBySubject(id: number) {
  //   try {
  //     const supabase: SupabaseClient = this.supabaseService.getClient();
  //     const { data, error } = await supabase
  //       .from('documents')
  //       .select('*')
  //       .eq('subject_id', id)
  //       .order('id', { ascending: false });
  //     if (error) {
  //       this.logger.error('Supabase error while loading documents by subject: ' + error.message);
  //       return MOCK_DOCUMENTS.filter((doc) => doc.subject_id === id);
  //     }
  //     return data && data.length > 0 ? data : MOCK_DOCUMENTS.filter((doc) => doc.subject_id === id);
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : String(error);
  //     this.logger.error('Failed to fetch documents by subject from Supabase: ' + message);
  //     return MOCK_DOCUMENTS.filter((doc) => doc.subject_id === id);
  //   }
  // }
  // async findByYear(id: number) {
  //   try {
  //     const supabase: SupabaseClient = this.supabaseService.getClient();
  //     const { data, error } = await supabase
  //       .from('documents')
  //       .select('*')
  //       .eq('year_id', id)
  //       .order('id', { ascending: false });
  //     if (error) {
  //       this.logger.error('Supabase error while loading documents by year: ' + error.message);
  //       return MOCK_DOCUMENTS.filter((doc) => doc.year_id === id);
  //     }
  //     return data && data.length > 0 ? data : MOCK_DOCUMENTS.filter((doc) => doc.year_id === id);
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : String(error);
  //     this.logger.error('Failed to fetch documents by year from Supabase: ' + message);
  //     return MOCK_DOCUMENTS.filter((doc) => doc.year_id === id);
  //   }
  // }


  //find all API

  async findAll() {
    try {
      const supabase: SupabaseClient = this.supabaseService.getClient();

      const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('id', { ascending: false });

      if (error) {
        this.logger.error('Supabase error while loading documents: ' + error.message);
        throw new Error('Failed to fetch documents');
      }

      return data ?? [];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to fetch documents: ' + message);

      throw new Error('Database connection failed');
    }
  }

  async findBySubject(id: number) {
    try {
      const supabase: SupabaseClient = this.supabaseService.getClient();

      const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('subject_id', id)
          .order('id', { ascending: false });

      if (error) {
        this.logger.error('Supabase error: ' + error.message);
        throw new Error('Failed to fetch by subject');
      }

      return data ?? [];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findByYear(id: number) {
    try {
      const supabase: SupabaseClient = this.supabaseService.getClient();

      const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('year_id', id)
          .order('id', { ascending: false });

      if (error) {
        this.logger.error('Supabase error: ' + error.message);
        throw new Error('Failed to fetch by year');
      }

      return data ?? [];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }


}
