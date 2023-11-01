export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

export class CreateCourseExamDto {
  name: string;
  description: string;
  questions: Question[];
}
