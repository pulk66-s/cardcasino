import { EntityManager, EntityTarget } from 'typeorm';

export class Transaction<Entity> {
    updated: Entity[];
    created: Entity[];
    deleted: Entity[];

    constructor(transaction?: { updated?: Entity[]; created?: Entity[]; deleted?: Entity[] }) {
        this.updated = transaction?.updated || [];
        this.created = transaction?.created || [];
        this.deleted = transaction?.deleted || [];
    }

    public concat(transactions: Transaction<Entity>[]): void {
        this.updated.push(...transactions.map((transaction) => transaction.updated).flat());
        this.created.push(...transactions.map((transaction) => transaction.created).flat());
        this.deleted.push(...transactions.map((transaction) => transaction.deleted).flat());
    }

    public executeCreate(target: EntityTarget<Entity>, manager: EntityManager): Promise<Awaited<Entity>[]> {
        return Promise.all(this.created.map((created) => manager.save(target, created)));
    }

    public executeUpdate(target: EntityTarget<Entity>, manager: EntityManager): Promise<Awaited<Entity>[]> {
        return Promise.all(this.updated.map((updated) => manager.save(target, updated)));
    }

    public executeDelete(target: EntityTarget<Entity>, manager: EntityManager): Promise<Awaited<Entity>[]> {
        return Promise.all(this.deleted.map((deleted) => manager.softRemove(target, deleted)));
    }

    public async execute(target: EntityTarget<Entity>, manager: EntityManager): Promise<Entity[]> {
        return Promise.all([
            ...this.updated.map((updated) => manager.save(target, updated)),
            ...this.created.map((created) => manager.save(target, created)),
            ...this.deleted.map((deleted) => manager.softRemove(target, deleted)),
        ]);
    }

    public getEntities(): Entity[] {
        return [...this.updated, ...this.created, ...this.deleted];
    }
}
