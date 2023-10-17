// import { ApiProperty } from '@nestjs/swagger';

export class CourseCreateRequest {
  // @ApiProperty()
  title: string;

  // @ApiProperty()
  languageId: number;

  // @ApiProperty()
  categoryIds: number[];
}
