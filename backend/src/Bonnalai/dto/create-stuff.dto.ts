import { IsString, IsOptional } from 'class-validator';

export class CreateStuffDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    subjectId: string;

    @IsString()
    yearId: string;
}