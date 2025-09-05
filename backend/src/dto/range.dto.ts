import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Between, FindOperator, LessThan, MoreThan } from 'typeorm';

export interface RangeRequestDto<T> {
    min?: T;
    max?: T;
}

export function rangeToTypeorm<T>(dto: RangeRequestDto<T>): FindOperator<T> {
    if (dto.min && dto.max) return Between(dto.min, dto.max);
    if (dto.min) return MoreThan(dto.min);
    return LessThan(dto.max) as any;
}

export class TimestampRequestDto implements RangeRequestDto<Date> {
    @IsOptional()
    @IsDate()
    min?: Date;

    @IsOptional()
    @IsDate()
    max?: Date;
}

export class NumberRangeRequestDto implements RangeRequestDto<number> {
    @IsOptional()
    @IsNumber()
    min?: number;

    @IsOptional()
    @IsNumber()
    max?: number;
}
