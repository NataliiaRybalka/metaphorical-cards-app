import AsyncStorage from '@react-native-async-storage/async-storage';

import Fulcrum from '@/storage/fulcrum/fulcrum.json';
import InternalCompass from '@/storage/internalCompass/internalCompass.json';

export type DeckId = 'fulcrum' | 'internalCompass';

export type DailyCard = {
	deck: DeckId;
	fileName: string;
	dateKey: string;
};

const DECK_SIZES: Record<DeckId, number> = {
	fulcrum: 60,
	internalCompass: 59,
};

const STORAGE_KEY = 'pendingDailyCard';

function todayKyivDateKey(): string {
	const dtf = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Kyiv',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	return dtf.format(new Date());
}

function pickRandomCard(): DailyCard {
	const decks: DeckId[] = ['fulcrum', 'internalCompass'];
	const deck = decks[Math.floor(Math.random() * decks.length)];
	const index = Math.floor(Math.random() * DECK_SIZES[deck]) + 1;
	return {
		deck,
		fileName: `${deck}_${index}.jpg`,
		dateKey: todayKyivDateKey(),
	};
}

export async function getOrCreateTodaysCard(): Promise<DailyCard> {
	const today = todayKyivDateKey();
	const raw = await AsyncStorage.getItem(STORAGE_KEY);
	if (raw) {
		const stored = JSON.parse(raw) as DailyCard;
		if (stored.dateKey === today) return stored;
	}
	const fresh = pickRandomCard();
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
	return fresh;
}

export async function clearPendingDailyCard(): Promise<void> {
	await AsyncStorage.removeItem(STORAGE_KEY);
}

export function describeCard(card: DailyCard, language: string): string {
	const deckJson: Record<string, Record<string, string>> =
		card.deck === 'fulcrum' ? (Fulcrum as any) : (InternalCompass as any);
	return deckJson[card.fileName]?.[language] ?? '';
}
