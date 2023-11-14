import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { sha256 } from 'js-sha256';
import { Categories } from '../categories/categories.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(body: CreateUserDto) {
    const newTask: Users = this.usersRepository.create(body);
    return await this.usersRepository.save(newTask);
  }

  async update(id: string, body: any) {
    const task = await this.usersRepository.findOneBy({ id });
    this.usersRepository.merge(task, body);
    return this.usersRepository.save(task);
  }

  async delete(id: string) {
    await this.usersRepository.delete(id);
    return true;
  }

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['purchases', 'purchases.course', 'interests'],
    });
  }

  findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOneBy({ email });
  }

  addExamTaken(userId: string, examId: string, name: string, avgScore: number) {
    return this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        examsTaken: () =>
          `exams_taken || '{"examId": "${examId}", "name": "${name}", "avgScore": ${avgScore}, "createdAt": "${new Date().toISOString()}"}'`,
      })
      .where('id = :id', { id: userId })
      .execute();
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const salt = process.env.SALT_HASH;
    const isMatch = (await sha256(oldPassword + salt)) === user.password;
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    return await this.usersRepository.update(userId, {
      password: newPassword,
    });
  }

  async changeProfile(
    userId: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
    categories: Categories[]
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;
    user.interests = [];

    user.interests = categories;
    return await this.usersRepository.save(user);

  }
}
