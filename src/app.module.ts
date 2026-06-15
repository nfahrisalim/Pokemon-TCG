import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from './sets/set.entity';
import { Card } from './cards/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'poke_admin.db',
      entities: [Set, Card],
      synchronize: true, 
    }),
  ],
})
export class AppModule {}