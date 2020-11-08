import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post } from '@nestjs/common';
import { Auth, Uid } from '@utils/decorators';
import { ApiCreatedResponse, ApiAcceptedResponse, ApiNoContentResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { Message } from '@domain/message.domain';

import { QueueService } from './queue.service';

import * as ARGS from './queue.args';
import { isEmpty } from '@utils/isEmpty';

@Controller('queue')
export class QueueController {
	constructor(private readonly queueService: QueueService) {}

	@ApiCreatedResponse({ description: 'message id on queue', type: String })
	@Auth('producer', 'producer-and-consumer')
	@Post('/send')
	send(@Body() { message }: ARGS.Send) {
		if (isEmpty(message)) {
			throw new BadRequestException('the message cannot be empty');
		}
		const messageId = this.queueService.addMessage(message);
		if (messageId) {
			return { messageId };
		}
	}

	@ApiAcceptedResponse({ description: 'message id on queue', type: Message, isArray: true })
	@Auth('consumer', 'producer-and-consumer')
	@Post('/process')
	@HttpCode(202)
	startProcess(@Body() { receive }: ARGS.Process, @Uid() uid: string) {
		const messages = this.queueService.startProcess({ uid, receive });
		return messages;
	}

	@Auth('consumer', 'producer-and-consumer')
	@Post('/processed')
	@ApiNoContentResponse({ description: 'Message successfully processed' })
	@ApiNotFoundResponse({ description: 'NotFound - This message is not available to be processed by this user' })
	@HttpCode(204)
	finishProcess(@Body() { messageId }: ARGS.Processed, @Uid() uid: string) {
		const message = this.queueService.finishProcess({ uid, messageId });
		if (!message) {
			throw new NotFoundException('this message is not assigned to this user');
		}
	}
}
