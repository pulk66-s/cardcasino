import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum OrderEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

export abstract class AbstractFilterRequestDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    size: number = 10;

    @IsOptional()
    @IsInt()
    @Min(0)
    page: number = 0;

    @IsOptional()
    @IsEnum(OrderEnum)
    order: OrderEnum = OrderEnum.DESC;

    abstract order_column: string;
}
