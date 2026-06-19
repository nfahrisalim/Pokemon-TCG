import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Card } from '../cards/card.entity';

@Entity('tcg_player')
export class TcgPlayer {
  @PrimaryGeneratedColumn('increment')
  tcg_player_id!: bigint;

  @Column('varchar', { length: 200 })
  url!: string;

  @Column('varchar', { length: 50, name: 'card_id' })
  card_id!: string;

  @ManyToOne(() => Card, (card) => card.tcgPlayers)
  @JoinColumn({ name: 'card_id' })
  card!: Card;

  @Column('date')
  updated_at!: Date;

  @Column('varchar', { length: 200 })
  card_type!: string;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  low_price!: number | null;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  mid_price!: number | null;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  high_price!: number | null;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  market_price!: number | null;
}
