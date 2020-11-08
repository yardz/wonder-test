import { ApiProperty } from '@nestjs/swagger';

export class Message {
	@ApiProperty({
		description: 'message id',
		example: '21ae22be-894a-4c03-bcea-288fc5d2b1f8',
	})
	id: string;

	@ApiProperty({
		description: 'message',
		type: 'json',
		example: { arg01: 'arg example 01', param02: 1, param03: { inside01: 'inside 01', inside02: 1.3 } },
	})
	// eslint-disable-next-line @typescript-eslint/ban-types
	message: object;
}
