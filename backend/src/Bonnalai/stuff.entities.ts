import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class files{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @Column()
    department: string;

    @Column()
    fileName: string;

    @Column()
    fileCode: string;

    @Column({ nullable: true })
    filePath: string;
}