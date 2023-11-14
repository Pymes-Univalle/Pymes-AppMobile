import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CardImage } from './Car';

interface Product {
  idProductos: number;
  nombre: string;
  precio: string;
  descripcion: string;
  idCategoria: number;
  cantidad: number;
  idProductor: number;
  estado: number;
  fechaRegistro: string;
  fechaActualizacion: string;
  fechaVencimiento: string;
  ruta: { ruta: string }[];
}

const MyCart = ({ product }: { product: Product }) => {
  console.log(product.nombre)
  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        width: '48%',
        marginVertical: 14,
      }}
    >
      <View
        style={{
          width: '100%',
          height: 100,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
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
              `${product.ruta[0].ruta}`,
          }}
          style={{
            width: '80%',
            height: '80%',
            resizeMode: 'contain',
          }}
        />
      </View>
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
        true ? (
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
                color: '#00FF00',
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: '#006600',
              }}
            >
              Available
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
              Unavailable
            </Text>
          </View>
        )
      ) : null}
      <Text>{product.precio} Bs.</Text>
    </TouchableOpacity>
  );
};

export default MyCart;