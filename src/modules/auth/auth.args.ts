import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Login {
	@ApiProperty({
		description: 'id for user producer and/or consumer',
		example: 'd07caaa2-2170-11eb-adc1-0242ac120002',
	})
	@IsNotEmpty()
	@IsString()
	id: string;

	@ApiProperty({
		description: 'password for user',
		minLength: 6,
		example: '123456',
	})
	@IsNotEmpty()
	@MinLength(6)
	password: string;
}
