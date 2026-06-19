import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Card } from '../cards/card.entity';
import { Legality } from '../legality/legality.entity';

@Entity('card_set')
export class Set {
  @PrimaryColumn('varchar', { length: 100 })
  set_id!: string;

  @Column('varchar', { length: 150 })
  set_name!: string;

  @Column('varchar', { length: 150 })
  series!: string;

  @Column('int')
  printed_total!: number;

  @Column('int')
  total!: number;

  @Column('varchar', { length: 50, nullable: true })
  ptcgo_code!: string | null;

  @Column('date')
  release_date!: Date;

  @Column('date')
  updated_at!: Date;

  @Column('varchar', { length: 200 })
  symbol_img!: string;

  @Column('varchar', { length: 200 })
  logo_img!: string;

  @Column('bigint', { name: 'legality_id' })
  legality_id!: bigint;

  @ManyToOne(() => Legality, (legality) => legality.sets)
  @JoinColumn({ name: 'legality_id' })
  legality!: Legality;

  @OneToMany(() => Card, (card) => card.set)
  cards!: Card[];
}