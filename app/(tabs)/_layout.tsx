import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/i18n';

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import InternalCompassScreen from './index';
import FulcrumScreen from './explore';
import ModalWindow from './modal';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
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
			setModalVisible(true)
			i18n.changeLanguage('en');
		}
	};

	useEffect(() => {
		// AsyncStorage.removeItem('language');
		getStorageData();
	}, []);

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
		</Tab.Navigator>
	);
}
