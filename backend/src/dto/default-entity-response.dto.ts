import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DefaultEntityResponseDto {
    @Expose()
    uuid: string;

    @Expose()
    created_at: string;

    @Expose()
    updated_at: string;

    @Expose()
    deleted_at?: string;
}
