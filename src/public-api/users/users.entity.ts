import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export const ROLES = {
  SHOPPER: 'shopper',
  INFLUENCER: 'influencer',
  MARKETPLACE_ADMIN: 'marketplace_admin',
  STORE_ADMIN: 'store_admin',
  SELLER_PERSON: 'seller_person',
  SUPER_ADMIN: 'super_admin',
};
@Entity('users')
export class Users extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: unknown;

  @Column({ type: 'simple-array', default: ROLES.SHOPPER })
  roles: keyof (typeof ROLES)[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
