import { Module } from '@nestjs/common';

import * as Modules from './modules';

@Module({
	imports: [...Object.values(Modules)],
})
export class AppModule {}
