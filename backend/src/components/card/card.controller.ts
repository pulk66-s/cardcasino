import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('cards')
export class CardController {
    constructor(private readonly cardService: CardService) { }
}
