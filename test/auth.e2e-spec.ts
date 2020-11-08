import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrap } from './../src/bootstrap';

const producerId = 'd07caaa2-2170-11eb-adc1-0242ac120002';
const consumerId = '5a656e02-2171-11eb-adc1-0242ac120002';

describe('Auth (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		app = await bootstrap();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('login producer', () => {
		return request(app.getHttpServer())
			.post('/auth')
			.send({ id: producerId, password: '123456' })
			.expect(200)
			.then(response => {
				expect(response.text).toStrictEqual(expect.any(String));
				expect(response.text).toBeTruthy();
			});
	});

	it('login consumer', () => {
		return request(app.getHttpServer())
			.post('/auth')
			.send({ id: consumerId, password: '123456' })
			.expect(200)
			.then(response => {
				expect(response.text).toStrictEqual(expect.any(String));
				expect(response.text).toBeTruthy();
			});
	});
});
