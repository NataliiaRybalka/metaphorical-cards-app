import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import 'react-native-reanimated';

import RootNavigator from '@/navigation/RootNavigator';
import { useColorScheme } from '@/hooks/useColorScheme';
import '@/i18n';

export default function App() {
	const colorScheme = useColorScheme();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
				<NavigationContainer
					theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
					onReady={() => BootSplash.hide({ fade: true })}
				>
					<RootNavigator />
				</NavigationContainer>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
