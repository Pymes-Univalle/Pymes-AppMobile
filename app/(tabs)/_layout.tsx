import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default () => {
  const [mostrarPerfilTab, setMostrarPerfilTab] = useState(false);

  const obtenerValor = async () => {
    try {
      const id = await AsyncStorage.getItem("my-key");
      alert("valor " + id);
      setMostrarPerfilTab(id !== null);
    } catch (error) {
      console.error("Error al recuperar el valor:", error);
    }
  };

  // Llama a obtenerValor al montar el componente
  useEffect(() => {
    obtenerValor();
  }, []);

  return (
    <Tabs>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      {mostrarPerfilTab && (
        <Tabs.Screen
          name="Perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="Carrito"
        options={{
          title: "Carrito",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Logout"
        options={{
          title: "Logout",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="sign-out" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
