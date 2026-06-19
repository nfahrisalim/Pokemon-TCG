import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Card } from '../cards/card.entity';
import { Type } from '../type/type.entity';

@Entity('card_type')
export class CardType {
  @PrimaryGeneratedColumn('increment')
  card_type_id!: bigint;

  @Column('int', { nullable: true, name: 'type_id' })
  type_id!: number | null;

  @Column('varchar', { length: 50, name: 'card_id' })
  card_id!: string;

  @ManyToOne(() => Type, (type) => type.cardTypes, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type!: Type | null;

  @ManyToOne(() => Card, (card) => card.cardTypes)
  @JoinColumn({ name: 'card_id' })
  card!: Card;
}
