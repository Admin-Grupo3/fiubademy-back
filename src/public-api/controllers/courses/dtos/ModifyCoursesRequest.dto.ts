// import { ApiProperty } from '@nestjs/swagger';

export class ModifyCoursesRequest {
  // @ApiProperty()
  title?: string;

  // @ApiProperty()
  categories?: number[];

  // @ApiProperty()
  price?: number;

  // @ApiProperty()
  description?: string;

  // @ApiProperty()
  language: string;
}
