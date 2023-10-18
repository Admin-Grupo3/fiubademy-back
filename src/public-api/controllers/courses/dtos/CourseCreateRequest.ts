// import { ApiProperty } from '@nestjs/swagger';

export class CourseCreateRequest {
  // @ApiProperty()
  title: string;

  // @ApiProperty()
  language: string;

  // @ApiProperty()
  categoryIds: number[];
}
