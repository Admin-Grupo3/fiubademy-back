import { SetMetadata } from '@nestjs/common';

export const RolesAccess = (...roles: string[]) => SetMetadata('roles', roles);
