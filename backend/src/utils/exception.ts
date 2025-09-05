import { HttpException, HttpStatus } from '@nestjs/common';

export class Exception {
    constructor(
        public readonly status: HttpStatus,
        public readonly message: string[] = [],
    ) {}

    public toError(): Error {
        return new Error(`${HttpStatus[this.status].toLowerCase()}${this.message ? `: ${this.message}` : ''}`);
    }

    public toHttpException(): HttpException {
        return new HttpException(this.message, this.status);
    }
}
