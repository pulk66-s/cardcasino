import { HttpStatus, Logger } from '@nestjs/common';
import { Err, Ok, Result } from 'oxide.ts';
import { Exception } from 'src/utils/exception';
import { Transaction } from 'src/utils/transaction';
import { DataSource, EntityTarget, QueryRunner } from 'typeorm';

export abstract class DefaultService {
    protected readonly logger: Logger;

    constructor(protected readonly name: string) {
        this.logger = new Logger(this.name);
    }

    protected async commitTransactions(
        dataSource: DataSource,
        transactions: [Transaction<any>, EntityTarget<any>][],
    ): Promise<Result<void, Exception>> {
        const queryRunner: QueryRunner = dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const startDate = new Date();

            this.logger.debug('Starting');
            for (const [transaction, entity] of transactions) {
                await transaction.execute(entity, queryRunner.manager);
            }

            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return Ok(undefined);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }
}
