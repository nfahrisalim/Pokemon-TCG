import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { CardType } from '../card-type/card-type.entity';

@Entity('type')
export class Type {
  @PrimaryColumn('int')
  type_id!: number;

  @Column('varchar', { length: 50 })
  type!: string;

  @OneToMany(() => CardType, (cardType) => cardType.type)
  cardTypes!: CardType[];
}
