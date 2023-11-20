import { Tabs, router, useFocusEffect, useRouter } from 'expo-router';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLOURS } from '../../config/Theme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import React from 'react';

export default () => {
    const [needLogin, setNeedLogin] = useState<string | undefined>();

    const verify = async () => {
        const id = await AsyncStorage.getItem('my-key');
        setNeedLogin(id);
    }

    useFocusEffect(
        React.useCallback(() => {
          verify();
        }, [])
      );

    return (
        <Tabs>
            <Tabs.Screen name='Home' options={{
                tabBarActiveTintColor: COLOURS.blueText,
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="home" size={size} color={COLOURS.blueText} />
                ),
            }} />
            <Tabs.Screen name='Perfil' options={{
                tabBarActiveTintColor: COLOURS.blueText,
                title: "Perfil",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="user" size={size} color={COLOURS.blueText} />
                )
            }} />
            <Tabs.Screen name='Carrito' options={{
                tabBarActiveTintColor: COLOURS.blueText,
                title: "Carrito",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="shopping-cart" size={size} color={COLOURS.blueText} />
                ),
            }} />
            <Tabs.Screen name='Logout' options={{
                tabBarActiveTintColor: COLOURS.blueText,
                title: !needLogin ? 'Login' : 'Logout',
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="sign-out" size={size} color={COLOURS.blueText} />
                ),
            }} />
        </Tabs>
    );
}