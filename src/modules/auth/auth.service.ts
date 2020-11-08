import { UsersService } from '@modules/users/users.service';

import { JwtService } from '@nestjs/jwt';

import { Injectable } from '@nestjs/common';
import { User } from '@domain/user.domain';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

	async validateUser({ id, password }: { id: string; password: string }) {
		const user = await this.usersService.find({ id });
		if (!user || password !== '123456') {
			return null;
		}
		return user;
	}

	login(user: User) {
		return this.jwtService.sign(user);
	}
}
