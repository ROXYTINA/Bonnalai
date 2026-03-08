import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateStuffDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}