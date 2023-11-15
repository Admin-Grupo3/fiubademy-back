// import { ApiProperty } from '@nestjs/swagger';

import { Categories } from "src/public-api/categories/categories.entity";

export class UsersProfileResponse {
  // @ApiProperty()
  id: string;

  // @ApiProperty()
  email: string;

  // @ApiProperty()
  roles: string[];

  // @ApiProperty()
  birthDate: Date;

  // @ApiProperty()
  interests: Categories[];
}
