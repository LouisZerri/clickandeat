import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class CustomParseIntPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): number {
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new BadRequestException('Ressource non trouvé');
        }
        return val;
    }
}
