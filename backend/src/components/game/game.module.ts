import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "./game.entity";
import { GameInstanceEntity } from "./game-instance.entity";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, GameInstanceEntity])],
    providers: [GameService, GameGateway],
    controllers: [GameController]
})
export class GameModule {}