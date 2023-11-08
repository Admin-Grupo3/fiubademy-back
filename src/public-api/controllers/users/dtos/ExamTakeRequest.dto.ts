// import { ApiProperty } from '@nestjs/swagger';

export interface answer {
  questionId: string;
  answer: string;
}

export class ExamTakeRequest {
  // @ApiProperty()
  answers: answer[];
}
