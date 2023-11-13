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
  companyName?: string;
}
