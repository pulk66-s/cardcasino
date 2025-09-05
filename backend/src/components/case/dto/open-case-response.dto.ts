export class OpenCaseResponseDto {
    success: boolean;
    cardReceived: string;
    newBalance: number;
    message: string;

    constructor(success: boolean, cardReceived: string, newBalance: number, message: string) {
        this.success = success;
        this.cardReceived = cardReceived;
        this.newBalance = newBalance;
        this.message = message;
    }
}
