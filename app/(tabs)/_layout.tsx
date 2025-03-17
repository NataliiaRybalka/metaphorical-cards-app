import React, { useState, useEffect } from 'react';
import { Platform, Modal, Text, Pressable, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';

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

	const [language, setLanguage] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [chosenLanguage, setChosenLanguage] = useState('ru');

	const getStorageData = async () => {
		const value = await AsyncStorage.getItem('language');
		if (value !== null) setLanguage(value);
		else setModalVisible(true)
	};

	const storeData = async () => {
		setModalVisible(!modalVisible);
		await AsyncStorage.setItem('language', chosenLanguage);
		setLanguage(chosenLanguage);
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
					title: 'Внутренний компас',
					tabBarIcon: () => <Entypo name='compass' size={24} color='black' />,
				}}
			>
				{() => !language 
				? <>
					<Modal
					animationType='slide'
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => setModalVisible(!modalVisible)}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<RadioButton.Group
									onValueChange={(value) => setChosenLanguage(value)}
									value={chosenLanguage}
								>
									<View style={styles.radioView}>
										<RadioButton value='ru' color='black' />
										<Text style={styles.radioText}>Русский</Text>
									</View>
									<View style={styles.radioView}>
										<RadioButton value='en' color='black' />
										<Text style={styles.radioText}>English</Text>
									</View>
								</RadioButton.Group>

								<Pressable
								style={styles.button}
									onPress={storeData}>
									<Text style={styles.buttonTextStyle}>{chosenLanguage === 'ru' ? 'Сохранить' : 'Save'}</Text>
								</Pressable>
							</View>
						</View>
					</Modal>
				</>
				: <InternalCompassScreen answer={internalCompassAnswer} setAnswer={setInternalCompassAnswer} />}
			</Tab.Screen>
			<Tab.Screen
				name='explore'
				options={{
					title: 'Точка опоры',
					tabBarIcon: () => <FontAwesome5 name='fulcrum' size={28} color='black' />,
				}}
			>
				{() => <FulcrumScreen answer={fulcrumAnswer} setAnswer={setFulcrumAnswer} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		backgroundColor: '#0a7ea4',
		marginTop: 10,
		width: 150,
	},
	buttonTextStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 18,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	radioText: {
		fontSize: 20,
	},
	radioView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});
