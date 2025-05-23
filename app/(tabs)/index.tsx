import { PropsWithChildren, useCallback, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Answer from '@/components/Answer';
import Question from '@/components/Question';

type Props = PropsWithChildren<{
	answer: { description: string; fileName: string };
	setAnswer: (answer: { description: string; fileName: string }) => void;
	language: string;
}>;

export default function InternalCompassScreen({ answer, setAnswer, language }: Props) {
	const { t } = useTranslation();

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
						<ThemedText type='title'>{t('Internal compass')}</ThemedText>
					</ThemedView>
				
					<ThemedView style={styles.stepContainer}>
						<ThemedText>
							{t('Internal compass description')}
						</ThemedText>
					</ThemedView>
					
					<Question type='internalCompass' setAnswer={setAnswer} language={language} />
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
        paddingTop: 30,
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
