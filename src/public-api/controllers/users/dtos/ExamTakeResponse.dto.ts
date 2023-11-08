// import { ApiProperty } from '@nestjs/swagger';

export class ExamTakeResponse {
  // @ApiProperty()
  examName: string;

  // @ApiProperty()
  avgScore: number;

  // @ApiProperty()
  correctAnswers: object;
}
