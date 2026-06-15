import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from './sets/set.entity';
import { Card } from './cards/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_db_user',
      password: 'your_db_password',
      database: 'poke_admin_db',
      entities: [Set, Card],
      synchronize: true, 
    }),
  ],
})
export class AppModule {}