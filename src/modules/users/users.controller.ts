import { Controller, Get } from '@nestjs/common';

import { ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

import { User, Auth } from '@utils/decorators';
import { User as IUser } from '@domain/user.domain';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Auth('producer', 'consumer', 'producer-and-consumer')
	@Get('/me')
	@ApiOkResponse({ description: 'Current User', type: IUser })
	async me(@User() user: IUser) {
		return this.usersService.find({ id: user.id });
	}
}
