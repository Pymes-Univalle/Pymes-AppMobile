import { View, Text } from 'react-native';
import { Stack, useSearchParams } from 'expo-router';

const DetailsPage = () => {
    const { id } = useSearchParams();
    return (
        <View>
            <Stack.Screen options={{headerTitle: `Details #${id}`}}></Stack.Screen>
        </View>
    );
};

export default DetailsPage;