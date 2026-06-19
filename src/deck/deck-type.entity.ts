import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Deck } from './deck.entity';
import { Type } from '../type/type.entity';

@Entity('deck_type')
export class DeckType {
  @PrimaryGeneratedColumn('increment')
  deck_type_id!: bigint;

  @Column('varchar', { length: 100, name: 'deck_id' })
  deck_id!: string;

  @Column('int', { name: 'type_id' })
  type_id!: number;

  @ManyToOne(() => Deck, (deck) => deck.deckTypes)
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @ManyToOne(() => Type)
  @JoinColumn({ name: 'type_id' })
  type!: Type;
}
