import { PropsWithChildren } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import FlipCard from 'react-native-flip-card';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { cardsPaths } from '@/storage/cards_paths';

type Props = PropsWithChildren<{
	answer: { description: string; fileName: string },
}>;

export default function Answer({ answer }: Props) {
	const splitedAnswer = answer.description.split("'");
	const title = splitedAnswer[1];
	const description = splitedAnswer[2];

	return (
		<ScrollView>
			<ThemedView>
				<ThemedText type='defaultSemiBold' style={styles.title}>
					{title}
				</ThemedText>

				<FlipCard flipHorizontal={true} flipVertical={false} style={styles.flipCard}>
					<ThemedView>
						<Image source={cardsPaths[answer.fileName]} style={styles.image} />

						<ThemedText style={styles.disclaimer}>
							Нажми на картинку, чтобы прочитать значение
						</ThemedText>
					</ThemedView>

					<ThemedView>
						<ThemedText style={styles.description}>
							{description}
						</ThemedText>

						<ThemedText style={styles.disclaimer}>
							Нажми на текст, чтобы вернуться к картинке
						</ThemedText>
					</ThemedView>
				</FlipCard>
			</ThemedView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	title: {
		padding: 10,
		textAlign: 'center',
		fontSize: 20
	},
	image: {
		width: '100%',
		height: 500,
		borderRadius: 10
	},
	flipCard: {
		padding: 10,
		paddingTop: 0,
	},
	description: {
		paddingTop: 50,
		paddingBottom: 50,
	},
	disclaimer: {
		textAlign: 'center',
		fontSize: 12,
		paddingTop: 10,
		color: 'gray',
	},
});
