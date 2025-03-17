import { useState, PropsWithChildren } from 'react';
import { Modal, Text, Pressable, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';

type Props = PropsWithChildren<{
	modalVisible: boolean;
	setModalVisible: (modalVisible: boolean) => void;
	setLanguage: (language: string) => void;
}>;

export default function ModalWindow({
	modalVisible,
	setModalVisible,
	setLanguage,
}: Props) {
	const [chosenLanguage, setChosenLanguage] = useState('ru');

	const storeData = async () => {
		setModalVisible(!modalVisible);
		await AsyncStorage.setItem('language', chosenLanguage);
		setLanguage(chosenLanguage);
	};
	
	return (
		<Modal
			animationType='slide'
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}
		>
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
							onPress={storeData}
						>
							<Text style={styles.buttonTextStyle}>{chosenLanguage === 'ru' ? 'Сохранить' : 'Save'}</Text>
						</Pressable>
					</View>
				</View>
		</Modal>
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
