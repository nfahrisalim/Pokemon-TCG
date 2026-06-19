import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Card } from '../cards/card.entity';

@Entity('pokedex_card')
export class PokedexCard {
  @PrimaryColumn('varchar', { length: 50, name: 'card_id' })
  card_id!: string;

  @PrimaryColumn('int')
  pokedex_id!: number;

  @ManyToOne(() => Card, (card) => card.pokedexCards)
  @JoinColumn({ name: 'card_id' })
  card!: Card;
}
