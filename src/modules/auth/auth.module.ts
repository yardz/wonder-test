import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@modules/users/users.module';

import { AuthStrategy } from './auth.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		UsersModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'SECRET',
			signOptions: { expiresIn: `${process.env.JWT_EXPIRES || 60}s` },
		}),
	],
	providers: [AuthService, AuthStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
