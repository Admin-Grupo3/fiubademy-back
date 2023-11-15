import { LearningPaths } from 'src/public-api/learning-paths/learning-paths.entity';
import { Users } from 'src/public-api/users/users.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('learningPathPurchases')
export class LearningPathPurchases extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => LearningPaths, (learningPath) => learningPath.id)
  learningPath: LearningPaths;

  @CreateDateColumn()
  purchaseDate: Date;
}
