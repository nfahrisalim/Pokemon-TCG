import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Supertype } from '../supertype/supertype.entity';
import { Rarity } from '../rarity/rarity.entity';
import { Type } from '../type/type.entity';
import { Legality } from '../legality/legality.entity';
import { Set as SetEntity } from '../sets/set.entity';
import { Card } from '../cards/card.entity';
import { Subtype } from '../subtype/subtype.entity';
import { CardType } from '../card-type/card-type.entity';
import { PokedexCard } from '../pokedex-card/pokedex-card.entity';
import { TcgPlayer } from '../tcg-player/tcg-player.entity';
import { Deck } from '../deck/deck.entity';
import { DeckType } from '../deck/deck-type.entity';
import { DeckCard } from '../deck/deck-card.entity';

@Injectable()
export class SeederService {
  private supertypeCache = new Map<string, number>();
  private rarityCache = new Map<string, number>();
  private typeCache = new Map<string, number>();
  private dataDir = path.join(process.cwd(), 'Data');

  constructor(
    @InjectRepository(Supertype)
    private supertypeRepository: Repository<Supertype>,
    @InjectRepository(Rarity)
    private rarityRepository: Repository<Rarity>,
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
    @InjectRepository(Legality)
    private legalityRepository: Repository<Legality>,
    @InjectRepository(SetEntity)
    private setRepository: Repository<SetEntity>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(Subtype)
    private subtypeRepository: Repository<Subtype>,
    @InjectRepository(CardType)
    private cardTypeRepository: Repository<CardType>,
    @InjectRepository(PokedexCard)
    private pokedexCardRepository: Repository<PokedexCard>,
    @InjectRepository(TcgPlayer)
    private tcgPlayerRepository: Repository<TcgPlayer>,
    @InjectRepository(Deck)
    private deckRepository: Repository<Deck>,
    @InjectRepository(DeckType)
    private deckTypeRepository: Repository<DeckType>,
    @InjectRepository(DeckCard)
    private deckCardRepository: Repository<DeckCard>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    const existingSupertypeCount = await this.supertypeRepository.count();
    if (existingSupertypeCount > 0) {
      console.log('[Seeder] Data already exists, skipping seed.');
      return;
    }

    console.log('[Seeder] Starting database seeding...');

    try {
      await this.seedSupertypes();
      await this.seedRarities();
      await this.seedTypes();
      await this.seedLegalityAndSets();
      await this.seedCards();
      await this.seedSubtypes();
      await this.seedCardTypes();
      await this.seedPokedexCards();
      await this.seedTcgPlayers();
      await this.seedDecks();

      console.log('[Seeder] Done! ✓');
    } catch (error) {
      console.error('[Seeder] Error during seeding:', error);
      throw error;
    }
  }

  private async seedSupertypes(): Promise<void> {
    console.log('[Seeder] Seeding supertypes...');

    const supertypes = new Set<string>();
    const cardsDir = path.join(this.dataDir, 'cards', 'en');

    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));
    for (const file of cardFiles) {
      const filePath = path.join(cardsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data.forEach((card: any) => {
        if (card.supertype) supertypes.add(card.supertype);
      });
    }

    let nextId = 1;
    for (const supertype of supertypes) {
      const existing = await this.supertypeRepository.findOne({
        where: { supertype },
      });
      if (!existing) {
        await this.supertypeRepository.save({
          supertype_id: nextId,
          supertype,
        });
      }
      const record = await this.supertypeRepository.findOne({
        where: { supertype },
      });
      if (record) this.supertypeCache.set(supertype, record.supertype_id);
      nextId++;
    }

    console.log(`[Seeder] Seeded ${supertypes.size} supertypes`);
  }

  private async seedRarities(): Promise<void> {
    console.log('[Seeder] Seeding rarities...');

    const rarities = new Set<string>();
    const cardsDir = path.join(this.dataDir, 'cards', 'en');

    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));
    for (const file of cardFiles) {
      const filePath = path.join(cardsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data.forEach((card: any) => {
        if (card.rarity) rarities.add(card.rarity);
      });
    }

    let nextId = 1;
    for (const rarity of rarities) {
      const existing = await this.rarityRepository.findOne({
        where: { rarity },
      });
      if (!existing) {
        await this.rarityRepository.save({
          rarity_id: nextId,
          rarity,
        });
      }
      const record = await this.rarityRepository.findOne({
        where: { rarity },
      });
      if (record) this.rarityCache.set(rarity, record.rarity_id);
      nextId++;
    }

    console.log(`[Seeder] Seeded ${rarities.size} rarities`);
  }

  private async seedTypes(): Promise<void> {
    console.log('[Seeder] Seeding types...');

    const types = new Set<string>();

    // Scan card files
    const cardsDir = path.join(this.dataDir, 'cards', 'en');
    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));
    for (const file of cardFiles) {
      const filePath = path.join(cardsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data.forEach((card: any) => {
        if (card.types && Array.isArray(card.types)) {
          card.types.forEach((t: string) => types.add(t));
        }
      });
    }

    // Scan deck files
    const decksDir = path.join(this.dataDir, 'decks', 'en');
    if (fs.existsSync(decksDir)) {
      const deckFiles = fs.readdirSync(decksDir).filter((f) => f.endsWith('.json'));
      for (const file of deckFiles) {
        const filePath = path.join(decksDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        data.forEach((deck: any) => {
          if (deck.types && Array.isArray(deck.types)) {
            deck.types.forEach((t: string) => types.add(t));
          }
        });
      }
    }

    let nextId = 1;
    for (const type of types) {
      const existing = await this.typeRepository.findOne({
        where: { type },
      });
      if (!existing) {
        await this.typeRepository.save({
          type_id: nextId,
          type,
        });
      }
      const record = await this.typeRepository.findOne({
        where: { type },
      });
      if (record) this.typeCache.set(type, record.type_id);
      nextId++;
    }

    console.log(`[Seeder] Seeded ${types.size} types`);
  }

  private async seedLegalityAndSets(): Promise<void> {
    console.log('[Seeder] Seeding legality and card sets...');

    const setsPath = path.join(this.dataDir, 'sets', 'en.json');
    const setsData = JSON.parse(fs.readFileSync(setsPath, 'utf-8'));

    for (const setData of setsData) {
      // Create legality record
      const legality = await this.legalityRepository.save({
        unlimited:
          setData.legalities?.unlimited === 'Legal' ? true : setData.legalities?.unlimited === 'Banned' ? false : null,
        standard:
          setData.legalities?.standard === 'Legal' ? true : setData.legalities?.standard === 'Banned' ? false : null,
        expanded:
          setData.legalities?.expanded === 'Legal' ? true : setData.legalities?.expanded === 'Banned' ? false : null,
      });

      // Parse dates
      const releaseDate = this.parseDate(setData.releaseDate);
      const updatedAt = this.parseDate(setData.updatedAt);

      // Create set record
      const existing = await this.setRepository.findOne({
        where: { set_id: setData.id },
      });

      if (!existing) {
        await this.setRepository.save({
          set_id: setData.id,
          set_name: setData.name,
          series: setData.series,
          printed_total: setData.printedTotal,
          total: setData.total,
          ptcgo_code: setData.ptcgoCode || null,
          release_date: releaseDate,
          updated_at: updatedAt,
          symbol_img: setData.images?.symbol || '',
          logo_img: setData.images?.logo || '',
          legality_id: legality.legality_id,
        });
      }
    }

    console.log(`[Seeder] Seeded ${setsData.length} sets with legality`);
  }

  private async seedCards(): Promise<void> {
    console.log('[Seeder] Seeding cards...');

    const cardsDir = path.join(this.dataDir, 'cards', 'en');
    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));

    let totalCards = 0;

    for (const file of cardFiles) {
      const setId = file.replace('.json', '');
      const filePath = path.join(cardsDir, file);
      const cardsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const cardData of cardsData) {
          const supertypeId = cardData.supertype ? this.supertypeCache.get(cardData.supertype) : null;
          const rarityId = cardData.rarity ? this.rarityCache.get(cardData.rarity) || null : null;

          if (cardData.supertype && (supertypeId === null || supertypeId === undefined)) {
            throw new Error(`[Seeder] Missing supertype id for card "${cardData.name}" (${cardData.id})`);
          }

          const hp = cardData.hp ? parseInt(cardData.hp, 10) : null;

          const existing = await queryRunner.manager.findOne(Card, {
            where: { card_id: cardData.id },
          });

          if (!existing) {
            await queryRunner.manager.save(Card, {
              card_id: cardData.id,
              card_name: cardData.name,
              set_id: setId,
              ...(supertypeId !== null && supertypeId !== undefined ? { supertype_id: supertypeId } : {}),
              rarity_id: rarityId,
              hp,
              number: cardData.number,
              artist: cardData.artist || null,
              small_img: cardData.images?.small || '',
              large_img: cardData.images?.large || '',
              flavor_text: cardData.flavorText || null,
            });
          }

          totalCards++;
        }

        await queryRunner.commitTransaction();
        console.log(`[Seeder] Seeding set: ${setId} (${cardsData.length} cards)...`);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(`[Seeder] Error seeding set ${setId}:`, error);
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    console.log(`[Seeder] Seeded ${totalCards} total cards`);
  }

  private async seedSubtypes(): Promise<void> {
    console.log('[Seeder] Seeding subtypes...');

    const cardsDir = path.join(this.dataDir, 'cards', 'en');
    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));

    let totalSubtypes = 0;

    for (const file of cardFiles) {
      const filePath = path.join(cardsDir, file);
      const cardsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const cardData of cardsData) {
        if (cardData.subtypes && Array.isArray(cardData.subtypes)) {
          let subtypeId = 1;
          for (const subtype of cardData.subtypes) {
            const existing = await this.subtypeRepository.findOne({
              where: { card_id: cardData.id, subtype },
            });

            if (!existing) {
              await this.subtypeRepository.save({
                subtype_id: subtypeId,
                subtype,
                card_id: cardData.id,
              });
              totalSubtypes++;
            }
            subtypeId++;
          }
        }
      }
    }

    console.log(`[Seeder] Seeded ${totalSubtypes} subtypes`);
  }

  private async seedCardTypes(): Promise<void> {
    console.log('[Seeder] Seeding card types...');

    const cardsDir = path.join(this.dataDir, 'cards', 'en');
    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));

    let totalCardTypes = 0;

    for (const file of cardFiles) {
      const filePath = path.join(cardsDir, file);
      const cardsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const cardData of cardsData) {
        if (cardData.types && Array.isArray(cardData.types)) {
          for (const type of cardData.types) {
            const typeId = this.typeCache.get(type);
            if (typeId) {
              const existing = await this.cardTypeRepository.findOne({
                where: { card_id: cardData.id, type_id: typeId },
              });

              if (!existing) {
                await this.cardTypeRepository.save({
                  card_id: cardData.id,
                  type_id: typeId,
                });
                totalCardTypes++;
              }
            }
          }
        }
      }
    }

    console.log(`[Seeder] Seeded ${totalCardTypes} card types`);
  }

  private async seedPokedexCards(): Promise<void> {
    console.log('[Seeder] Seeding pokedex cards...');

    const cardsDir = path.join(this.dataDir, 'cards', 'en');
    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));

    let totalPokedexCards = 0;

    for (const file of cardFiles) {
      const filePath = path.join(cardsDir, file);
      const cardsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const cardData of cardsData) {
        if (cardData.nationalPokedexNumbers && Array.isArray(cardData.nationalPokedexNumbers)) {
          for (const pokedexId of cardData.nationalPokedexNumbers) {
            const existing = await this.pokedexCardRepository.findOne({
              where: { card_id: cardData.id, pokedex_id: pokedexId },
            });

            if (!existing) {
              await this.pokedexCardRepository.save({
                card_id: cardData.id,
                pokedex_id: pokedexId,
              });
              totalPokedexCards++;
            }
          }
        }
      }
    }

    console.log(`[Seeder] Seeded ${totalPokedexCards} pokedex cards`);
  }

  private async seedTcgPlayers(): Promise<void> {
    console.log('[Seeder] Seeding TCG player prices...');

    const cardsDir = path.join(this.dataDir, 'cards', 'en');
    const cardFiles = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));

    let totalTcgPlayers = 0;

    for (const file of cardFiles) {
      const filePath = path.join(cardsDir, file);
      const cardsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const cardData of cardsData) {
        if (cardData.tcgplayer) {
          const tcgData = cardData.tcgplayer;
          const updatedAt = this.parseDate(tcgData.updatedAt);

          if (tcgData.prices && typeof tcgData.prices === 'object') {
            for (const [cardType, priceData] of Object.entries(tcgData.prices)) {
              const prices = priceData as any;

              const existing = await this.tcgPlayerRepository.findOne({
                where: { card_id: cardData.id, card_type: cardType },
              });

              if (!existing) {
                await this.tcgPlayerRepository.save({
                  card_id: cardData.id,
                  card_type: cardType,
                  url: tcgData.url,
                  updated_at: updatedAt,
                  low_price: prices.low || null,
                  mid_price: prices.mid || null,
                  high_price: prices.high || null,
                  market_price: prices.market || null,
                });
                totalTcgPlayers++;
              }
            }
          }
        }
      }
    }

    console.log(`[Seeder] Seeded ${totalTcgPlayers} TCG player entries`);
  }

  private async seedDecks(): Promise<void> {
    console.log('[Seeder] Seeding decks...');

    const decksDir = path.join(this.dataDir, 'decks', 'en');
    if (!fs.existsSync(decksDir)) {
      console.log('[Seeder] No decks directory found, skipping...');
      return;
    }

    const deckFiles = fs.readdirSync(decksDir).filter((f) => f.endsWith('.json'));

    for (const file of deckFiles) {
      const filePath = path.join(decksDir, file);
      const decksData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const deckData of decksData) {
        const existing = await this.deckRepository.findOne({
          where: { deck_id: deckData.id },
        });

        if (!existing) {
          await this.deckRepository.save({
            deck_id: deckData.id,
            deck_name: deckData.name,
          });
        }

        console.log(`[Seeder] Seeding deck: ${deckData.name}...`);

        // Seed deck types
        if (deckData.types && Array.isArray(deckData.types)) {
          for (const type of deckData.types) {
            const typeId = this.typeCache.get(type);
            if (typeId) {
              const existing = await this.deckTypeRepository.findOne({
                where: { deck_id: deckData.id, type_id: typeId },
              });

              if (!existing) {
                await this.deckTypeRepository.save({
                  deck_id: deckData.id,
                  type_id: typeId,
                });
              }
            }
          }
        }

        // Seed deck cards
        if (deckData.cards && Array.isArray(deckData.cards)) {
          for (const cardEntry of deckData.cards) {
            try {
              const existing = await this.deckCardRepository.findOne({
                where: { deck_id: deckData.id, card_id: cardEntry.id },
              });

              if (!existing) {
                await this.deckCardRepository.save({
                  deck_id: deckData.id,
                  card_id: cardEntry.id,
                  count: cardEntry.count || 1,
                });
              }
            } catch (error) {
              // Silently skip if card_id doesn't exist
              console.log(`[Seeder] Skipping deck card ${cardEntry.id} (not found)`);
            }
          }
        }
      }
    }

    console.log(`[Seeder] Seeded ${deckFiles.length} deck files`);
  }

  private parseDate(dateString: string): Date {
    // Handle formats: "1999/01/09" and "2022/10/10 15:12:00"
    if (!dateString) return new Date();

    const dateWithoutTime = dateString.split(' ')[0];
    const [year, month, day] = dateWithoutTime.split('/');

    if (!year || !month || !day) return new Date();

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
}
