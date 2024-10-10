import { Company } from 'src/companies/entities/company.entity';
import { Job } from 'src/jobs/entities/job.entity';
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
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  status: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  updatedBy: User;

  @ManyToMany(() => Resume, (resume) => resume.histories)
  resumes: Resume[];
}

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  token: string;

  @ManyToOne(() => Company)
  @JoinColumn()
  company?: Company;

  @ManyToOne(() => Job)
  @JoinColumn()
  job?: Job;

  @ManyToMany(() => History, (history) => history.resumes)
  @JoinTable({
    name: 'resume_history',
    joinColumn: {
      name: 'resume_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'resume_history_resume_id',
    },
    inverseJoinColumn: {
      name: 'history_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'resume_history_history_id',
    },
  })
  histories?: History[];

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
export class resume_history {
  @PrimaryColumn({ name: 'resume_id' })
  resumeId: number;

  @PrimaryColumn({ name: 'history_id' })
  historyId: number;

  @ManyToMany(() => Resume, (resume) => resume.histories)
  @JoinColumn([{ name: 'resume_id', referencedColumnName: 'id' }])
  resumes: Resume[];

  @ManyToMany(() => History, (history) => history.resumes)
  @JoinColumn([{ name: 'history_id', referencedColumnName: 'id' }])
  histories: History[];
}
