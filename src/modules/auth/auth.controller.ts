import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import * as ARGS from './auth.args';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@HttpCode(200)
	@ApiOkResponse({ description: 'Authenticated user', type: String })
	@ApiUnauthorizedResponse({ description: 'User was not authenticated. Check id and password' })
	async login(@Body() login: ARGS.Login): Promise<string> {
		const user = await this.authService.validateUser(login);
		if (!user) {
			throw new UnauthorizedException();
		}
		return this.authService.login(user);
	}
}
