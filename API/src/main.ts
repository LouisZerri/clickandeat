import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('ClickAndEat API')
		.setDescription('Documentation pour l\'API Click & Eat')
		.setVersion('1.0')
		.addTag('clickandeat')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.enableCors({
		origin: 'http://localhost:5173', // autorise uniquement ton front Vite
		credentials: true,
	  });

	await app.listen(3000);
}
bootstrap();
