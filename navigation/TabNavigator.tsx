import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import ModalWindow from '@/components/Modal';
import i18n from '@/i18n';

import InternalCompassScreen from '@/screens/InternalCompass';
import FulcrumScreen from '@/screens/Fulcrum';
import SettingsScreen from '@/screens/Settings';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
	const colorScheme = useColorScheme();

	const [internalCompassAnswer, setInternalCompassAnswer] = useState({
		description: '',
		fileName: '',
	});
	const [fulcrumAnswer, setFulcrumAnswer] = useState({
		description: '',
		fileName: '',
	});
	const [language, setLanguage] = useState('');
	const [modalVisible, setModalVisible] = useState(false);

	const getStorageData = async () => {
		const value = await AsyncStorage.getItem('language');
		if (value !== null) {
			setLanguage(value);
			i18n.changeLanguage(value);
		}
		else {
			setModalVisible(true);
			i18n.changeLanguage('en');
		}
	};

	useEffect(() => {
		getStorageData();
	}, []);

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				tabBarLabelStyle: {
					fontFamily: 'CormorantGaramond-Regular',
					fontSize: 14,
				},
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
				ios: {
					position: 'absolute',
				},
				default: {},
				}),
			}}
		>
			<Tab.Screen
				name='index'
				options={{
					title: language === 'ru' ? 'Внутренний компас' : 'Internal compass',
					tabBarIcon: () => <Entypo name='compass' size={24} color='black' />,
				}}
			>
				{() => !language
				? <ModalWindow
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					setLanguage={setLanguage}
				/>
				: <InternalCompassScreen
					answer={internalCompassAnswer}
					setAnswer={setInternalCompassAnswer}
					language={language}
				/>}
			</Tab.Screen>
			<Tab.Screen
				name='explore'
				options={{
					title: language === 'ru' ? 'Точка опоры' : 'Fulcrum',
					tabBarIcon: () => <FontAwesome5 name='fulcrum' size={28} color='black' />,
				}}
			>
				{() => <FulcrumScreen answer={fulcrumAnswer} setAnswer={setFulcrumAnswer} language={language} />}
			</Tab.Screen>
			<Tab.Screen
				name='settings'
				options={{
					title: language === 'ru' ? 'Настройки' : 'Settings',
					tabBarIcon: () => <Feather name='settings' size={24} color='black' />,
					// tabBarItemStyle: { flex: 0.8 },
				}}
			>
				{() => <SettingsScreen language={language} setLanguage={setLanguage} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
