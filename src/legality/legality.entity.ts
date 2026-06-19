import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Set } from '../sets/set.entity';

@Entity('legality')
export class Legality {
  @PrimaryGeneratedColumn('increment')
  legality_id!: bigint;

  @Column({ type: 'boolean', nullable: true })
  unlimited!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  standard!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  expanded!: boolean | null;

  @OneToMany(() => Set, (set) => set.legality)
  sets!: Set[];
}
