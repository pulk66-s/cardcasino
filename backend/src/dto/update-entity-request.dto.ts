export type UpdateEntityRequestDto<T> = Omit<T, 'uuid' | 'created_at' | 'updated_at' | 'deleted_at'>;
