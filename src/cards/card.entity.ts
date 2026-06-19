import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Set } from '../sets/set.entity';
import { Rarity } from '../rarity/rarity.entity';
import { Supertype } from '../supertype/supertype.entity';
import { TcgPlayer } from '../tcg-player/tcg-player.entity';
import { PokedexCard } from '../pokedex-card/pokedex-card.entity';
import { Subtype } from '../subtype/subtype.entity';
import { CardType } from '../card-type/card-type.entity';

@Entity('card')
export class Card {
  @PrimaryColumn('varchar', { length: 50 })
  card_id!: string;

  @Column('varchar', { length: 100 })
  card_name!: string;

  @Column('varchar', { length: 50 })
  number!: string;

  @Column('varchar', { length: 100, nullable: true })
  artist!: string | null;

  @Column('varchar', { length: 200 })
  small_img!: string;

  @Column('varchar', { length: 200 })
  large_img!: string;

  @Column('int', { nullable: true })
  hp!: number | null;

  @Column('varchar', { length: 500, nullable: true })
  flavor_text!: string | null;

  @Column('varchar', { length: 100, name: 'set_id' })
  set_id!: string;

  @ManyToOne(() => Set, (set) => set.cards)
  @JoinColumn({ name: 'set_id' })
  set!: Set;

  @Column('int', { nullable: true, name: 'rarity_id' })
  rarity_id!: number | null;

  @ManyToOne(() => Rarity, (rarity) => rarity.cards, { nullable: true })
  @JoinColumn({ name: 'rarity_id' })
  rarity!: Rarity | null;

  @Column('int', { name: 'supertype_id' })
  supertype_id!: number;

  @ManyToOne(() => Supertype, (supertype) => supertype.cards)
  @JoinColumn({ name: 'supertype_id' })
  supertype!: Supertype;

  @OneToMany(() => TcgPlayer, (tcgPlayer) => tcgPlayer.card)
  tcgPlayers!: TcgPlayer[];

  @OneToMany(() => PokedexCard, (pokedexCard) => pokedexCard.card)
  pokedexCards!: PokedexCard[];

  @OneToMany(() => Subtype, (subtype) => subtype.card)
  subtypes!: Subtype[];

  @OneToMany(() => CardType, (cardType) => cardType.card)
  cardTypes!: CardType[];
}