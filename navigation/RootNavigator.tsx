import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from '@/navigation/TabNavigator';
import NotFoundScreen from '@/screens/NotFound';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name='Tabs' component={TabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
		</Stack.Navigator>
	);
}
