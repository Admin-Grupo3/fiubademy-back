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

  // @ApiProperty()
  what_will_you_learn?: string[];

  // @ApiProperty()
  content?: string[];

  // @ApiProperty()
  video?: string;

}
