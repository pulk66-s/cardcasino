import { DefaultEntity } from "src/common/entities/default.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { GameInstanceEntity } from "./game-instance.entity";

@Entity("game")
export class GameEntity extends DefaultEntity {
    @OneToMany(() => GameInstanceEntity, instance => instance.game)
    instances: GameInstanceEntity[];

    @Column()
    name: string;

    @Column()
    min_players: number

    @Column()
    max_players: number
}