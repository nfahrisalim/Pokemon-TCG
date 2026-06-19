import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { DeckType } from './deck-type.entity';
import { DeckCard } from './deck-card.entity';

@Entity('deck')
export class Deck {
  @PrimaryColumn('varchar', { length: 100 })
  deck_id!: string;

  @Column('varchar', { length: 200 })
  deck_name!: string;

  @OneToMany(() => DeckType, (deckType) => deckType.deck)
  deckTypes!: DeckType[];

  @OneToMany(() => DeckCard, (deckCard) => deckCard.deck)
  deckCards!: DeckCard[];
}
