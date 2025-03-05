import { PropsWithChildren, useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Fulcrum from '@/storage/fulcrum/fulcrum.json';
import InternalCompass from '@/storage/internalCompass/internalCompass.json';

type Props = PropsWithChildren<{
	type: string;
	setAnswer: (answer: { description: string; fileName: string }) => void;
}>;

const jsonFiles = {
	fulcrum: Fulcrum,
	internalCompass: InternalCompass,
}

export default function Question({ type, setAnswer }: Props) {
	const [inputQuestion, setInputQuestion] = useState('');
	
	const getResult = async () => {
		const maxNum = type === 'Fulcrum' ? 60 : 59;
		const random = Math.floor(Math.random() * (maxNum - 1 + 1)) + 1;

		const fileName = `${type}_${random}.jpg` as keyof typeof InternalCompass;
		
		setAnswer({
			//@ts-ignore
			description: jsonFiles[type][fileName],
			fileName,
		});
	};

	return (
		<ScrollView>
			<ThemedView>
				<ThemedText type='defaultSemiBold'>
					Напиши свой вопрос:
				</ThemedText>
				<TextInput style={styles.input} value={inputQuestion} onChangeText={setInputQuestion} />

				<ThemedView style={styles.buttonContainer}>
					<Pressable style={styles.button} onPress={getResult}>
						<ThemedText>
							Получить ответ
						</ThemedText>
					</Pressable>
				</ThemedView>
			</ThemedView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	input: {
		backgroundColor: 'lightgrey',
		marginLeft: 10,
		marginRight: 10,
	},
	buttonContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		backgroundColor: 'darkgrey',
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center',
		width: 150
	},
});
