// import { ApiProperty } from '@nestjs/swagger';

export class LearningPathCreateRequest {
  // @ApiProperty()
  title: string;

  // @ApiProperty()
  description: string;

  // @ApiProperty()
  courses: string[];
}