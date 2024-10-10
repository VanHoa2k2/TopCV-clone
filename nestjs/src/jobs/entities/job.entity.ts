import { Company } from 'src/companies/entities/company.entity';
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

// Skill.entity.ts
@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  // ... other columns or relations

  @ManyToMany(() => Job, (job) => job.skills)
  jobs: Job[];
}

@Entity()
export class Occupation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  // ... other columns or relations

  @ManyToMany(() => Job, (job) => job.skills)
  jobs: Job[];
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @ManyToMany(() => Skill, (skill) => skill.jobs)
  @JoinTable({
    name: 'job_skill',
    joinColumn: {
      name: 'job_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'job_skill_job_id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'job_skill_skill_id',
    },
  })
  skills: Skill[];

  @ManyToMany(() => Occupation, (occupation) => occupation.jobs)
  @JoinTable({
    name: 'job_occupation',
    joinColumn: {
      name: 'job_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'job_occupation_job_id',
    },
    inverseJoinColumn: {
      name: 'occupation_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'job_occupation_occupation_id',
    },
  })
  occupations: Occupation[];

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  employmentType: string;

  @Column({ nullable: true })
  genderReq: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  experience: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  isActive: boolean;

  @ManyToOne(() => Company)
  @JoinColumn()
  company: Company;

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
export class job_skill {
  @PrimaryColumn({ name: 'job_id' })
  jobId: number;

  @PrimaryColumn({ name: 'skill_id' })
  skillId: number;

  @ManyToMany(() => Job, (job) => job.skills)
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'id' }])
  jobs: Job[];

  @ManyToMany(() => Skill, (skill) => skill.jobs)
  @JoinColumn([{ name: 'skill_id', referencedColumnName: 'id' }])
  skills: Skill[];
}

export class job_occupation {
  @PrimaryColumn({ name: 'job_id' })
  jobId: number;

  @PrimaryColumn({ name: 'occupation_id' })
  occupationId: number;

  @ManyToMany(() => Job, (job) => job.occupations)
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'id' }])
  jobs: Job[];

  @ManyToMany(() => Occupation, (occupation) => occupation.jobs)
  @JoinColumn([{ name: 'occupation_id', referencedColumnName: 'id' }])
  occupations: Occupation[];
}
