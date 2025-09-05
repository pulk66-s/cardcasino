import { DefaultEntity } from "src/common/entities/default.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { GameEntity } from "./game.entity";
import { UserEntity } from "../user/user.entity";

export enum GameInstanceStatus {
    START = "start",
    WAITING = "waiting",
    ENDED = "ended"
}

@Entity("game_instance")
export class GameInstanceEntity extends DefaultEntity {
    @ManyToOne(() => GameEntity, game => game.instances, {nullable:false})
    game: GameEntity

    @ManyToMany(() => UserEntity, user => user.game_instances, { cascade: true })
    @JoinTable()
    users: UserEntity[]

    @Column({ type: "enum", enum: GameInstanceStatus })
    status: GameInstanceStatus = GameInstanceStatus.WAITING;

    @Column()
    gameid: number;
}
