import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
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
			<Tabs.Screen
				name='index'
				options={{
					title: 'Внутренний компас',
					tabBarIcon: () => <Entypo name="compass" size={24} color="black" />,
				}}
			/>
			<Tabs.Screen
				name='explore'
				options={{
					title: 'Точка опоры',
					tabBarIcon: () => <FontAwesome5 name="fulcrum" size={28} color="black" />,
				}}
			/>
		</Tabs>
	);
}
