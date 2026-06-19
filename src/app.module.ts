import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from './sets/set.entity';
import { Card } from './cards/card.entity';
import { Legality } from './legality/legality.entity';
import { Rarity } from './rarity/rarity.entity';
import { Supertype } from './supertype/supertype.entity';
import { Type } from './type/type.entity';
import { TcgPlayer } from './tcg-player/tcg-player.entity';
import { PokedexCard } from './pokedex-card/pokedex-card.entity';
import { Subtype } from './subtype/subtype.entity';
import { CardType } from './card-type/card-type.entity';
import { SetsModule } from './sets/sets.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'poke_admin.db',
      entities: [Set, Card, Legality, Rarity, Supertype, Type, TcgPlayer, PokedexCard, Subtype, CardType],
      synchronize: true,
    }),
    SetsModule,
    CardsModule,
    AuthModule,
  ],
})
export class AppModule {}