import { Tabs } from 'expo-router';
import FontAwesome from "react-native-vector-icons/FontAwesome";
export default () => {
    return (
        <Tabs>
            <Tabs.Screen name='Home' options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="home" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name='Perfil' options={{
                title: "Perfil",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="user" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name='Carrito' options={{
                title: "Carrito",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="shopping-cart" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name='Logout' options={{
                title: "Logout",
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="sign-out" size={size} color={color} />
                ),
            }} />
        </Tabs>
    );
}