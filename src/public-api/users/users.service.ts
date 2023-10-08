import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';

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

  findById(id: string): Promise<Users> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOneBy({ email });
  }
}
