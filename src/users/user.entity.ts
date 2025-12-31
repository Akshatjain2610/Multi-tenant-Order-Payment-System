import { BaseEntity } from 'src/common/base/base.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User extends BaseEntity { 
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;
}
