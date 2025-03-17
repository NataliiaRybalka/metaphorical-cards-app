import { PropsWithChildren, useCallback, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// @ts-ignore
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Answer from '@/components/Answer';
import Question from '@/components/Question';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Modal, Text, Pressable, View } from 'react-native';

type Props = PropsWithChildren<{
	answer: { description: string; fileName: string };
	setAnswer: (answer: { description: string; fileName: string }) => void;
}>;

export default function InternalCompassScreen({ answer, setAnswer }: Props) {
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = () => {
		setRefreshing(true);
		setTimeout(() => {
			setAnswer({
				description: '',
				fileName: '',
			});
			setRefreshing(false);
		}, 1000);
	};

	useFocusEffect(
		useCallback(() => {
			setAnswer({
				description: '',
				fileName: ''
			});
		}, [setAnswer])
	);
	
	const [language, setLanguage] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [chosenLanguage, setChosenLanguage] = useState('ru');

	const getStorageData = async () => {
		const value = await AsyncStorage.getItem('language');
		if (value !== null) setLanguage(value);
	};

	const storeData = async () => {
		setModalVisible(!modalVisible);
		await AsyncStorage.setItem('language', chosenLanguage);
	};

	useEffect(() => {
		getStorageData();
	}, []);
	useEffect(() => {
		// if (!language) 
			setModalVisible(true)
	}, [language]);

    return (
        <ScrollView 
			style={styles.scrollView} 
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
			}
		>
			{
				(!answer.description || !answer.fileName) 
				? <>
					<ThemedView style={styles.titleContainer}>
						<ThemedText type='title'>Внутренний компас</ThemedText>
					</ThemedView>
				
					<ThemedView style={styles.stepContainer}>
						<ThemedText>
							является универсальной колодой с большим набором самых разных образов и сцен, которые подходят для проработки почти любой ситуации. Она энергетически наполненная и очень гармонично отражает всё происходящее внутри человека.
						</ThemedText>
					</ThemedView>
					
					<Question type='internalCompass' setAnswer={setAnswer} />
				</>
				: <Answer answer={answer} />
			}

			<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Выберите язык:</Text>
						<RadioButtonGroup
							containerStyle={{ marginBottom: 10 }}
							selected={chosenLanguage}
							onSelected={(value: string) => setChosenLanguage(value)}
							radioBackground="black"
						>
							<RadioButtonItem value="ru" label="Русский" />
							<RadioButtonItem value="en"	label="English"	/>
						</RadioButtonGroup>
						<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={storeData}>
							<Text style={styles.textStyle}>Сохранить</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingTop: 10,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
        padding: 10,
    },
    scrollView: {
        paddingTop: 32,
    },

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
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
});
