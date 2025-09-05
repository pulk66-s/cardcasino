import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GameService } from './game.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@Injectable()
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(@Inject(forwardRef(() => GameService)) private readonly gameService: GameService) { }

    // Example: Send a message to all clients
    sendEvent(event: string, payload: any) {
        this.server.emit(event, payload);
    }
}
