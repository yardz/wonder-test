// tslint:disable: max-file-line-count

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrap } from './../src/bootstrap';

jest.useFakeTimers();

const producerId = 'd07caaa2-2170-11eb-adc1-0242ac120002';
const consumerId = '5a656e02-2171-11eb-adc1-0242ac120002';

describe('Queue (e2e)', () => {
	let app: INestApplication;
	let tokenProducer: string;
	let tokenConsumer: string;

	// eslint-disable-next-line @typescript-eslint/ban-types
	const createMessage = (message: object) => {
		return request(app.getHttpServer())
			.post('/queue/send')
			.set('Authorization', 'bearer ' + tokenProducer)
			.send({ message })
			.expect(201);
	};

	beforeAll(async () => {
		app = await bootstrap();
		await app.init();

		if (!tokenProducer) {
			const responseProducer = await request(app.getHttpServer()).post('/auth').send({ id: producerId, password: '123456' });
			tokenProducer = responseProducer.text;
		}
		if (!tokenConsumer) {
			const responseConsumer = await request(app.getHttpServer()).post('/auth').send({ id: consumerId, password: '123456' });
			tokenConsumer = responseConsumer.text;
		}

		await Promise.all([
			createMessage({ message: 'teste 01' }),
			createMessage({ message: 'teste 02' }),
			createMessage({ message: 'teste 03' }),
			createMessage({ message: 'teste 04' }),
			createMessage({ message: 'teste 05' }),
		]);
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		jest.advanceTimersByTime(2000);
	});

	it('producer sending message to the queue', () => {
		return request(app.getHttpServer())
			.post('/queue/send')
			.set('Authorization', 'bearer ' + tokenProducer)
			.send({ message: { message: 'teste 01' } })
			.expect(201)
			.then(response => {
				expect(response.body).toHaveProperty('messageId');
				expect(response.body.messageId).toBeTruthy();
				expect(response.body.messageId).toEqual(expect.any(String));
			});
	});

	it('producer sending invalid message to the queue', () => {
		return request(app.getHttpServer())
			.post('/queue/send')
			.set('Authorization', 'bearer ' + tokenProducer)
			.send({ message: {} })
			.expect(400);
	});

	it('consumer sending message to the queue', () => {
		return request(app.getHttpServer())
			.post('/queue/send')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ message: { message: 'teste 01' } })
			.expect(403);
	});

	it('producer receiving message to process', async () => {
		return request(app.getHttpServer())
			.post('/queue/process')
			.set('Authorization', 'bearer ' + tokenProducer)
			.send({ receive: 1 })
			.expect(403);
	});

	it('consumer requesting messages from the queue', async () => {
		return request(app.getHttpServer())
			.post('/queue/process')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ receive: 2 })
			.expect(202)
			.then(response => {
				expect(response.body.length).toBe(2);
				expect(response.body[0]).toHaveProperty('id');
				expect(response.body[0]).toHaveProperty('message');
				expect(response.body[0].id).toBeTruthy();
				expect(response.body[0].message).toBeTruthy();
			});
	});

	it('consumer processing messages from the queue', async () => {
		const resp = await request(app.getHttpServer())
			.post('/queue/process')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ receive: 1 })
			.expect(202);
		return request(app.getHttpServer())
			.post('/queue/processed')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ messageId: resp.body[0].id })
			.expect(204);
	});

	it('another consumer processing messages from the queue', async () => {
		const token = await request(app.getHttpServer()).post('/auth').send({ id: 'ba848a20-81eb-4241-9410-60904e196676', password: '123456' });
		const resp = await request(app.getHttpServer())
			.post('/queue/process')
			.set('Authorization', 'bearer ' + token.text)
			.send({ receive: 1 })
			.expect(202);
		return request(app.getHttpServer())
			.post('/queue/processed')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ messageId: resp.body[0].id })
			.expect(404);
	});

	it('unprocessed messages returning to the queue', async () => {
		const respAll = await request(app.getHttpServer())
			.post('/queue/process')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ receive: 1000 })
			.expect(202);
		const respEmpty = await request(app.getHttpServer())
			.post('/queue/process')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ receive: 1000 })
			.expect(202);

		expect(respAll.body.length).toBeGreaterThan(0);
		expect(respEmpty.body.length).toBe(0);

		// pass time / return itens to queue
		jest.advanceTimersByTime(3600 * 1000);

		const respFinal = await request(app.getHttpServer())
			.post('/queue/process')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.send({ receive: 1000 })
			.expect(202);
		expect(respFinal.body.length).toEqual(respAll.body.length);
	});
});
