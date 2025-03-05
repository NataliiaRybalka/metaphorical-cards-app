import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Question from '@/components/Question';

export default function HomeScreen() {
	const [answer, setAnswer] = useState({
		description: '',
		path: '',
	});
	
	return (
		<ScrollView style={styles.scrollView}>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type='title'>Точка опоры</ThemedText>
			</ThemedView>
			
			<ThemedView style={styles.stepContainer}>
				<ThemedText>
					это ресурсные карты. Там изображены позитивные сценки, пейзажи и абстракции, которые призваны вдохновить Тебя, подарить силы и радость. Такие карты дают возможность сформулировать новое решение, по-другому посмотреть на себя, обрести внутреннюю опору и найти внешний ресурс.
				</ThemedText>
			</ThemedView>
			
			<Question type='fulcrum' setAnswer={setAnswer} />
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
});
