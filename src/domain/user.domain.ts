import { ApiProperty } from '@nestjs/swagger';

export class User {
	@ApiProperty({
		description: 'user id',
		example: 'd07caaa2-2170-11eb-adc1-0242ac120002',
	})
	id: string;

	@ApiProperty({
		description: "user's name",
		example: 'Producer 01',
	})
	name: string;

	@ApiProperty({
		description: "user's role",
		example: 'producer',
		enum: ['producer', 'consumer', 'producer-and-consumer'],
	})
	role: 'producer' | 'consumer' | 'producer-and-consumer';
}
