// import { ApiProperty } from '@nestjs/swagger';

export class CourseCreateRequest {
  // @ApiProperty()
  title: string;

  // @ApiProperty()
  language: string;

  // @ApiProperty()
  categoryIds: number[];

  // @ApiProperty()
  description: string;

  // @ApiProperty()
  price: number;

  // @ApiProperty()
  what_will_you_learn: string[];

  // @ApiProperty()
  content: string[];

  // @ApiProperty()
  video: string;

  // @ApiProperty()
  companyName?: string;
}
