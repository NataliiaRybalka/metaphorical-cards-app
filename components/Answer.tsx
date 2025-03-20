import { PropsWithChildren, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, useWindowDimensions, Animated } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { cardsPaths } from '@/storage/cards_paths';

type Props = PropsWithChildren<{
	answer: { description: string; fileName: string }
}>;

export default function Answer({ answer }: Props) {
    const { t } = useTranslation();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    const screenHeight = useWindowDimensions().height;
    const imageHeight = screenHeight < 1000 ? '80%' : '90%';

    const splitedAnswer = answer.description.split("'");
    const title = splitedAnswer[1];
    const description = splitedAnswer[2];

    useEffect(() => {
        Animated.sequence([
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <ScrollView>
            <ThemedText type="defaultSemiBold" style={styles.title}>
                {title}
            </ThemedText>

            <Animated.View style={{ flex: 1, height: screenHeight, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                <FlipCard flipHorizontal flipVertical={false} style={styles.flipCard}>
                    <ThemedView>
                        <Image source={cardsPaths[answer.fileName]} style={[{ height: imageHeight }, styles.image]} />
                        <ThemedText style={styles.disclaimer}>
                            {t('Click on the image to read the meaning')}
                        </ThemedText>
                    </ThemedView>

					<ThemedView style={{marginTop: 30}}>
                        <ThemedText style={styles.description}>{description}</ThemedText>
                        <ThemedText style={styles.disclaimer}>
                            {t('Click on the text to return to the image')}
                        </ThemedText>
                    </ThemedView>
                </FlipCard>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
		padding: 10,
		textAlign: 'center',
		fontSize: 30,
    },
    flipCard: {
		padding: 10,
		paddingTop: 0,
		paddingBottom: 0,
    },
    description: {
		paddingTop: 50,
		paddingBottom: 10,
		fontSize: 20,
    },
    disclaimer: {
		textAlign: 'center',
		fontSize: 12,
		color: 'gray',
		paddingTop: 5,
    },
    image: {
		width: '100%',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
    },
});
