import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export const ROLES = {
  STANDARD_USER: 'standard-user',
  ADMIN: 'admin',
};
@Entity('users')
export class Users extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: unknown;

  @Column({ type: 'simple-array', default: ROLES.STANDARD_USER })
  roles: keyof (typeof ROLES)[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
