import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CaseService } from '../components/case/case.service';
import { CaseRarity } from '../components/case/entities/case.entity';

async function seedCases() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const caseService = app.get(CaseService);

    // Basic Case
    await caseService.createCase(
        'Basic Card Pack',
        'A basic pack containing common cards',
        10.00,
        CaseRarity.COMMON,
        ['Ace of Spades', 'King of Hearts', 'Queen of Diamonds', 'Jack of Clubs', 'Ten of Spades'],
        [40, 30, 20, 15, 10] // Higher weight = more common
    );

    // Premium Case
    await caseService.createCase(
        'Premium Card Pack',
        'A premium pack with better odds for rare cards',
        25.00,
        CaseRarity.RARE,
        ['Royal Flush', 'Four Aces', 'Straight Flush', 'Full House', 'Flush'],
        [10, 15, 20, 30, 25]
    );

    // Legendary Case
    await caseService.createCase(
        'Legendary Card Pack',
        'The ultimate pack with exclusive legendary cards',
        50.00,
        CaseRarity.LEGENDARY,
        ['Phoenix Card', 'Dragon Card', 'Mythical Joker', 'Golden Ace', 'Master Card'],
        [5, 10, 15, 30, 40]
    );

    console.log('Cases seeded successfully!');
    await app.close();
}

seedCases().catch((error) => {
    console.error('Error seeding cases:', error);
    process.exit(1);
});
