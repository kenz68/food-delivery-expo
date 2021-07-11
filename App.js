import React from 'react';
import { AsyncStorage } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Tabs from './navigation/tabs';
import { Home, Restaurant, OrderDelivery } from './screens';
import { langs, USERS, LG } from './constants';

const Stack = createStackNavigator();

import { useFonts } from 'expo-font';

export default function App() {

    const [loaded] = useFonts({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
        'Roboto-Italic': require('./assets/fonts/Roboto-Italic.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf')
    });

    const [lg, setLang] = React.useState(LG.en);
    const [user, setUser] = React.useState(USERS.guest);

    const currentLg = async () => {
        const item = await AsyncStorage.getItem('lang');
        setLang(item || LG.en);
    };

    const changeLg = async newLg => {
        await AsyncStorage.setItem('lang', newLg);
        setLang(newLg);
    }

    React.useEffect(() => {
        currentLg()
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"Home"}>
                <Stack.Screen name="Home" component={Tabs} />
                <Stack.Screen name="Restaurant" component={Restaurant} />
                <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
