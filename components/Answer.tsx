import { PropsWithChildren, useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Answer() {
	const [inputQuestion, setInputQuestion] = useState('');
	const [answer, setAnswer] = useState('');

	const getResult = async () => {
		console.log(inputQuestion);
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
							Ответ
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
