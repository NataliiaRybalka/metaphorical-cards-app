import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
	AlarmType,
	AndroidImportance,
	AndroidNotificationSetting,
	AuthorizationStatus,
	RepeatFrequency,
	TriggerType,
	TimestampTrigger,
} from '@notifee/react-native';

import i18n from '@/i18n';

const CHANNEL_ID = 'daily-card';
const SCHEDULE_ID = 'daily-card-reminder';
const BACKGROUND_PROMPT_KEY = 'backgroundExecutionPrompted';
const HOURS = 10;
const MINUTES = 0;

function nextKyiv10AMTimestamp(): number {
	const now = new Date();
	const dtf = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Kyiv',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	const partsFor = (d: Date) =>
		dtf.formatToParts(d).reduce<Record<string, number>>((acc, p) => {
			if (p.type !== 'literal') acc[p.type] = parseInt(p.value, 10);
			return acc;
		}, {});

	const utcForKyivWallClock = (y: number, m: number, d: number, h: number, mi: number) => {
		const guess = Date.UTC(y, m - 1, d, h, mi);
		const seen = partsFor(new Date(guess));
		const seenAsUTC = Date.UTC(seen.year, seen.month - 1, seen.day, seen.hour, seen.minute);
		const offset = seenAsUTC - guess;
		return guess - offset;
	};

	const cur = partsFor(now);
	let target = utcForKyivWallClock(cur.year, cur.month, cur.day, HOURS, MINUTES);
	if (target <= now.getTime()) {
		const tomorrow = new Date(Date.UTC(cur.year, cur.month - 1, cur.day + 1));
		target = utcForKyivWallClock(
			tomorrow.getUTCFullYear(),
			tomorrow.getUTCMonth() + 1,
			tomorrow.getUTCDate(),
			HOURS,
			MINUTES,
		);
	}
	return target;
}

export async function ensureNotificationChannel(): Promise<void> {
	await notifee.createChannel({
		id: CHANNEL_ID,
		name: i18n.t('Daily card'),
		importance: AndroidImportance.HIGH,
	});
}

export async function requestNotificationPermission(): Promise<boolean> {
	const settings = await notifee.requestPermission();
	return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
}

export async function scheduleDailyCardReminder(): Promise<void> {
	await notifee.cancelTriggerNotification(SCHEDULE_ID);

	const trigger: TimestampTrigger = {
		type: TriggerType.TIMESTAMP,
		timestamp: nextKyiv10AMTimestamp(),
		repeatFrequency: RepeatFrequency.DAILY,
		alarmManager: { type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE },
	};

	await notifee.createTriggerNotification(
		{
			id: SCHEDULE_ID,
			title: i18n.t('Your daily card'),
			body: i18n.t("Tap to see today's message"),
			android: {
				channelId: CHANNEL_ID,
				pressAction: { id: 'default', launchActivity: 'default' },
			},
			data: { type: 'daily-card' },
		},
		trigger,
	);
}

async function promptBackgroundExecutionOnce(): Promise<void> {
	const alreadyPrompted = await AsyncStorage.getItem(BACKGROUND_PROMPT_KEY);
	if (alreadyPrompted) return;

	const settings = await notifee.getNotificationSettings();
	if (settings.android.alarm === AndroidNotificationSetting.DISABLED) {
		await notifee.openAlarmPermissionSettings();
	}

	if (await notifee.isBatteryOptimizationEnabled()) {
		await notifee.openBatteryOptimizationSettings();
	}

	const power = await notifee.getPowerManagerInfo();
	if (power.activity) {
		await notifee.openPowerManagerSettings();
	}

	await AsyncStorage.setItem(BACKGROUND_PROMPT_KEY, '1');
}

export async function setupDailyCardNotifications(): Promise<void> {
	const granted = await requestNotificationPermission();
	if (!granted) return;
	await ensureNotificationChannel();
	await promptBackgroundExecutionOnce();
	await scheduleDailyCardReminder();
}
