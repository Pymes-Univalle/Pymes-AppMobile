// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { COLOURS } from "../../config/Theme";
// import { Product } from "../../config/Models";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useFocusEffect } from "expo-router";
// import { router } from "expo-router";
// import axios from "axios";
// import Modal from "react-native-modal"; // npm install react-native-modal

// interface RequestData {
//   idCliente: number;
//   total: number;
//   detalleventas: {
//     idProducto: number;
//     cantidad: number;
//     nit: string;
//     precioUnitario: number;
//     importe: number;
//   }[];
// }

// const Carrito = () => {
//   const [product, setProduct] = useState([]);
//   const [total, setTotal] = useState(null);

//   const [isPopupVisible, setPopupVisible] = useState(false);
//   const [isLoading, setLoading] = useState(false);

//   const [cantidadesProductos, setCantidadesProductos] = useState([]);

//   useFocusEffect(
//     React.useCallback(() => {
//       getDataFromDB();
//     }, [])
//   );

//   //get data from local DB by ID
//   const getDataFromDB = async () => {
//     let items = await AsyncStorage.getItem("cartItems");
//     let products: Product[] = JSON.parse(items);
//     let productData = [];
//     if (products) {
//       console.log(products);
//       products.forEach((data) => {
//         if (products.includes(data)) {
//           productData.push(data);
//           return;
//         }
//       });
//       setProduct(productData);
//       getTotal(productData);
//     } else {
//       setProduct([]);
//       getTotal(false);
//     }
//   };

//   const incrementarCantidad = (idProducto) => {
//     setCantidadesProductos((prevCantidades) => {
//       const nuevoArray = [...prevCantidades];
//       const index = nuevoArray.findIndex(
//         (item) => item.idProducto === idProducto
//       );

//       if (index !== -1) {
//         nuevoArray[index].cantidad += 1;
//       } else {
//         nuevoArray.push({ idProducto, cantidad: 1 });
//       }

//       return nuevoArray;
//     });
//   };

//   const decrementarCantidad = (idProducto) => {
//     setCantidadesProductos((prevCantidades) => {
//       const nuevoArray = [...prevCantidades];
//       const index = nuevoArray.findIndex(
//         (item) => item.idProducto === idProducto
//       );

//       if (index !== -1 && nuevoArray[index].cantidad > 1) {
//         nuevoArray[index].cantidad -= 1;
//       }

//       return nuevoArray;
//     });
//   };

//   //get total price of all items in the cart
//   const getTotal = (productData) => {
//     let total = 0;
//     for (let index = 0; index < productData.length; index++) {
//       let productPrice = productData[index].precio;
//       total = Number(total) + Number(productPrice);
//     }
//     setTotal(total);
//   };

//   //remove data from Cart

//   const removeItemFromCart = async (id) => {
//     let array = await AsyncStorage.getItem("cartItems");
//     let itemArray: Product[] = JSON.parse(array);
//     if (itemArray) {
//       let array = itemArray;
//       for (let index = 0; index < array.length; index++) {
//         if (array[index].idProductos == id) {
//           array.splice(index, 1);
//         }

//         // Eliminar el producto del array cantidadProductos
//         const cantidadProductoIndex = cantidadesProductos.findIndex(
//           (producto) => producto.idProducto === id
//         );
//         if (cantidadProductoIndex !== -1) {
//           cantidadesProductos.splice(cantidadProductoIndex, 1);
//         }

//         await AsyncStorage.setItem("cartItems", JSON.stringify(array));
//         getDataFromDB();
//       }
//     }
//   };

//   const getCantidad = (idProducto) => {
//     const cantidadObj = cantidadesProductos.find(
//       (item) => item.idProducto === idProducto
//     );
//     return cantidadObj ? cantidadObj.cantidad : 1;
//   };

 

//   const checkOut = async () => {
//     setPopupVisible(true);
//   };

//   const handleAccept = async () => {
//     try {
//       setLoading(true);

//       const productos = JSON.parse(await AsyncStorage.getItem("cartItems"));
//       const idCliente = parseInt(await AsyncStorage.getItem("my-key"));

//       console.log("Entro a venta")
//       // Hacer la primera petición para registrar la venta
//       let ventaResponse;
//       try {
//         ventaResponse = await axios.post(
//           `http://${process.env.EXPO_PUBLIC_IP}:3000/api/venta`,
//           {
//             idCliente: idCliente,
//             total: total,
//             detalleventas: productos.map((producto) => {
//               const cantidadProducto = getCantidadProducto(producto.idProductos);
//               return {
//                 idProducto: producto.idProductos,
//                 cantidad: cantidadProducto,
//                 nit: "123456789", // Replace with the real value of nit
//                 precioUnitario: parseFloat(producto.precio),
//                 importe: parseFloat(producto.precio) * cantidadProducto,
//               };
//             }),
//           }
//         );
//       } catch (error) {
//         console.error("Error during the request", error);
//       } finally {
//         console.log("Request finished");
//       }

//       // Verificar que la venta fue exitosa antes de actualizar el stock
//       if (ventaResponse.status === 200) {
//         // Hacer la segunda petición para actualizar el stock de productos
//         console.log("Descuento inicado");
//         await Promise.all(
//           cantidadesProductos.map(async (cantidadProducto) => {
//             const cantidadNueva = cantidadProducto.cantidad;
//             const idProducto = cantidadProducto.idProducto;

//             await axios.put(
//               `http://${process.env.EXPO_PUBLIC_IP}:3000/api/venta/stock/${idProducto}`,
//               {
//                 cantidad: cantidadNueva,
//               }
//             );
//           })
//         );
//         setCantidadesProductos([]);

//         setLoading(false);
//         setPopupVisible(false);

//         await AsyncStorage.removeItem("cartItems");

//         alert("La compra fue realizada");

//         router.push("/Home");
//       } else {
//         // Manejar caso donde la venta no fue exitosa
//         setLoading(false);
//         setPopupVisible(false);
//         alert("Hubo un problema al procesar la venta");
//       }
//     } catch (error) {
//       setLoading(false);
//       setPopupVisible(false);
//       return error;
//     }
//   };

//   // Función para obtener la cantidad del producto desde el array cantidadesProductos
//   const getCantidadProducto = (idProducto) => {
//     const cantidadProducto = cantidadesProductos.find(
//       (producto) => producto.idProducto === idProducto
//     );
//     return cantidadProducto ? cantidadProducto.cantidad : 0; // Devolver 0 si no se encuentra el producto
//   };

//   const handleCancel = () => {
//     setPopupVisible(false);
//   };

//   const renderProducts = (data, index) => {
//     return (
//       <TouchableOpacity
//         key={index}
//         onPress={() =>
//           router.push({
//             pathname: "Detalles",
//             params: {
//               productId: data.idProductos,
//             },
//           })
//         }
//         style={{
//           width: "100%",
//           height: 100,
//           marginVertical: 6,
//           flexDirection: "row",
//           alignItems: "center",
//         }}
//       >
//         <View
//           style={{
//             width: "30%",
//             height: 100,
//             padding: 14,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: COLOURS.backgroundLight,
//             borderRadius: 10,
//             marginRight: 22,
//           }}
//         >
//           <Image
//             source={{ uri: data.ruta[0].ruta }}
//             style={{
//               width: "100%",
//               height: "100%",
//               resizeMode: "contain",
//             }}
//           />
//         </View>
//         <View
//           style={{
//             flex: 1,
//             height: "100%",
//             justifyContent: "space-around",
//           }}
//         >
//           <View style={{}}>
//             <Text
//               style={{
//                 fontSize: 14,
//                 maxWidth: "100%",
//                 color: COLOURS.black,
//                 fontWeight: "600",
//                 letterSpacing: 1,
//               }}
//             >
//               {data.nombre}
//             </Text>
//             <View
//               style={{
//                 marginTop: 4,
//                 flexDirection: "row",
//                 alignItems: "center",
//                 opacity: 0.6,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: "400",
//                   maxWidth: "85%",
//                   marginRight: 4,
//                 }}
//               >
//                 {data.precio + " Bs."}
//               </Text>
//               <Text>
//                 {/* (~&#8377;
//                 {data.productPrice + data.productPrice / 20}) */}
//               </Text>
//             </View>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <TouchableOpacity
//                 onPress={() => decrementarCantidad(data.idProductos)}
//                 style={{
//                   borderRadius: 100,
//                   marginRight: 20,
//                   padding: 4,
//                   borderWidth: 1,
//                   borderColor: COLOURS.backgroundMedium,
//                   opacity: 0.5,
//                 }}
//               >
//                 <MaterialCommunityIcons
//                   name="minus"
//                   style={{
//                     fontSize: 16,
//                     color: COLOURS.backgroundDark,
//                   }}
//                 />
//               </TouchableOpacity>
//               <Text>{getCantidad(data.idProductos)}</Text>
//               <TouchableOpacity
//                 onPress={() => incrementarCantidad(data.idProductos)}
//                 style={{
//                   borderRadius: 100,
//                   marginLeft: 20,
//                   padding: 4,
//                   borderWidth: 1,
//                   borderColor: COLOURS.backgroundMedium,
//                   opacity: 0.5,
//                 }}
//               >
//                 <MaterialCommunityIcons
//                   name="plus"
//                   style={{
//                     fontSize: 16,
//                     color: COLOURS.backgroundDark,
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//               onPress={() => removeItemFromCart(data.idProductos)}
//             >
//               <MaterialCommunityIcons
//                 name="delete-outline"
//                 style={{
//                   fontSize: 16,
//                   color: COLOURS.backgroundDark,
//                   backgroundColor: COLOURS.backgroundLight,
//                   padding: 8,
//                   borderRadius: 100,
//                 }}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View
//       style={{
//         width: "100%",
//         height: "100%",
//         backgroundColor: COLOURS.white,
//         position: "relative",
//       }}
//     >
//       <ScrollView>
        
//         <View style={{ paddingHorizontal: 16 }}>
//           {product.length > 0 ? (
//             product.map(renderProducts)
//           ) : (
//             <Text
//               style={{
//                 textAlign: "center",
//                 padding: 20,
//                 fontSize: 24,
//                 color: "#808080",
//                 fontWeight: "400",
//               }}
//             >
//               No tienes productos
//             </Text>
//           )}
//         </View>
//         <View>
          
//           <View
//             style={{
//               paddingHorizontal: 16,
//               marginVertical: 10,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 16,
//                 color: COLOURS.black,
//                 fontWeight: "500",
//                 letterSpacing: 1,
//                 marginBottom: 20,
//               }}
//             >
//               Método de pago
//             </Text>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   width: "80%",
//                   alignItems: "center",
//                 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: COLOURS.backgroundLight,
//                     alignItems: "center",
//                     justifyContent: "center",
//                     padding: 12,
//                     borderRadius: 10,
//                     marginRight: 18,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 10,
//                       fontWeight: "900",
//                       color: COLOURS.blue,
//                       letterSpacing: 1,
//                     }}
//                   >
//                     VISA
//                   </Text>
//                 </View>
//                 <View>
//                   <Text
//                     style={{
//                       fontSize: 14,
//                       color: COLOURS.black,
//                       fontWeight: "500",
//                     }}
//                   >
//                     Tarjeta
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       color: COLOURS.black,
//                       fontWeight: "400",
//                       lineHeight: 20,
//                       opacity: 0.5,
//                     }}
//                   >
//                     **-9092
//                   </Text>
//                 </View>
//               </View>
//               <MaterialCommunityIcons
//                 name="chevron-right"
//                 style={{ fontSize: 22, color: COLOURS.black }}
//               />
//             </View>
//           </View>
//           <View
//             style={{
//               paddingHorizontal: 16,
//               marginTop: 40,
//               marginBottom: 80,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 16,
//                 color: COLOURS.black,
//                 fontWeight: "500",
//                 letterSpacing: 1,
//                 marginBottom: 20,
//               }}
//             >
//               Información
//             </Text>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: 8,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontWeight: "400",
//                   maxWidth: "80%",
//                   color: COLOURS.black,
//                   opacity: 0.5,
//                 }}
//               >
//                 Subtotal
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontWeight: "400",
//                   color: COLOURS.black,
//                   opacity: 0.8,
//                 }}
//               >
//                 {total}.00 Bs.
//               </Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: 22,
//               }}
//             >
              
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontWeight: "400",
//                   maxWidth: "80%",
//                   color: COLOURS.black,
//                   opacity: 0.5,
//                 }}
//               >
//                 Total
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   fontWeight: "500",
//                   color: COLOURS.black,
//                 }}
//               >
//                 {total} Bs.
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       <View
//         style={{
//           position: "absolute",
//           bottom: 10,
//           height: "8%",
//           width: "100%",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => (total != 0 ? checkOut() : null)}
//           style={{
//             width: "86%",
//             height: "90%",
//             backgroundColor: COLOURS.blueText,
//             borderRadius: 20,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 12,
//               fontWeight: "500",
//               letterSpacing: 1,
//               color: COLOURS.white,
//               textTransform: "uppercase",
//             }}
//           >
//             COMPRAR ({total + " Bs."})
//           </Text>
//         </TouchableOpacity>

//         <Modal animationInTiming={500} isVisible={isPopupVisible}>
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <MaterialCommunityIcons
//                 name="shopping"
//                 size={50}
//                 color="#2196F3"
//                 style={styles.icon}
//               />
//               <Text style={styles.modalText}>
//                 ¿Desea realizar la compra por {total} Bs.?
//               </Text>
//               {isLoading ? (
//                 <ActivityIndicator size="large" color="#2196F3" />
//               ) : (
//                 <View style={styles.buttonContainer}>
//                   <Pressable
//                     style={[styles.button, styles.buttonClose]}
//                     onPress={handleCancel}
//                   >
//                     <Text style={styles.textStyle}>Cancelar</Text>
//                   </Pressable>
//                   <Pressable
//                     style={[styles.button, styles.buttonOpen]}
//                     onPress={handleAccept}
//                   >
//                     <Text style={styles.textStyle}>Comprar</Text>
//                   </Pressable>
//                 </View>
//               )}
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   icon: {
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",

//     width: "100%",
//     alignContent: "center",
//   },
//   button: {
//     borderRadius: 20,
//     padding: 15,
//     elevation: 2,
//     margin: 10,
//   },
//   buttonOpen: {
//     backgroundColor: "#2196F3",
//   },
//   buttonClose: {
//     backgroundColor: "#9b9b9b",
//   },
//   textStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   modalText: {
//     marginBottom: 20,
//     textAlign: "center",
//   },
// });
// export default Carrito;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLOURS } from "../../config/Theme";
import { Product } from "../../config/Models";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import axios from "axios";
import Modal from "react-native-modal"; // npm install react-native-modal

interface RequestData {
  idCliente: number;
  total: number;
  detalleventas: {
    idProducto: number;
    cantidad: number;
    nit: string;
    precioUnitario: number;
    importe: number;
  }[];
}

const Carrito = () => {
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(null);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [cantidadesProductos, setCantidadesProductos] = useState([]);

  useFocusEffect(
  React.useCallback(() => {
    const calculateTotal = async () => {
      let items = await AsyncStorage.getItem("cartItems");
      setProduct(JSON.parse(items));
      let products: Product[] = JSON.parse(items);
      let total = 0;
      if (products) {
        total = products.reduce((acc, product) => {
          const productPrice = parseFloat(product.precio);
          const cantidad = getCantidad(product.idProductos);
          return acc + (productPrice * cantidad);
        }, 0);
      }
      setTotal(total.toFixed(2));
    };

    calculateTotal();
  }, [])
);

  //get data from local DB by ID
  const getDataFromDB = async () => {
    let items = await AsyncStorage.getItem("cartItems");
    let products: Product[] = JSON.parse(items);
    let productData = [];
    if (products) {
      console.log(products);
      products.forEach((data) => {
        if (products.includes(data)) {
          productData.push(data);
          return;
        }
      });
      setProduct(productData);
      getTotal(productData);
    } else {
      setProduct([]);
      getTotal(false);
    }
  };

  const incrementarCantidad = (idProducto) => {
    setCantidadesProductos((prevCantidades) => {
      const nuevoArray = [...prevCantidades];
      const index = nuevoArray.findIndex(
        (item) => item.idProducto === idProducto
      );
  
      if (index !== -1) {
        nuevoArray[index].cantidad += 1;
      } else {
        nuevoArray.push({ idProducto, cantidad: 1 });
      }
  
      getTotal(product.map(product => ({...product, cantidad: getCantidad(product.idProductos)}))); // Recalcular el total
      return nuevoArray;
    });
  };
  
  const decrementarCantidad = (idProducto) => {
    setCantidadesProductos((prevCantidades) => {
      const nuevoArray = [...prevCantidades];
      const index = nuevoArray.findIndex(
        (item) => item.idProducto === idProducto
      );
  
      if (index !== -1 && nuevoArray[index].cantidad > 1) {
        nuevoArray[index].cantidad -= 1;
      }
  
      getTotal(product.map(product => ({...product, cantidad: getCantidad(product.idProductos)}))); // Recalcular el total
      return nuevoArray;
    });
  };

  //get total price of all items in the cart
  // Función para obtener el total considerando las cantidades de los productos
const getTotal = (productData) => {
  let total = 0;
  if (productData && productData.length > 0) {
    total = productData.reduce((acc, product) => {
      const productPrice = parseFloat(product.precio);
      const cantidad = getCantidad(product.idProductos);
      return acc + (productPrice * cantidad);
    }, 0);
  }
  setTotal(total.toFixed(2)); // Actualizar el estado del total
};


  //remove data from Cart

  const removeItemFromCart = async (id) => {
    let array = await AsyncStorage.getItem("cartItems");
    let itemArray: Product[] = JSON.parse(array);
    if (itemArray) {
      let array = itemArray;
      for (let index = 0; index < array.length; index++) {
        if (array[index].idProductos == id) {
          array.splice(index, 1);
        }

        // Eliminar el producto del array cantidadProductos
        const cantidadProductoIndex = cantidadesProductos.findIndex(
          (producto) => producto.idProducto === id
        );
        if (cantidadProductoIndex !== -1) {
          cantidadesProductos.splice(cantidadProductoIndex, 1);
        }

        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        getDataFromDB();
      }
    }
  };

  const getCantidad = (idProducto) => {
    const cantidadObj = cantidadesProductos.find(
      (item) => item.idProducto === idProducto
    );
    return cantidadObj ? cantidadObj.cantidad : 1;
  };

 

  const checkOut = async () => {
    setPopupVisible(true);
  };

  const handleAccept = async () => {
    try {
      setLoading(true);

      const productos = JSON.parse(await AsyncStorage.getItem("cartItems"));
      const idCliente = parseInt(await AsyncStorage.getItem("my-key"));

      console.log("Entro a venta")
      // Hacer la primera petición para registrar la venta
      let ventaResponse;
      try {
        ventaResponse = await axios.post(
          `http://${process.env.EXPO_PUBLIC_IP}:3000/api/venta`,
          {
            idCliente: idCliente,
            total: total,
            detalleventas: productos.map((producto) => {
              const cantidadProducto = getCantidadProducto(producto.idProductos);
              return {
                idProducto: producto.idProductos,
                cantidad: cantidadProducto,
                nit: "123456789", // Replace with the real value of nit
                precioUnitario: parseFloat(producto.precio),
                importe: parseFloat(producto.precio) * cantidadProducto,
              };
            }),
          }
        );
      } catch (error) {
        console.error("Error during the request", error);
      } finally {
        console.log("Request finished");
      }

      // Verificar que la venta fue exitosa antes de actualizar el stock
      if (ventaResponse.status === 200) {
        // Hacer la segunda petición para actualizar el stock de productos
        console.log("Descuento inicado");
        await Promise.all(
          cantidadesProductos.map(async (cantidadProducto) => {
            const cantidadNueva = cantidadProducto.cantidad;
            const idProducto = cantidadProducto.idProducto;

            await axios.put(
              `http://${process.env.EXPO_PUBLIC_IP}:3000/api/venta/stock/${idProducto}`,
              {
                cantidad: cantidadNueva,
              }
            );
          })
        );
        setCantidadesProductos([]);

        setLoading(false);
        setPopupVisible(false);

        await AsyncStorage.removeItem("cartItems");

        alert("La compra fue realizada");

        router.push("/Home");
      } else {
        // Manejar caso donde la venta no fue exitosa
        setLoading(false);
        setPopupVisible(false);
        alert("Hubo un problema al procesar la venta");
      }
    } catch (error) {
      setLoading(false);
      setPopupVisible(false);
      return error;
    }
  };

  // Función para obtener la cantidad del producto desde el array cantidadesProductos
  const getCantidadProducto = (idProducto) => {
    const cantidadProducto = cantidadesProductos.find(
      (producto) => producto.idProducto === idProducto
    );
    return cantidadProducto ? cantidadProducto.cantidad : 0; // Devolver 0 si no se encuentra el producto
  };

  const handleCancel = () => {
    setPopupVisible(false);
  };

  const renderProducts = (data, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          router.push({
            pathname: "Detalles",
            params: {
              productId: data.idProductos,
            },
          })
        }
        style={{
          width: "100%",
          height: 100,
          marginVertical: 6,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            height: 100,
            padding: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLOURS.backgroundLight,
            borderRadius: 10,
            marginRight: 22,
          }}
        >
          <Image
            source={{ uri: data.ruta[0].ruta }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-around",
          }}
        >
          <View style={{}}>
            <Text
              style={{
                fontSize: 14,
                maxWidth: "100%",
                color: COLOURS.black,
                fontWeight: "600",
                letterSpacing: 1,
              }}
            >
              {data.nombre}
            </Text>
            <View
              style={{
                marginTop: 4,
                flexDirection: "row",
                alignItems: "center",
                opacity: 0.6,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  maxWidth: "85%",
                  marginRight: 4,
                }}
              >
                {data.precio + " Bs."}
              </Text>
              <Text>
                {/* (~&#8377;
                {data.productPrice + data.productPrice / 20}) */}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => decrementarCantidad(data.idProductos)}
                style={{
                  borderRadius: 100,
                  marginRight: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: COLOURS.backgroundMedium,
                  opacity: 0.5,
                }}
              >
                <MaterialCommunityIcons
                  name="minus"
                  style={{
                    fontSize: 16,
                    color: COLOURS.backgroundDark,
                  }}
                />
              </TouchableOpacity>
              <Text>{getCantidad(data.idProductos)}</Text>
              <TouchableOpacity
                onPress={() => incrementarCantidad(data.idProductos)}
                style={{
                  borderRadius: 100,
                  marginLeft: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: COLOURS.backgroundMedium,
                  opacity: 0.5,
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  style={{
                    fontSize: 16,
                    color: COLOURS.backgroundDark,
                  }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => removeItemFromCart(data.idProductos)}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                style={{
                  fontSize: 16,
                  color: COLOURS.backgroundDark,
                  backgroundColor: COLOURS.backgroundLight,
                  padding: 8,
                  borderRadius: 100,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: COLOURS.white,
        position: "relative",
      }}
    >
      <ScrollView>
        
        <View style={{ paddingHorizontal: 16 }}>
          {product.length > 0 ? (
            product.map(renderProducts)
          ) : (
            <Text
              style={{
                textAlign: "center",
                padding: 20,
                fontSize: 24,
                color: "#808080",
                fontWeight: "400",
              }}
            >
              No tienes productos
            </Text>
          )}
        </View>
        <View>
          
          <View
            style={{
              paddingHorizontal: 16,
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLOURS.black,
                fontWeight: "500",
                letterSpacing: 1,
                marginBottom: 20,
              }}
            >
              Método de pago
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "80%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: COLOURS.backgroundLight,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    borderRadius: 10,
                    marginRight: 18,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "900",
                      color: COLOURS.blue,
                      letterSpacing: 1,
                    }}
                  >
                    VISA
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: "500",
                    }}
                  >
                    Tarjeta
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLOURS.black,
                      fontWeight: "400",
                      lineHeight: 20,
                      opacity: 0.5,
                    }}
                  >
                    **-9092
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                style={{ fontSize: 22, color: COLOURS.black }}
              />
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              marginTop: 40,
              marginBottom: 80,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLOURS.black,
                fontWeight: "500",
                letterSpacing: 1,
                marginBottom: 20,
              }}
            >
              Información
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  maxWidth: "80%",
                  color: COLOURS.black,
                  opacity: 0.5,
                }}
              >
                Subtotal
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: COLOURS.black,
                  opacity: 0.8,
                }}
              >
                {total} Bs.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  maxWidth: "80%",
                  color: COLOURS.black,
                  opacity: 0.5,
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: COLOURS.black,
                }}
              >
                {total} Bs.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 10,
          height: "8%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => (total != 0 ? checkOut() : null)}
          style={{
            width: "86%",
            height: "90%",
            backgroundColor: COLOURS.blueText,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              letterSpacing: 1,
              color: COLOURS.white,
              textTransform: "uppercase",
            }}
          >
            COMPRAR ({total + " Bs."})
          </Text>
        </TouchableOpacity>

        <Modal animationInTiming={500} isVisible={isPopupVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <MaterialCommunityIcons
                name="shopping"
                size={50}
                color="#2196F3"
                style={styles.icon}
              />
              <Text style={styles.modalText}>
                ¿Desea realizar la compra por {total} Bs.?
              </Text>
              {isLoading ? (
                <ActivityIndicator size="large" color="#2196F3" />
              ) : (
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.textStyle}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={handleAccept}
                  >
                    <Text style={styles.textStyle}>Comprar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",

    width: "100%",
    alignContent: "center",
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#9b9b9b",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
});
export default Carrito;