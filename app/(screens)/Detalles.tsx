import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
  ToastAndroid,
} from 'react-native';
import { COLOURS } from '../../config/Theme';
import { Product } from '../../config/Models';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Stack, router } from 'expo-router';
import { useRoute, Route } from '@react-navigation/native';
import Colors from '../../config/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProductInfo = () => {
  const route = useRoute<Route<string, { productId?: number }>>();

  const productId = route.params?.productId;

  const [product, setProduct] = useState<Product | undefined>();

  const width = Dimensions.get('window').width;

  const scrollX = new Animated.Value(0);

  let position = Animated.divide(scrollX, width);

  useEffect(() => {
    //const item = useLocalSearchParams();
    //console.log(item);
    getDataFromDB();
    //setIdProducto(2);

    //return unsubscribe;
  }, []);

  //get product data by productID

  const getDataFromDB = async () => {
    // for (let index = 0; index < Items.length; index++) {
    //   if (Items[index].id == productID) {
    //     await setProduct(Items[index]);
    //     return;
    //   }
    // }
    try {
      //const id = await AsyncStorage.getItem('my-key');
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_IP+':'+process.env.EXPO_PUBLIC_PORT}/api/producto/${productId}`
      );
      if (response.status === 200) {
        const productData = await response.data.productos;
        setProduct(productData);
      } else {
        console.error(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //add to cart

  const addToCart = async (product: Product) => {
    const id = await AsyncStorage.getItem('my-key');
    if (!id) {
      router.push("/Login");
      return;
    }

    let itemArray = await AsyncStorage.getItem('cartItems');
    if (itemArray) {
      let array: Product[] = JSON.parse(itemArray);
      console.log(array);
      array.push(product);

      try {
        await AsyncStorage.setItem('cartItems', JSON.stringify(array));
        alert("Item Added Successfully to cart");
        router.push('Home');
      } catch (error) {
        return error;
      }
    } else {
      let array = [];
      array.push(product);
      try {
        await AsyncStorage.setItem('cartItems', JSON.stringify(array));
        router.push('Home');
      } catch (error) {
        return error;
      }
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOURS.backgroundLight,
        position: 'relative',
      }}>
      <Stack.Screen options={{ headerTitle: "Detalles" }}></Stack.Screen>
      <StatusBar
        backgroundColor={COLOURS.backgroundLight}
        barStyle="dark-content"
      />
      <ScrollView>
        <View
          style={{
            width: '100%',
            backgroundColor: COLOURS.white,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 4,
          }}>
          <FlatList
            data={product && product.ruta}
            horizontal
            renderItem={({ item }) => (
              <View
                style={{
                  width: width,
                  height: 240,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={{ uri: item.ruta }} // Accede a la URL de la imagen utilizando item.ruta
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.8}
            snapToInterval={width}
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              marginTop: 32,
            }}>
            {product
              && product.ruta.map((data, index) => {
                let opacity = position.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [0.2, 1, 0.2],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={index}
                    style={{
                      width: '16%',
                      height: 2.4,
                      backgroundColor: COLOURS.black,
                      opacity,
                      marginHorizontal: 4,
                      borderRadius: 100,
                    }}></Animated.View>
                );
              })
            }
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 25,
            marginTop: 6,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 14,
            }}>
            <Entypo
              name="shopping-cart"
              style={{
                fontSize: 18,
                color: COLOURS.blue,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: COLOURS.black,
                marginLeft: 10
              }}>
              {product?.categoria.nombre}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 4,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '600',
                letterSpacing: 0.5,
                marginVertical: 4,
                color: COLOURS.black,
                maxWidth: '84%',
              }}>
              {product && product.nombre}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: COLOURS.black,
              fontWeight: '400',
              letterSpacing: 1,
              opacity: 0.5,
              lineHeight: 20,
              maxWidth: '85%',
              maxHeight: 44,
              marginBottom: 18,
            }}>
            {product && product.descripcion}
          </Text>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 14,
              borderBottomColor: COLOURS.backgroundLight,
              borderBottomWidth: 1,
              paddingBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '80%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  //color: COLOURS.blue,
                  backgroundColor: COLOURS.backgroundLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderRadius: 100,
                  marginRight: 10,
                }}>
                <FontAwesome
                  name='money'
                  style={{
                    fontSize: 16,
                    color: COLOURS.blue,
                  }}
                ></FontAwesome>
              </View>
              <Text> Rustaveli Ave 57,{'\n'}17-001, Batume</Text>
            </View>
          </View> */}
          <View style={{ flexDirection: 'row' }}>
            {product?.atributo?.map((atributo, index) => (
              <View key={index} style={{ marginRight: 10, backgroundColor: COLOURS.darkGray, padding: 15, borderRadius:10, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: COLOURS.white }}>{atributo?.nombre}</Text>
                <Text style={{ color: COLOURS.white }}>{atributo?.valor}</Text>
              </View>
            ))}
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '500',
                maxWidth: '85%',
                color: COLOURS.black,
                marginBottom: 4,
              }}>
              {product && product.precio}.00 Bs.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 10,
          height: '8%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => { product.cantidad > 0 ? addToCart(product) : alert("Producto no disponible por el momento") }}
          style={{
            marginBottom: 30,
            width: '86%',
            height: '90%',
            backgroundColor: product && product.cantidad > 0 ? COLOURS.blue : COLOURS.backgroundMedium,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              letterSpacing: 1,
              color: COLOURS.white,
              textTransform: 'uppercase',
            }}>
            {product && product.cantidad > 0 ? 'Añadir al Carrito' : 'No disponible'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductInfo;


