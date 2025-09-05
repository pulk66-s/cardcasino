import { Body, Controller, Get, Injectable, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { DefaultService } from "src/common/services/default-log.service";
import { GameService } from "./game.service";

@Controller("games")
export class GameController {
    public constructor(
        private gameService: GameService
    ) {
    }

    @Post('new')
    @UseGuards(AuthGuard)
    public async newGame(
        @Body('name') name: string,
        @Request() req: any
    ) {
        // user is attached by AuthGuard
        const user = req.user;
        return this.gameService.newGame(name, user);
    }

    @Post('join')
    @UseGuards(AuthGuard)
    public async joinGame(
        @Body('gameid') gameId: number,
        @Request() req: any
    ) {
        // user is attached by AuthGuard
        const user = req.user;
        return this.gameService.joinGame(gameId, user);
    }

    @Post("start")
    @UseGuards(AuthGuard)
    public async startGame(
        @Body('gameid') gameId: number,
    ) {
        return this.gameService.start(gameId);
    }

    @Post("players")
    @UseGuards(AuthGuard)
    public async listPlayers(
        @Body('gameid') gameId: number,
    ) {
        return this.gameService.players(gameId);
    }

    @Get()
    public async listGame() {
        return this.gameService.list();
    }

    @Get("current")
    @UseGuards(AuthGuard)
    public async currentGame(
        @Request() req: any
    ) {
        return this.gameService.currentGame(req.user)
    }
}
