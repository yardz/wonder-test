import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@domain/message.domain';
import { isEmpty } from '@utils/isEmpty';

const timeLimit = Number(process.env.PROCESSING_TIMEOUT) || 1;

@Injectable()
export class QueueService {
	private readonly messagesQueue: Message[];

	private readonly processingQueue: {
		[key: string]: {
			timeout: NodeJS.Timeout;
			message: Message;
		};
	};

	constructor() {
		this.processingQueue = {};
		this.messagesQueue = [];
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	addMessage(message: object) {
		if (isEmpty(message)) {
			return null;
		}
		const id = uuidv4();
		const item: Message = {
			id,
			message,
		};
		this.messagesQueue.push(item);
		return id;
	}

	startProcess({ uid, receive }: { uid: string; receive: number }) {
		const messages = this.messagesQueue.splice(0, receive);
		this.addProcessingQueue({ uid, messages });

		return messages;
	}

	finishProcess(args: { uid: string; messageId: string }) {
		return this.removeProcessing(args);
	}

	private addProcessingQueue({ uid, messages }: { uid: string; messages: Message[] }) {
		messages.reverse().forEach(message => {
			const key = `${uid}--${message.id}`;
			const timeout = setTimeout(() => {
				this.cancelProcessing({ uid, messageId: message.id });
			}, timeLimit * 1000);
			this.processingQueue[key] = {
				timeout,
				message,
			};
		});
	}

	private cancelProcessing(hash: { uid: string; messageId: string }) {
		const message = this.removeProcessing(hash);
		if (message) {
			this.messagesQueue.unshift(message);
		}
	}

	private removeProcessing({ uid, messageId }: { uid: string; messageId: string }) {
		const key = `${uid}--${messageId}`;
		const item = this.processingQueue[key];

		if (item) {
			clearTimeout(item.timeout);
			delete this.processingQueue[key];
			return item.message;
		}
	}
}
