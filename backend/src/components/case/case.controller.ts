import { Controller, Get, Post, Body, Request, UseGuards, HttpStatus } from '@nestjs/common';
import { CaseService } from './case.service';
import { OpenCaseRequestDto } from './dto/open-case-request.dto';
import { OpenCaseResponseDto } from './dto/open-case-response.dto';
import { CaseResponseDto } from './dto/case-response.dto';
import { CreateCaseRequestDto } from './dto/create-case-request.dto';
import { AuthGuard } from '../game/auth.guard';
import { Exception } from 'src/utils/exception';

@Controller('cases')
export class CaseController {
    constructor(private readonly caseService: CaseService) {}

    @Get()
    async getAllCases() {
        const result = await this.caseService.getAllCases();
        
        if (result.isErr()) {
            throw result.unwrapErr();
        }
        
        return result.unwrap();
    }

    @Post('open')
    @UseGuards(AuthGuard)
    async openCase(@Body() openCaseDto: OpenCaseRequestDto, @Request() req) {
        const user = req.user;
        
        if (!user) {
            throw new Exception(HttpStatus.UNAUTHORIZED, ['User not authenticated']);
        }

        const result = await this.caseService.openCase(openCaseDto.caseUuid, user);
        
        if (result.isErr()) {
            throw result.unwrapErr();
        }
        
        return result.unwrap();
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async createCase(@Body() createCaseDto: CreateCaseRequestDto, @Request() req) {
        const user = req.user;
        
        if (!user || user.rights !== 'ADMIN') {
            throw new Exception(HttpStatus.FORBIDDEN, ['Admin rights required']);
        }

        const result = await this.caseService.createCase(
            createCaseDto.name,
            createCaseDto.description,
            createCaseDto.price,
            createCaseDto.rarity,
            createCaseDto.possibleCards,
            createCaseDto.cardWeights
        );
        
        if (result.isErr()) {
            throw result.unwrapErr();
        }
        
        return result.unwrap();
    }
}
