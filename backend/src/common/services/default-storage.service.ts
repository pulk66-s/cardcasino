import { HttpStatus } from '@nestjs/common';

import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { AbstractFilterRequestDto } from 'src/dto/filter-request.dto.abstract';
import { Exception } from 'src/utils/exception';
import { FindManyOptions, ObjectLiteral, Repository, SaveOptions, SelectQueryBuilder } from 'typeorm';
import { DefaultService } from './default-log.service';

/**
 * Default Storage service it'll take an entity as template
 * and provides some default methods
 */
export class DefaultStorageService<T extends ObjectLiteral> extends DefaultService {
    constructor(
        public readonly name: string,
        public readonly repository: Repository<T>,
    ) {
        super(name);
    }

    /**
     * @brief         Find many entities in the database
     * @param options The options to find the entities
     * @returns       The found entities
     */
    public async findMany(options: FindManyOptions<T>): Promise<Result<T[], Exception>> {
        try {
            this.logger.debug(`Finding many ${this.name} with options: ${JSON.stringify(options)}`);

            const startDate = new Date();
            const result: T[] = await this.repository.find(options);
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Found ${result.length} ${this.name}: ${JSON.stringify(result)} in ${difference}ms`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to find many ${this.name}: ${err as string}`);
            this.logger.error(`options: ${JSON.stringify(options)}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief           Find many entities in the database and count them
     * @param options   The options to find the entities
     * @returns         The found entities and the count
     */
    public async findManyAndCount(options: FindManyOptions<T>): Promise<Result<[T[], number], Exception>> {
        try {
            this.logger.debug(`Finding and couting many ${this.name} with options: ${JSON.stringify(options.where)}`);

            const startDate = new Date();
            const result: [T[], number] = await this.repository.findAndCount(options);
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Found and counted ${result[0].length} ${this.name}: ${JSON.stringify(result[0])}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to find and count many ${this.name}: ${err as string}`);
            this.logger.error(`options: ${JSON.stringify(options)}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief           Find one entity in the database
     * @param options   The options to find the entity
     * @returns         The found entity
     */
    public async findOne(options: FindManyOptions<T>): Promise<Result<Option<T>, Exception>> {
        try {
            this.logger.debug(`Finding one ${this.name} with options: ${JSON.stringify(options.where)}`);

            const startDate = new Date();
            const result: T | null = await this.repository.findOne(options);
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Found one ${this.name}: ${JSON.stringify(result)} in ${difference}ms`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result ? Some(result) : None);
        } catch (err: unknown) {
            this.logger.error(`Failed to find one ${this.name}: ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief           Count entities in the database
     * @param options   The options to count the entities
     * @returns         The count
     */
    public async count(options: FindManyOptions<T>): Promise<Result<number, Exception>> {
        try {
            this.logger.debug(`Counting ${this.name} with options: ${JSON.stringify(options.where)}`);

            const startDate = new Date();
            const result: number = await this.repository.count(options);
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Counted ${result} ${this.name}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to count ${this.name}: ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief           Save many entities in the database
     * @param entities  The entities to save
     * @returns         The saved entities
     */
    public async saveMany(entities: T[], options?: SaveOptions): Promise<Result<T[], Exception>> {
        try {
            this.logger.debug(`Saving many ${this.name}: (options: ${JSON.stringify(options)}) ${JSON.stringify(entities)}`);

            const startDate = new Date();
            const result: T[] = await this.repository.save(entities, options);
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Saved many ${this.name}: (options: ${JSON.stringify(options)}) ${JSON.stringify(result)}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to save many ${this.name}: ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief        Save one entity in the database
     * @param entity The entity to save
     * @returns      The saved entity
     */
    public async saveOne(entity: T, options?: SaveOptions): Promise<Result<T, Exception>> {
        try {
            this.logger.debug(`Saving one ${this.name}: (options: ${JSON.stringify(options)}) ${JSON.stringify(entity)}`);

            const startDate = new Date();
            const result: T = await this.repository.save(entity, options);
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Saved one ${this.name}: (options: ${JSON.stringify(options)}) ${JSON.stringify(result)}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to save one ${this.name}: ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief           Delete many entities in the database
     * @param entities  The entities to delete
     * @param force     Whether to force delete the entities
     *                  /!\ This parameter must be used only for testing purposes
     * @returns         The deleted entities
     */
    public async deleteMany(entities: T[], force?: boolean): Promise<Result<T[], Exception>> {
        try {
            this.logger.debug(`Deleting many ${this.name}: ${JSON.stringify(entities)}`);

            const startDate = new Date();
            let result: T[];

            if (force) {
                result = await this.repository.remove(entities);
            } else {
                result = await this.repository.softRemove(entities);
            }

            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Deleted many ${this.name}: ${JSON.stringify(entities)}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to delete many ${this.name}: ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief        Delete one entity in the database
     * @param entity The entity to delete
     * @returns      The deleted entity
     */
    public async deleteOne(entity: T, force: boolean = false, options?: SaveOptions): Promise<Result<T, Exception>> {
        try {
            this.logger.debug(`Deleting one ${this.name}: ${JSON.stringify(entity)}`);

            let result: T;
            const startDate = new Date();
            if (force) {
                result = await this.repository.remove(entity, options);
            } else {
                result = await this.repository.softRemove(entity, options);
            }
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Deleted one ${this.name}: ${JSON.stringify(entity)}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to delete one ${this.name}: ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief           Format filter request for the repository
     * @param dto       The filter request DTO
     * @returns         The formatted filter request
     */
    public formatFilterRequest(dto?: AbstractFilterRequestDto) {
        const options: FindManyOptions<T> = {};

        if (!dto) return options;

        if (dto.order_column) {
            options.order = { [dto.order_column]: dto.order } as any;
        }

        if (dto.size && (dto.page || dto.page === 0)) {
            options.skip = dto.size * dto.page;
            options.take = dto.size;
        }

        return options;
    }

    /**
     * @brief             Create a query builder for the entity
     * @param alias       The alias of the entity
     * @returns           The query builder
     */
    public createQueryBuilder(alias: string): SelectQueryBuilder<T> {
        this.logger.debug(`Creating query builder for ${this.name} with alias: "${alias}"`);
        return this.repository.createQueryBuilder(alias);
    }

    /**
     * @brief               Format filter request for the query builder
     * @param query_builder The query builder
     * @param dto           The filter request DTO
     * @returns             The formatted query builder
     */
    public formatFilterRequestQueryBuilder(query_builder: SelectQueryBuilder<T>, dto?: AbstractFilterRequestDto): SelectQueryBuilder<T> {
        if (!dto) return query_builder;

        if (dto.order_column) {
            const formatted_column = query_builder.alias + '.' + dto.order_column; // Ex: user.created_at

            query_builder.orderBy(formatted_column, dto.order);
        }

        if (dto.size && (dto.page || dto.page === 0)) {
            query_builder.skip(dto.size * dto.page);
            query_builder.take(dto.size);
        }

        return query_builder;
    }

    /**
     * @brief               Execute a query builder for many entities
     * @param query_builder The query builder
     * @returns             The result of the query builder
     */
    public async queryBuilderExecuteMany(query_builder: SelectQueryBuilder<T>): Promise<Result<T[], Exception>> {
        try {
            this.logger.debug(`Executing query builder for ${this.name} (many): ${query_builder.getQuery()}`);

            const startDate = new Date();
            const result: T[] = await query_builder.getMany();
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Executed query builder for ${this.name} (many): ${JSON.stringify(result)}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to execute query builder for ${this.name} (many): ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief               Execute a query builder for many entities and count them
     * @param query_builder The query builder
     * @returns             The result of the query builder
     */
    public async queryBuilderExecuteManyAndCount(query_builder: SelectQueryBuilder<T>): Promise<Result<[T[], number], Exception>> {
        try {
            this.logger.debug(`Executing query builder for ${this.name} (many and count): ${query_builder.getQuery()}`);

            const startDate = new Date();
            const result: [T[], number] = await query_builder.getManyAndCount();
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Executed query builder for ${this.name} (many and count): ${JSON.stringify(result)}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result);
        } catch (err: unknown) {
            this.logger.error(`Failed to execute query builder for ${this.name} (many and count): ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }

    /**
     * @brief               Execute a query builder for one entity
     * @param query_builder The query builder
     * @returns             The result of the query builder
     */
    public async queryBuilderExecuteOne(query_builder: SelectQueryBuilder<T>): Promise<Result<Option<T>, Exception>> {
        try {
            this.logger.debug(`Executing query builder for ${this.name} (one): ${query_builder.getQuery()}`);

            const startDate = new Date();
            const result: T | null = await query_builder.getOne();
            const endDate = new Date();
            const difference: number = endDate.getTime() - startDate.getTime();

            this.logger.debug(`Executed query builder for ${this.name} (one): ${JSON.stringify(result)}`);
            if (difference > 500) {
                this.logger.warn(`Request in ${this.name} service ran in ${difference}ms`);
            }

            return Ok(result ? Some(result) : None);
        } catch (err: unknown) {
            this.logger.error(`Failed to execute query builder for ${this.name} (one): ${err as string}`);
            return Err(new Exception(HttpStatus.INTERNAL_SERVER_ERROR, [err as string]));
        }
    }
}
