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

const ENABLED_KEY = 'notificationsEnabled';
const HOUR_KEY = 'notificationHour';
const MINUTE_KEY = 'notificationMinute';

const DEFAULT_HOURS = 10;
const DEFAULT_MINUTES = 0;

export type NotificationSettings = {
	enabled: boolean;
	hour: number;
	minute: number;
};

export async function getNotificationSettings(): Promise<NotificationSettings> {
	const [enabledRaw, hourRaw, minuteRaw] = await Promise.all([
		AsyncStorage.getItem(ENABLED_KEY),
		AsyncStorage.getItem(HOUR_KEY),
		AsyncStorage.getItem(MINUTE_KEY),
	]);

	const enabled = enabledRaw === null ? true : enabledRaw === '1';
	const hour = hourRaw === null ? DEFAULT_HOURS : parseInt(hourRaw, 10);
	const minute = minuteRaw === null ? DEFAULT_MINUTES : parseInt(minuteRaw, 10);

	return { enabled, hour, minute };
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
	await Promise.all([
		AsyncStorage.setItem(ENABLED_KEY, settings.enabled ? '1' : '0'),
		AsyncStorage.setItem(HOUR_KEY, String(settings.hour)),
		AsyncStorage.setItem(MINUTE_KEY, String(settings.minute)),
	]);
}

function nextLocalTimestamp(hour: number, minute: number): number {
	const now = new Date();
	const target = new Date(now);
	target.setHours(hour, minute, 0, 0);
	if (target.getTime() <= now.getTime()) {
		target.setDate(target.getDate() + 1);
	}
	return target.getTime();
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

export async function cancelDailyCardReminder(): Promise<void> {
	await notifee.cancelTriggerNotification(SCHEDULE_ID);
}

export async function scheduleDailyCardReminder(hour: number, minute: number): Promise<void> {
	await notifee.cancelTriggerNotification(SCHEDULE_ID);

	const trigger: TimestampTrigger = {
		type: TriggerType.TIMESTAMP,
		timestamp: nextLocalTimestamp(hour, minute),
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
	const { enabled, hour, minute } = await getNotificationSettings();

	if (!enabled) {
		await cancelDailyCardReminder();
		return;
	}

	const granted = await requestNotificationPermission();
	if (!granted) return;
	await ensureNotificationChannel();
	await promptBackgroundExecutionOnce();
	await scheduleDailyCardReminder(hour, minute);
}

export async function applyNotificationSettings(settings: NotificationSettings): Promise<void> {
	await saveNotificationSettings(settings);

	if (!settings.enabled) {
		await cancelDailyCardReminder();
		return;
	}

	const granted = await requestNotificationPermission();
	if (!granted) return;
	await ensureNotificationChannel();
	await scheduleDailyCardReminder(settings.hour, settings.minute);
}
