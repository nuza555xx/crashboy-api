import {
  AuthGuard,
  HttpCacheClearInterceptor,
  HttpCacheIndividualInterceptor,
  HttpCacheSharedWithQueryInterceptor,
} from '@madify-api/interceptor';
import { ICacheKey } from 'libs/interface/src';
import {
  CacheKey,
  CacheTTL,
  ExecutionContext,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { Account } from '@madify-api/database';
import { MadifyException } from '@madify-api/exception';
import { ApiBearerAuth, ApiHeaders } from '@nestjs/swagger';
import { AcceptPlatform } from '@madify-api/enum';

export const MadifyAuthorize = (cacheConfig: ICacheKey) => {
  return applyDecorators(
    ApiBearerAuth('JSON Web Token Authorization'),
    CacheKey(cacheConfig.name),
    CacheTTL(cacheConfig.ttl),
    UseInterceptors(HttpCacheIndividualInterceptor),
    UseGuards(AuthGuard)
  );
};

export function MadifyBasicAuthorize() {
  return applyDecorators(
    ApiBearerAuth('JSON Web Token Authorization'),
    UseGuards(AuthGuard)
  );
}

export function MadifyAuthorizeAndClearCached(cacheConfig: ICacheKey) {
  return applyDecorators(
    ApiBearerAuth('JSON Web Token Authorization'),
    CacheKey(cacheConfig.name),
    UseGuards(AuthGuard),
    UseInterceptors(HttpCacheClearInterceptor)
  );
}

export class Authorizer {
  constructor(public account: Account) {}

  requestAccessForAccount(accountId: any) {
    if (this.account.id === String(accountId)) return;

    throw new MadifyException('FORBIDDEN');
  }
}

export const Auth = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const account = await request.$account;
    return new Authorizer(account);
  }
);

export const MadifyCached = (cacheConfig: ICacheKey) => {
  return applyDecorators(
    CacheKey(cacheConfig.name),
    CacheTTL(cacheConfig.ttl),
    UseInterceptors(HttpCacheSharedWithQueryInterceptor)
  );
};

export const MadifySwaggerHeaderAuth = () => {
  return applyDecorators(
    ApiHeaders([
      {
        name: 'platform',
        description: 'This header is required',
        enum: AcceptPlatform,
        example: AcceptPlatform.Web,
        required: true,
      },
      {
        name: 'uuid',
        description: 'This header is required',
        example: 'uuid',
        required: true,
      },
    ])
  );
};
