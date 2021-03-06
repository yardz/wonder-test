import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { RolesGuard } from './roles.guard';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.user;
});

export const Uid = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.user.id;
});

export function Auth(...roles: string[]) {
	return applyDecorators(
		UseGuards(AuthGuard('jwt')),
		SetMetadata('roles', roles),
		UseGuards(RolesGuard),
		ApiBearerAuth(),
		ApiUnauthorizedResponse({ description: 'Unauthorized - invalid bearer token' }),
		ApiForbiddenResponse({ description: 'Forbidden - you do not have the necessary role for this action' }),
	);
}
