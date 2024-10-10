import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @ManyToMany(() => Company, (company) => company.fields)
  companies: Company[];
}

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  linkWebsite: string;

  @Column({ nullable: true })
  employeeSize: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  coverImage: string;

  @ManyToMany(() => Field, (field) => field.companies)
  @JoinTable({
    name: 'company_field',
    joinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'company_field_company_id',
    },
    inverseJoinColumn: {
      name: 'field_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'company_field_field_id',
    },
  })
  fields: Field[];

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn()
  updatedBy: User;

  @ManyToOne(() => User)
  @JoinColumn()
  deletedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

// @Entity()
export class company_field {
  @PrimaryColumn({ name: 'company_id' })
  companyId: number;

  @PrimaryColumn({ name: 'field_id' })
  fieldId: number;

  @ManyToMany(() => Company, (company) => company.fields)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  companies: Company[];

  @ManyToMany(() => Field, (field) => field.companies)
  @JoinColumn([{ name: 'field_id', referencedColumnName: 'id' }])
  fields: Field[];
}
