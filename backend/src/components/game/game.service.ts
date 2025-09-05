import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DefaultService } from "src/common/services/default-log.service";
import { IsNull, Not, Repository } from "typeorm";
import { GameEntity } from "./game.entity";
import { GameInstanceEntity, GameInstanceStatus } from "./game-instance.entity";
import { NotFoundError } from "rxjs";
import { GameGateway } from "./game.gateway";

@Injectable()
export class GameService extends DefaultService {
    private lastId: number = 1;

    public constructor(
        @InjectRepository(GameEntity) private gameRepo: Repository<GameEntity>,
        @InjectRepository(GameInstanceEntity) private gameInstanceRepo: Repository<GameInstanceEntity>,
        @Inject(forwardRef(() => GameGateway)) private gateway: GameGateway
    ) {
        super(GameService.name);
        this.gameInstanceRepo.findOne({
            where: {},
            order: {
                gameid: "DESC"
            },
        }).then(instance => this.lastId = instance?.gameid ?? 1);
    }

    private startCoinFlip(instance: GameInstanceEntity) {
        const player1Win = Math.random() >= 0.5
        const winner = instance.users[player1Win ? 0 : 1];
        const loser = instance.users[player1Win ? 1 : 0]
        this.gateway.sendEvent("end", {
            winner,
            loser
        })
    }

    private async startGame(instance: GameInstanceEntity) {
        switch (instance.game.name) {
            case "CoinFlip":
                return this.startCoinFlip(instance)
            default:
                throw new Error("Unknown game " + instance.game.name)
        }
    }

    public async start(gameid: number) {
        const instance = await this.gameInstanceRepo.findOne({
            where: {
                gameid
            },
            relations: { game: true, users: true }
        })
        const game = instance?.game
        if (!game)
            throw Error("Not found")
        if (instance.users.length < game.min_players || instance.users.length > game.max_players)
            throw new Error("Not the good amount of users")
        instance.status === GameInstanceStatus.START;
        this.startGame(instance);
        return this.gameInstanceRepo.save(instance);
    }

    public async newGame(name: string, user: any) {
        console.log(name)
        console.log(user)
        const game = await this.gameRepo.findOne({
            where: {
                name
            }
        });
        return this.gameInstanceRepo.save({
            ...new GameInstanceEntity(),
            users: [user],
            gameid: this.lastId++,
            game: game as any
        })
    }

    public async joinGame(gameid: number, user: any) {
        const instance = await this.gameInstanceRepo.findOne({
            where: { gameid },
            relations: { users: true }
        })
        if (!instance) {
            throw Error("Not found")
        }
        instance.users.push(user);
        return await this.gameInstanceRepo.save(instance)
    }

    public async list() {
        return this.gameRepo.find({
            where: {}
        })
    }

    public async players(gameid: number) {
        const instance = await this.gameInstanceRepo.findOne({
            where: {
                gameid
            },
            relations: { users: true }
        })
        return instance?.users.length
    }

    public async currentGame(user: any) {
        return this.gameInstanceRepo.find({
            where: {
                users: {
                    uuid: user.uuid
                },
            },
            relations: {
                game: true
            }
        })
    }
}