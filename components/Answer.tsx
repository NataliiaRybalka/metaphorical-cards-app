import { PropsWithChildren } from 'react';
import { StyleSheet, ScrollView, Image, Pressable } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { cardsPaths } from '@/storage/cards_paths';

type Props = PropsWithChildren<{
	answer: { description: string; fileName: string },
}>;

export default function Answer({ answer }: Props) {
	return (
		<ScrollView>
			<ThemedView>
				<ThemedText type='defaultSemiBold'>
					Напиши свой вопрос:
				</ThemedText>

				<Image source={cardsPaths[answer.fileName]} style={styles.image} />

				<ThemedView style={styles.buttonContainer}>
					<Pressable style={styles.button} onPress={() => {}}>
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
	image: {
		width: 200,
		height: 200,
		borderRadius: 10
	},
});
