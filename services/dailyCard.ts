import Fulcrum from '@/storage/fulcrum/fulcrum.json';
import InternalCompass from '@/storage/internalCompass/internalCompass.json';

export type DeckId = 'fulcrum' | 'internalCompass';

export type DailyCard = {
	deck: DeckId;
	fileName: string;
};

const DECK_SIZES: Record<DeckId, number> = {
	fulcrum: 60,
	internalCompass: 59,
};

export function pickDailyCard(): DailyCard {
	const decks: DeckId[] = ['fulcrum', 'internalCompass'];
	const deck = decks[Math.floor(Math.random() * decks.length)];
	const index = Math.floor(Math.random() * DECK_SIZES[deck]) + 1;
	return {
		deck,
		fileName: `${deck}_${index}.jpg`,
	};
}

export function describeCard(card: DailyCard, language: string): string {
	const deckJson: Record<string, Record<string, string>> =
		card.deck === 'fulcrum' ? (Fulcrum as any) : (InternalCompass as any);
	return deckJson[card.fileName]?.[language] ?? '';
}
