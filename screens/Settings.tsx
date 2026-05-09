import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
	applyNotificationSettings,
	getNotificationSettings,
} from '@/services/notifications';

const pad = (n: number) => String(n).padStart(2, '0');

export default function SettingsScreen() {
	const { t } = useTranslation();

	const [enabled, setEnabled] = useState(true);
	const [hour, setHour] = useState('10');
	const [minute, setMinute] = useState('00');
	const [loaded, setLoaded] = useState(false);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		(async () => {
			const settings = await getNotificationSettings();
			setEnabled(settings.enabled);
			setHour(pad(settings.hour));
			setMinute(pad(settings.minute));
			setLoaded(true);
		})();
	}, []);

	const onToggleEnabled = async (next: boolean) => {
		setEnabled(next);
		const saved = await getNotificationSettings();
		await applyNotificationSettings({ ...saved, enabled: next });
	};

	const onSave = async () => {
		const h = parseInt(hour, 10);
		const m = parseInt(minute, 10);

		if (Number.isNaN(h) || h < 0 || h > 23 || Number.isNaN(m) || m < 0 || m > 59) {
			Alert.alert(t('Invalid time'), t('Please enter hours 0-23 and minutes 0-59'));
			return;
		}

		setSaving(true);
		try {
			await applyNotificationSettings({ enabled, hour: h, minute: m });
			setHour(pad(h));
			setMinute(pad(m));
			Alert.alert(t('Saved'), t('Settings saved'));
		} finally {
			setSaving(false);
		}
	};

	if (!loaded) {
		return <ThemedView style={styles.container} />;
	}

	return (
		<ScrollView style={styles.scrollView}>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type='title'>{t('Settings')}</ThemedText>
			</ThemedView>

			<ThemedView style={styles.row}>
				<ThemedText type='settings'>{t('Daily card notifications')}</ThemedText>
				<Switch value={enabled} onValueChange={onToggleEnabled} color='darkgrey' />
			</ThemedView>

			<ThemedView style={styles.section}>
				<ThemedText type='settings'>{t('Notification time')}</ThemedText>

				<ThemedView style={styles.timeRow}>
					<TextInput
						style={[styles.timeInput, !enabled && styles.disabledInput]}
						value={hour}
						onChangeText={setHour}
						keyboardType='number-pad'
						maxLength={2}
						editable={enabled}
						placeholder='HH'
					/>
					<ThemedText style={styles.colon}>:</ThemedText>
					<TextInput
						style={[styles.timeInput, !enabled && styles.disabledInput]}
						value={minute}
						onChangeText={setMinute}
						keyboardType='number-pad'
						maxLength={2}
						editable={enabled}
						placeholder='MM'
					/>
				</ThemedView>
			</ThemedView>

			<Pressable
				style={[styles.button, saving && styles.buttonDisabled]}
				onPress={onSave}
				disabled={saving}
			>
				<ThemedText style={styles.buttonText}>{t('Save')}</ThemedText>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		paddingTop: 32,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingTop: 30,
		paddingBottom: 20,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	section: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		gap: 8,
	},
	timeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		marginTop: 12,
	},
	timeInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 10,
		fontSize: 24,
		minWidth: 70,
		textAlign: 'center',
		fontFamily: 'CormorantGaramond-Regular',
	},
	disabledInput: {
		opacity: 0.4,
	},
	colon: {
		fontSize: 24,
		paddingLeft: 0,
		paddingRight: 0,
	},
	button: {
		borderRadius: 20,
		padding: 12,
		backgroundColor: 'darkgrey',
		marginTop: 24,
		marginHorizontal: 40,
		marginBottom: 40,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 22,
	},
});
