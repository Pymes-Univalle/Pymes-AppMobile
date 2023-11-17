import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import MyCart from '../../components/MyCart';
import { Product } from '../../config/Models';
import { COLOURS } from '../../config/Theme';
import Colors from '../../config/Colors';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const setCart = async () => {
  await AsyncStorage.removeItem('cartItems');
}

const Home = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<{ [key: number]: Product[] }>({});
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ id: number | null, name: string | null }>({ id: null, name: null });
  useEffect(() => {
    axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/api/productor/productos/2`)
      .then(response => {
        setProductos(response.data.productos);
        console.log(response.data.productos);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setCart();
    setSelectedCategory(null);
  }, []);

  useEffect(() => {
    const categorized = productos.reduce<{ [key: number]: Product[] }>((acc, product) => {
      if (acc[product.idCategoria]) {
        acc[product.idCategoria].push(product);
      } else {
        acc[product.idCategoria] = [product];
      }
      return acc;
    }, {});
    setCategorizedProducts(categorized);
  }, [productos]);

  const filteredProducts = productos.filter(producto => {
    return producto.nombre.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleCategoryPress = (categoryId: number, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
  };

  return (
    <ScrollView style={{ paddingTop: 10 }}>
      <Stack.Screen options={{ headerTitle: "Inicio" }}></Stack.Screen>
      <View
        style={{
          marginVertical: 5,
          marginHorizontal: 15,
          padding: 20,
          backgroundColor: COLOURS.darkGray,
          borderWidth: 1,
          borderRadius: 30,
        }}>
        <View>
          <Text
            style={{
              fontSize: 26,
              color: COLOURS.white,
              fontWeight: '500',
              letterSpacing: 1,
              marginBottom: 10,
              marginTop: 5
            }}>
            PYMES
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLOURS.grayInput,
              fontWeight: '400',
              letterSpacing: 1,
              lineHeight: 24,
            }}>
            Encuentra todo lo que necesitas,
            {'\n'}de forma rápida y con los mejores precios.
          </Text>
          {/* Buscador aqui */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 15,
            paddingRight: 10
          }}><TextInput
              style={{
                padding: 16,
                backgroundColor: COLOURS.grayInput,
                borderRadius: 20,
                color: Colors.darkText,
                width: '70%'
              }}
              placeholderTextColor={Colors.darkText}
              placeholder="Buscar"
              value={searchText}
              onChangeText={text => setSearchText(text)}
            /><FontAwesome name="search" size={30} color={COLOURS.grayInput}/></View>
        </View>
      </View>
      {searchText ? (
        <View
          style={{
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: COLOURS.black,
                fontWeight: '500',
                letterSpacing: 1,
              }}
            >
              Productos Filtrados
            </Text>
            <Pressable style={{
              backgroundColor: COLOURS.blueText,
              paddingHorizontal: 10,
              paddingVertical: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20
            }} onPress={() => setSearchText('')}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.white,
                  fontWeight: '400'
                }}
              >
                Volver
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}
          >
            {filteredProducts.map((producto: Product, index: number) => (
              <MyCart key={index} product={producto} ></MyCart>
            ))}
          </View>
        </View>
      ) : (
        selectedCategory !== null ? (
          <View
            style={{
              marginVertical: 7,
              marginHorizontal: 15
            }}
            key={selectedCategory.id}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: COLOURS.black,
                    fontWeight: '500',
                    letterSpacing: 1,
                  }}
                >
                  {selectedCategory.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLOURS.black,
                    fontWeight: '400',
                    opacity: 0.5,
                    marginLeft: 10,
                  }}
                >
                  {categorizedProducts[selectedCategory.id]?.length}
                </Text>
              </View>
              <Pressable style={{
                backgroundColor: COLOURS.blueText,
                paddingHorizontal: 10,
                paddingVertical: 7,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20
              }} onPress={() => setSelectedCategory(null)}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLOURS.white,
                    fontWeight: '400',
                  }}
                >
                  Volver
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}
            >
              {categorizedProducts[selectedCategory.id]?.map((producto: Product, index: number) => (
                <MyCart key={index} product={producto} ></MyCart>
              ))}
            </View>
          </View>
        ) : (
          Object.entries(categorizedProducts).map(([categoryId, products]) => (
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 7
              }}
              key={categoryId}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLOURS.black,
                      fontWeight: '500',
                      letterSpacing: 1,
                    }}
                  >
                    {categorizedProducts[categoryId][0]?.categoria?.nombre || 'No Category Name'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: '400',
                      opacity: 0.5,
                      marginLeft: 10,
                    }}
                  >
                    {products.length}
                  </Text>
                </View>
                <Pressable
                  style={{
                    backgroundColor: COLOURS.blueText,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}
                  onPress={() => handleCategoryPress(Number(categoryId), categorizedProducts[categoryId][0]?.categoria?.nombre || '')}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.white,
                      fontWeight: '400',
                    }}
                  >
                    Ver Todos
                  </Text>
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                }}
              >
                {products.slice(0, 2).map((producto: Product, index: number) => (
                  <MyCart key={index} product={producto} />
                ))}
              </View>
            </View>
          ))
        )
      )}
    </ScrollView>
  );
}

export default Home;

