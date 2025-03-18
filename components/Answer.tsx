import { PropsWithChildren } from 'react';
import { StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { cardsPaths } from '@/storage/cards_paths';

type Props = PropsWithChildren<{
	answer: { description: string; fileName: string },
}>;

export default function Answer({ answer }: Props) {
	const { t } = useTranslation();

	const screenHeight = useWindowDimensions().height;
	const imageHeight = screenHeight < 1000 ? '80%' : '90%';

	const splitedAnswer = answer.description.split("'");
	const title = splitedAnswer[1];
	const description = splitedAnswer[2];

	return (
		<ScrollView>
			<ThemedView style={{flex: 1, height: screenHeight,}}>
				<ThemedText type='defaultSemiBold' style={styles.title}>
					{title}
				</ThemedText>

				<FlipCard flipHorizontal={true} flipVertical={false} style={styles.flipCard}>
					<ThemedView>
						<Image
							source={cardsPaths[answer.fileName]}
							style={{width: '100%', height: imageHeight, borderRadius: 10}}
						/>

						<ThemedText style={styles.disclaimer}>
							{t('Click on the image to read the meaning')}
						</ThemedText>
					</ThemedView>

					<ThemedView>
						<ThemedText style={styles.description}>
							{description}
						</ThemedText>

						<ThemedText style={styles.disclaimer}>
							{t('Click on the text to return to the image')}
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
