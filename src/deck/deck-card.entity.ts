import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Deck } from './deck.entity';
import { Card } from '../cards/card.entity';

@Entity('deck_card')
export class DeckCard {
  @PrimaryGeneratedColumn('increment')
  deck_card_id!: bigint;

  @Column('varchar', { length: 100, name: 'deck_id' })
  deck_id!: string;

  @Column('varchar', { length: 50, name: 'card_id' })
  card_id!: string;

  @Column('int')
  count!: number;

  @ManyToOne(() => Deck, (deck) => deck.deckCards)
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @ManyToOne(() => Card)
  @JoinColumn({ name: 'card_id' })
  card!: Card;
}
