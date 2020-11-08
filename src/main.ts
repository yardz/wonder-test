/* eslint-disable @typescript-eslint/no-var-requires */
require('module-alias/register');
require('dotenv').config();

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { bootstrap } from './bootstrap';

// tslint:disable-next-line: no-floating-promises
bootstrap().then(app => {
	const options = new DocumentBuilder().addBearerAuth().setTitle('WonderQ').setDescription('Wonder - TEST').setVersion('1.0').build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	// tslint:disable-next-line: no-floating-promises
	app.listen(3000);
});
