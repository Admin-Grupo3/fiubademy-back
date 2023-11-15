import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserSignInRequest } from './dtos/UserSignInRequest.dto';
import { UserSignUpRequest } from './dtos/UserSignUpRequest.dto';
import { Response } from 'express';
import { UsersManagerService } from 'src/public-api/usersManager.service';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';
import { AuthTokenData } from 'src/public-api/authentication/dtos/AuthTokenData.dto';
import { TokenData } from 'src/public-api/authentication/tokenData.decorator';
import { CoursesManagerService } from 'src/public-api/coursesManager.service';
import { ExamTakeRequest } from './dtos/ExamTakeRequest.dto';
import { ExamTakeResponse } from './dtos/ExamTakeResponse.dto';
import { ChangePasswordRequest } from './dtos/ChangePassword.dto';
import { UsersProfileResponse } from './dtos/UsersProfile.dto';
import { ChangeProfileRequest } from './dtos/ChangeProfile.dto';

interface SignIn {
  userData: string;
  token: string;
  tokenMaxAge: string;
}

@Controller()
export class UsersController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private coursesManagerService: CoursesManagerService,
    private usersManagerService: UsersManagerService,
  ) {}

  @Post('users/signin')
  async signIn(@Body() request: UserSignInRequest, @Res() response: Response) {
    const { email, password } = request;
    let signInRes: SignIn;
    try {
      signInRes = await this.usersManagerService.signInUser(email, password);
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException('Wrong Credentials', HttpStatus.FORBIDDEN);
    }

    const userData = JSON.parse(signInRes.userData);

    const body = { ...userData };

    return this.usersManagerService.returnTokenAsCookie(
      response,
      signInRes.token,
      parseInt(signInRes.tokenMaxAge),
      body,
    );
  }

  @Post('users/signup')
  async signUp(@Body() request: UserSignUpRequest, @Res() response: Response) {
    const { email, password, firstName, lastName } = request;
    let signUpRes: SignIn;
    try {
      signUpRes = await this.usersManagerService.signUpUser(email, password, firstName, lastName);
    } catch (error) {
      Logger.warn(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }

    const userData = JSON.parse(signUpRes.userData);

    const body = { ...userData };

    return this.usersManagerService.returnTokenAsCookie(
      response,
      signUpRes.token,
      parseInt(signUpRes.tokenMaxAge),
      body,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('users/logout')
  async logOut(@Res() response: Response) {
    return this.usersManagerService.removeTokenCookie(response);
  }

  @UseGuards(LocalAuthGuard)
  @Post('users/course/:courseId/exams/:examId')
  async ExamTake(
    @TokenData() tokenData: AuthTokenData,
    @Param() { courseId, examId }: { courseId: string; examId: string },
    @Body() request: ExamTakeRequest,
  ): Promise<ExamTakeResponse> {
    const userId = tokenData.sub;
    const { answers } = request;

    const exam = await this.coursesManagerService.correctExamFromCourse(
      userId,
      courseId,
      examId,
      answers,
    );
    return exam.exam;
  }

  @UseGuards(LocalAuthGuard)
  @Post('users/update/password')
  async changePassword(
    @TokenData() tokenData: AuthTokenData,
    @Body() request: ChangePasswordRequest,
  ) {
    const { oldPassword, newPassword } = request;
    const userId = tokenData.sub;
    await this.usersManagerService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );
    return {
      message: 'Password changed successfully',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Get('users/profile')
  async getProfile(
    @TokenData() tokenData: AuthTokenData,
  ): Promise<UsersProfileResponse> {
    const userId = tokenData.sub;
    return await this.usersManagerService.profile(userId);
  }

  @UseGuards(LocalAuthGuard)
  @Post('users/update/profile')
  async changeProfile(
    @TokenData() tokenData: AuthTokenData,
    @Body() request: ChangeProfileRequest,
  ) {
    const { firstName, lastName, birthDate, interests } = request;
    const userId = tokenData.sub;
    return await this.usersManagerService.changeProfile(
      userId,
      firstName,
      lastName,
      new Date(birthDate),
      interests
    );
  }
}
