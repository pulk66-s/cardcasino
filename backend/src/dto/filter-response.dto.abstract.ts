export abstract class AbstractFilterResponseDto<T> {
    abstract count: number;
    abstract data: T[];
}
