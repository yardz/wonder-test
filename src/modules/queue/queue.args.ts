import { IsInt, IsNotEmpty, IsNumber, IsObject, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Send {
	@ApiProperty({
		description: 'message that will be inserted in the queue',
		type: 'json',
		example: { arg01: 'arg example 01', param02: 1, param03: { inside01: 'inside 01', inside02: 1.3 } },
	})
	@IsObject()
	// eslint-disable-next-line @typescript-eslint/ban-types
	message: object;
}

export class Process {
	@ApiProperty({
		description: 'number of messages to process',
		minimum: 1,
		example: 10,
	})
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@IsInt()
	receive: number;
}

export class Processed {
	@ApiProperty({
		description: 'id of message to mark as processed',
		example: '21ae22be-894a-4c03-bcea-288fc5d2b1f8',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	messageId: string;
}
