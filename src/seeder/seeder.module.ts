import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Supertype } from '../supertype/supertype.entity';
import { Rarity } from '../rarity/rarity.entity';
import { Type } from '../type/type.entity';
import { Legality } from '../legality/legality.entity';
import { Set } from '../sets/set.entity';
import { Card } from '../cards/card.entity';
import { Subtype } from '../subtype/subtype.entity';
import { CardType } from '../card-type/card-type.entity';
import { PokedexCard } from '../pokedex-card/pokedex-card.entity';
import { TcgPlayer } from '../tcg-player/tcg-player.entity';
import { Deck } from '../deck/deck.entity';
import { DeckType } from '../deck/deck-type.entity';
import { DeckCard } from '../deck/deck-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supertype,
      Rarity,
      Type,
      Legality,
      Set,
      Card,
      Subtype,
      CardType,
      PokedexCard,
      TcgPlayer,
      Deck,
      DeckType,
      DeckCard,
    ]),
  ],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
