import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import MyCart from '../../components/MyCart';
import { Product } from '../../config/Models';

const setCart = async () => {
  await AsyncStorage.removeItem('cartItems');
}

const Home = () => {
  const [productos, setProductos] = useState<Product[]>([]);

  useEffect(() => {
    axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/api/productor/productos/2`)
      .then(response => {
        setProductos(response.data.productos);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setCart();
  });

  return (
    <ScrollView style={{ paddingTop: 10 }}>
      <Stack.Screen options={{ headerTitle: "Home" }}></Stack.Screen>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {productos.map((producto: Product, index: number) => (
          <Pressable style={{  }} key={producto.idProductos} onPress={() => router.push({
            pathname: "/Detalles",
            params: {
              productId: producto.idProductos
            }
          })}>
            <MyCart key={index} product={producto} ></MyCart>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

export default Home;
