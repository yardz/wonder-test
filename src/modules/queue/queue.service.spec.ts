import { Message } from '@domain/message.domain';
import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';

describe('QueueService', () => {
	let service: QueueService;

	beforeEach(async () => {
		jest.resetAllMocks();
		jest.useFakeTimers();
		jest.clearAllTimers();

		const module: TestingModule = await Test.createTestingModule({
			providers: [QueueService],
		}).compile();

		service = module.get<QueueService>(QueueService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('add new messages to queue', () => {
		const messages: (string | null)[] = [];
		for (let i = 1; i <= 10; i++) {
			const messageId = service.addMessage({ message: `test-message-${i}` });
			messages.push(messageId);
		}
		expect(messages.length).toBe(10);
		expect(messages.filter(m => !m).length).toBe(0);
	});

	it('If the message is empty, do not add it to the queue', () => {
		const messageId = service.addMessage({});
		expect(messageId).toBeNull();
	});

	it('return an empty array if the queue is empty', () => {
		const messages = service.startProcess({ uid: '1', receive: 10 });
		expect(messages.length).toBe(0);
	});

	it('returns only the number of messages requested', () => {
		for (let i = 1; i <= 10; i++) {
			service.addMessage({ message: `test-message-${i}` });
		}
		const messages = service.startProcess({ uid: '1', receive: 3 });
		expect(messages.length).toBe(3);
	});

	it("If you don't have enough messages, return as much as possible", () => {
		for (let i = 1; i <= 10; i++) {
			service.addMessage({ message: `test-message-${i}` });
		}
		const messages = service.startProcess({ uid: '1', receive: 30 });
		expect(messages.length).toBe(10);
	});

	it('must not return the same message for two different requests', async () => {
		const n = 2;
		const requestAsPromise = (uid: string, receive: number) =>
			new Promise<Message[]>(resolve => {
				resolve(service.startProcess({ uid, receive }));
			});
		for (let i = 1; i <= n; i++) {
			service.addMessage({ message: `test-message-${i}` });
		}

		const [req1, req2, req3] = await Promise.all([requestAsPromise('1', 1), requestAsPromise('2', 1), requestAsPromise('3', 1)]);
		expect(req1.length).toBe(1);
		expect(req2.length).toBe(1);
		expect(req3.length).toBe(0);
		expect(req1[0].id).not.toEqual(req2[0].id);
	});

	it('if the message is not processed in the correct time, it must go back to the queue', () => {
		service.addMessage({ message: `message` });
		expect(setTimeout).toHaveBeenCalledTimes(0);
		const messages1 = service.startProcess({ uid: '1', receive: 1 });
		expect(messages1.length).toBe(1);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
		expect(service.startProcess({ uid: '1', receive: 1 }).length).toBe(0);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		jest.advanceTimersByTime(2000);
		const messages2 = service.startProcess({ uid: '1', receive: 1 });
		expect(messages2.length).toBe(1);
		expect(messages1).toEqual(messages2);
	});

	it('if the message was processed, it does not go back to the queue', () => {
		service.addMessage({ message: `message` });
		const messages1 = service.startProcess({ uid: '1', receive: 1 });
		expect(messages1.length).toBe(1);
		service.finishProcess({ uid: '1', messageId: messages1[0].id });
		jest.advanceTimersByTime(2000);
		expect(service.startProcess({ uid: '1', receive: 1 }).length).toBe(0);
	});

	it('the message cannot be processed by a different user', () => {
		service.addMessage({ message: `message 1` });
		service.addMessage({ message: `message 2` });
		const msgListUser1 = service.startProcess({ uid: '1', receive: 1 });
		const msgListUser2 = service.startProcess({ uid: '2', receive: 1 });
		expect(msgListUser1.length).toBe(1);
		expect(msgListUser2.length).toBe(1);
		expect(service.finishProcess({ uid: '1', messageId: msgListUser1[0].id })).toBeTruthy();
		expect(service.finishProcess({ uid: '1', messageId: msgListUser2[0].id })).toBeFalsy();
	});
});
