import { ResponseProfile, ResponseVehicle } from '@madify-api/database';
import { APIPrefix, RedisCacheKey } from '@madify-api/utils/config';
import {
  Auth,
  Authorizer,
  MadifyAuthorize,
  MadifyAuthorizeAndClearCached,
  MadifyController,
} from '@madify-api/utils/decorator';
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateVehicleDto,
  GetProfileParams,
  GetVehicleListQuery,
  UpdateProfileDto,
} from './dto/user.dto';
import { UserService } from './service/user.abstract';

@MadifyController({ path: APIPrefix.USER })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck(): boolean {
    return true;
  }

  @Get(':accountId')
  @MadifyAuthorize(RedisCacheKey.USER)
  getProfile(
    @Auth() auth: Authorizer,
    @Param() { accountId }: GetProfileParams
  ): Promise<ResponseProfile> {
    auth.requestAccessForAccount(accountId);
    return this.userService.getProfile(accountId);
  }

  @Get('me')
  @MadifyAuthorize(RedisCacheKey.USER)
  getOwnerProfile(@Auth() auth: Authorizer): Promise<ResponseProfile> {
    return this.userService.getProfile(auth.account.id);
  }

  @Put(':accountId')
  @MadifyAuthorizeAndClearCached(RedisCacheKey.USER)
  updateProfile(
    @Auth() auth: Authorizer,
    @Param() { accountId }: GetProfileParams,
    @Body() body: UpdateProfileDto
  ): Promise<ResponseProfile> {
    auth.requestAccessForAccount(accountId);
    return this.userService.updateProfile(body, accountId);
  }

  @Post('vehicle')
  @MadifyAuthorizeAndClearCached(RedisCacheKey.VEHICLE)
  createVehicle(
    @Auth() { account }: Authorizer,
    @Body() body: CreateVehicleDto
  ): Promise<ResponseVehicle> {
    return this.userService.createVehicle(body, account.id);
  }

  @Get('vehicle/list')
  @MadifyAuthorize(RedisCacheKey.VEHICLE)
  listVehicle(
    @Auth() { account }: Authorizer,
    @Query() query: GetVehicleListQuery
  ) {
    return this.userService.listVehicle(query, account.id);
  }
}
