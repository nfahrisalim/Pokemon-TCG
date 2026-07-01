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
import { Deck } from './deck/deck.entity';
import { DeckType } from './deck/deck-type.entity';
import { DeckCard } from './deck/deck-card.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SetsModule } from './sets/sets.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'poke_admin.db',
      entities: [Set, Card, Legality, Rarity, Supertype, Type, TcgPlayer, PokedexCard, Subtype, CardType, Deck, DeckType, DeckCard],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    SetsModule,
    CardsModule,
    AuthModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}