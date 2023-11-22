// import { ApiProperty } from '@nestjs/swagger';

export class RatingCreateRequest {
  courseId: string;

  // @ApiProperty()
  rating: string;

  // @ApiProperty()
  opinion: string;
}
