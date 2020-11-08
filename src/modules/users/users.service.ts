import { Injectable } from '@nestjs/common';

import { User } from '@domain/user.domain';

@Injectable()
export class UsersService {
	private readonly users: User[];
	constructor() {
		this.users = [
			{
				id: 'd07caaa2-2170-11eb-adc1-0242ac120002',
				name: 'Producer 01',
				role: 'producer',
			},
			{
				id: '40842db6-2171-11eb-adc1-0242ac120002',
				name: 'Producer 02',
				role: 'producer',
			},
			{
				id: '498d8dd0-2171-11eb-adc1-0242ac120002',
				name: 'Producer 03',
				role: 'producer',
			},
			{
				id: '505b490e-2171-11eb-adc1-0242ac120002',
				name: 'Consumer 01',
				role: 'consumer',
			},
			{
				id: '5a656e02-2171-11eb-adc1-0242ac120002',
				name: 'Consumer 02',
				role: 'consumer',
			},
			{
				id: '5ab67ae0-2171-11eb-adc1-0242ac120002',
				name: 'Consumer 03',
				role: 'consumer',
			},
			{
				id: 'ba848a20-81eb-4241-9410-60904e196676',
				name: 'Producer and Consumer 01',
				role: 'producer-and-consumer',
			},
			{
				id: 'e7f9e25e-5181-4e62-8fdd-b494f4837028',
				name: 'Producer and Consumer 02',
				role: 'producer-and-consumer',
			},
			{
				id: '570afa66-59f8-4187-ad47-a748263d53d5',
				name: 'Producer and Consumer 03',
				role: 'producer-and-consumer',
			},
		];
	}

	async find({ id }: { id: string }): Promise<User | undefined> {
		return this.users.find(user => user.id === id);
	}
}
