import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CardImage } from './Car';
import { router } from 'expo-router';
import { Product } from '../config/Models';

const MyCart = ({ product }: { product: Product }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: "/Detalles",
        params: {
          productId: product.idProductos
        }
      })}
      style={{
        width: '48%',
        marginVertical: 14,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
      }}
    >
      <View
        style={{
          width: '100%',
          height: 100,
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        {/* {true ? (
          <View
            style={{
              position: 'absolute',
              width: '20%',
              height: '24%',
              backgroundColor: '#00FF00',
              top: 0,
              left: 0,
              borderTopLeftRadius: 10,
              borderBottomRightRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: '#FFFFFF',
                fontWeight: 'bold',
                letterSpacing: 1,
              }}
            >
              50%
            </Text>
          </View>
        ) : null} */}
        <CardImage
          source={{
            uri:
              `${product ? product.ruta[product.mainIndex].ruta: 'https://media.istockphoto.com/id/1454848933/es/vector/imagen-no-encontrada-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=0PasC0voizz58oKVgHOtrxOoJ-J8kznoisFbdyMfBkU='}`,
          }}
          style={{
            width: '80%',
            height: '80%',
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={{ marginLeft: 20, marginBottom: 15}}>
        <Text
          style={{
            fontSize: 12,
            color: '#000000',
            fontWeight: '600',
            marginBottom: 2,
          }}
        >
          {product.nombre}
        </Text>
        {'accessory' == 'accessory' ? (
          product.cantidad > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FontAwesome
                name="circle"
                style={{
                  fontSize: 12,
                  marginRight: 6,
                  color: '#00AA00',
                  marginVertical: 5
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: '#006600',
                }}
              >
                Disponible
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FontAwesome
                name="circle"
                style={{
                  fontSize: 12,
                  marginRight: 6,
                  color: '#FF0000',
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: '#FF0000',
                }}
              >
                No disponible
              </Text>
            </View>
          )
        ) : null}
        <Text>{product.precio} Bs.</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyCart;