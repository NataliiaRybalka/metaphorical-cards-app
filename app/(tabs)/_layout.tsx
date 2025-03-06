import React, { useState } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import InternalCompassScreen from './index';
import FulcrumScreen from './explore';

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
					title: 'Внутренний компас',
					tabBarIcon: () => <Entypo name="compass" size={24} color="black" />,
				}}
			>
				{() => <InternalCompassScreen answer={internalCompassAnswer} setAnswer={setInternalCompassAnswer} />}
			</Tab.Screen>
			<Tab.Screen
				name='explore'
				options={{
					title: 'Точка опоры',
					tabBarIcon: () => <FontAwesome5 name="fulcrum" size={28} color="black" />,
				}}
			>
				{() => <FulcrumScreen answer={fulcrumAnswer} setAnswer={setFulcrumAnswer} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
