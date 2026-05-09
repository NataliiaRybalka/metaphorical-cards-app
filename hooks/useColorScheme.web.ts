import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	const scheme = useRNColorScheme();

	if (hasHydrated) {
		return scheme === 'dark' ? 'dark' : 'light';
	}

	return 'light';
}
