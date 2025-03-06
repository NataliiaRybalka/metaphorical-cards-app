import { useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Answer from '@/components/Answer';
import Question from '@/components/Question';

export default function FulcrumScreen() {
	const [answer, setAnswer] = useState({
		description: '',
		fileName: '',
	});
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
						<ThemedText type='title'>Точка опоры</ThemedText>
					</ThemedView>
					
					<ThemedView style={styles.stepContainer}>
						<ThemedText>
							это ресурсные карты. Там изображены позитивные сценки, пейзажи и абстракции, которые призваны вдохновить Тебя, подарить силы и радость. Такие карты дают возможность сформулировать новое решение, по-другому посмотреть на себя, обрести внутреннюю опору и найти внешний ресурс.
						</ThemedText>
					</ThemedView>
					
					<Question type='fulcrum' setAnswer={setAnswer} />
				</>
			: <Answer answer={answer} />
			}
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
