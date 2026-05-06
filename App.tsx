import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
	NavigationContainer,
	DarkTheme,
	DefaultTheme,
	createNavigationContainerRef,
} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { EventType } from '@notifee/react-native';
import 'react-native-reanimated';

import RootNavigator from '@/navigation/RootNavigator';
import { useColorScheme } from '@/hooks/useColorScheme';
import { setupDailyCardNotifications } from '@/services/notifications';
import { describeCard, getOrCreateTodaysCard } from '@/services/dailyCard';
import i18n from '@/i18n';

const navigationRef = createNavigationContainerRef();

async function navigateToTodaysCard() {
	const card = await getOrCreateTodaysCard();
	const language = (await AsyncStorage.getItem('language')) || 'en';
	const description = describeCard(card, language);
	const tab = card.deck === 'fulcrum' ? 'explore' : 'index';

	if (!navigationRef.isReady()) {
		setTimeout(navigateToTodaysCard, 100);
		return;
	}
	(navigationRef.navigate as (...a: unknown[]) => void)('Tabs', {
		screen: tab,
		params: { dailyCard: { fileName: card.fileName, description } },
	});
}

export default function App() {
	const colorScheme = useColorScheme();

	useEffect(() => {
		(async () => {
			const language = await AsyncStorage.getItem('language');
			if (language) await i18n.changeLanguage(language);
			await setupDailyCardNotifications();

			const initial = await notifee.getInitialNotification();
			if (initial?.notification.data?.type === 'daily-card') {
				navigateToTodaysCard();
			}
		})();

		const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
			if (type === EventType.PRESS && detail.notification?.data?.type === 'daily-card') {
				navigateToTodaysCard();
			}
		});

		return unsubscribe;
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
				<NavigationContainer
					ref={navigationRef}
					theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
					onReady={() => BootSplash.hide({ fade: true })}
				>
					<RootNavigator />
				</NavigationContainer>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
