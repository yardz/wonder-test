import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrap } from './../src/bootstrap';

jest.useFakeTimers();

const producerId = 'd07caaa2-2170-11eb-adc1-0242ac120002';
const consumerId = '5a656e02-2171-11eb-adc1-0242ac120002';

describe('Users (e2e)', () => {
	let app: INestApplication;
	let tokenProducer: string;
	let tokenConsumer: string;

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
	});

	it('/users/me (producer)', () => {
		return request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', 'bearer ' + tokenProducer)
			.expect(200)
			.expect({ id: 'd07caaa2-2170-11eb-adc1-0242ac120002', name: 'Producer 01', role: 'producer' });
	});

	it('/users/me (consumer)', () => {
		return request(app.getHttpServer())
			.get('/users/me')
			.set('Authorization', 'bearer ' + tokenConsumer)
			.expect(200)
			.expect({ id: '5a656e02-2171-11eb-adc1-0242ac120002', name: 'Consumer 02', role: 'consumer' });
	});
});
