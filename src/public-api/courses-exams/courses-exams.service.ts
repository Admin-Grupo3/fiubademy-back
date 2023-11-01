import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesExams } from './courses-exams.entity';
import { CreateCourseExamDto } from './dtos/CreateCourseExam';
import { CoursesQuestions } from './courses-questions/courses-questions.entity';
import { v4 as uuidv4 } from 'uuid';
import e from 'express';

@Injectable()
export class CoursesExamService {
  constructor(
    @InjectRepository(CoursesExams)
    private readonly coursesExamsRepository: Repository<CoursesExams>,
    @InjectRepository(CoursesQuestions)
    private readonly coursesQuestionsRepository: Repository<CoursesQuestions>,
  ) {}

  async create(body: CreateCourseExamDto) {
    const newExam: CoursesExams = this.coursesExamsRepository.create();
    newExam.name = body.name;
    newExam.description = body.description;
    newExam.questions = [];
    const exam = await this.coursesExamsRepository.save(newExam);

    // add questions to repository
    const questions = [];
    body.questions.forEach(async (question) => {
      const newQuestion: CoursesQuestions =
        this.coursesQuestionsRepository.create();
      newQuestion.question = question.question;
      newQuestion.answers = [];

      // add answers to question
      if (question.answers.length <= 1) {
        throw new Error('Question must have at least 2 answers');
      }
      question.answers.forEach((answer) => {
        const id = uuidv4();
        if (question.correctAnswer === answer) {
          newQuestion.correctAnswerId = id;
        }
        newQuestion.answers.push({
          id,
          answer,
        });
      });

      newQuestion.exam = exam;
      const questionSaved = await this.coursesQuestionsRepository.save(
        newQuestion,
      );
      questions.push(questionSaved);
    });

    return this.coursesExamsRepository.findOne({
      where: { id: exam.id },
      relations: ['questions'],
    });
  }

  async delete(id: string) {
    // delete CoursesQuestions
    const courseExam = await this.coursesExamsRepository.findOne({
      where: { id },
    });
    if (!courseExam) {
      throw new Error('Course Exam not found');
    }
    courseExam.questions.forEach(async (question) => {
      await this.coursesQuestionsRepository.delete(question.id);
    });
    return this.coursesExamsRepository.delete(id);
  }

  async update(id: string, body: CreateCourseExamDto) {
    const courseExam = await this.coursesExamsRepository.findOne({
      where: { id },
    });
    if (!courseExam) {
      throw new Error('Course Exam not found');
    }
    courseExam.name = body.name;
    courseExam.description = body.description;

    // add questions to repository
    const questions: CoursesQuestions[] = [];
    body.questions.forEach((question) => {
      const newQuestion: CoursesQuestions =
        this.coursesQuestionsRepository.create();
      newQuestion.question = question.question;

      // add answers to question
      const answers = [];
      if (question.answers.length <= 1) {
        throw new Error('Question must have at least 2 answers');
      }
      question.answers.forEach((answer) => {
        const id = uuidv4();
        if (question.correctAnswer === answer) {
          newQuestion.correctAnswerId = id;
        }
        answers.push({
          id,
          answer,
        });
      });

      questions.push(newQuestion);
    });

    return await this.coursesExamsRepository.save(courseExam);
  }
}
