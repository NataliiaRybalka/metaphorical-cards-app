import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Answer from '@/components/Answer';
import Question from '@/components/Question';

export default function HomeScreen() {
	const [answer, setAnswer] = useState({
		description: '',
		path: '',
	});

    return (
        <ScrollView style={styles.scrollView}>
			{
				(!answer.description || !answer.path) 
				? <>
					<ThemedView style={styles.titleContainer}>
						<ThemedText type='title'>Внутренний компас</ThemedText>
					</ThemedView>
				
					<ThemedView style={styles.stepContainer}>
						<ThemedText>
							является универсальной колодой с большим набором самых разных образов и сценок, которые подходят для проработки почти любой ситуации. Она энергетически наполненная и очень гармонично отражает всё происходящее внутри человека.
						</ThemedText>
					</ThemedView>
					
					<Question type='internalCompass' setAnswer={setAnswer} />
				</>
				: <Answer />
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
