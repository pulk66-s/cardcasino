import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UserModule } from './components/user/user.module';
import { CardModule } from './components/card/card.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { cpus } from 'os';
import { GameModule } from './components/game/game.module';


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('PSQL_HOST'),
                port: +configService.get('PSQL_PORT'),
                username: configService.get('PSQL_USERNAME'),
                password: configService.get('PSQL_PASSWORD'),
                database: configService.get('PSQL_DATABASE'),
                entities: [join(__dirname, '**/*.entity{.ts,.js}')],
                synchronize: configService.get('PSQL_SYNC') === 'true',
                useUTC: true,
                poolSize: cpus().length,
                maxQueryExecutionTime: 1000,
                logging: false,
                // logNotifications: true,
                charset: 'UTF8',
            }),
            inject: [ConfigService],
        }),
        UserModule,
        CardModule,
        GameModule
    ],
})
export class AppModule { }
