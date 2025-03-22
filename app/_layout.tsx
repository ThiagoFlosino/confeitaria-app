import { Stack } from 'expo-router';
import { Provider as PaperProvider, Appbar, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { styles } from '@/src/theme/styles';
import 'react-native-get-random-values';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        surfaceDisabled: '#DADADA',
        onSurfaceDisabled: '#000'
    }
};
export default function Layout() {
    return (
        <PaperProvider theme={theme}>
            <Stack
                screenOptions={{
                    header: ({ navigation, options }) => (
                        <Appbar.Header style={styles.appBar}>
                            {navigation.canGoBack() && (
                                <Appbar.BackAction color="#F08080" onPress={() => navigation.goBack()} />
                            )}
                            <Appbar.Content title={options.title ?? 'App Confeitaria'} titleStyle={styles.appBarTitle} />
                        </Appbar.Header>
                    ),
                }}
            />
        </PaperProvider>
    );
}
