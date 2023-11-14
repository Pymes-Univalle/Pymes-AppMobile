import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useFonts } from "expo-font";
  import fonts from "../../config/Fonts";
  import Colors from "../../config/Colors";
  import axios from "axios";
  import Modal from "react-native-modal";
  import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

  const router = useRouter();
  
  interface User {
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena: string;
    celular: string;
    estado: number;
  
    fechaActualizacion: Date;
  }
  
  interface Cliente {
    direccion: string;
  }
  
  const UpdateData = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [fontsLoaded] = useFonts(fonts);
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [celular, setCelular] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [direccion, setDireccion] = useState("");
    const [cliente, setCliente] = useState(null);
  
    const [nombresError, setNombresError] = useState(false);
    const [apellidosError, setApellidosError] = useState(false);
    const [correoError, setCorreoError] = useState(false);
    const [celularError, setCelularError] = useState(false);
    const [direccionError, setDireccionError] = useState(false);
  
    useState(false);
  
    const closeModal = () => {
      setModalVisible(false);
  
      router.push("Perfil");
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const id = await AsyncStorage.getItem('my-key');
          const response = await axios.get(
            `http://${process.env.EXPO_PUBLIC_IP}:3000/api/cliente/${id}`
          );
          if (response.status === 200) {
            const data = await response.data;
            const clienteData = await data.cliente;
            setCliente(clienteData);
  
            setNombres(clienteData["usuario"]["nombre"] || "");
            setApellidos(clienteData["usuario"]["apellido"] || "");
            setCorreo(clienteData["usuario"]["correo"] || "");
            setContrasena(clienteData["usuario"]["contrasena"] || "");
            setCelular(clienteData["usuario"]["celular"] || "");
            setDireccion(clienteData["direccion"] || "");
          } else {
            console.error(response.status);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []);
  
    const handleSubmit = async () => {
      if (
        nombres.trim() !== "" &&
        apellidos.trim() !== "" &&
        correo.trim() !== "" &&
        celular.trim() !== "" &&
        direccion.trim() !== ""
      ) {
        setNombresError(false);
        setApellidosError(false);
        setCorreoError(false);
        setCelularError(false);
        setDireccionError(false);
  
        const user: User = {
          nombres,
          apellidos,
          correo,
          contrasena,
          celular,
          estado: 1,
  
          fechaActualizacion: new Date(),
        };
  
        const cliente: Cliente = {
          direccion,
        };
  
        try {
          const id = await AsyncStorage.getItem('my-key');
          const resp = await axios.put(
            `http://192.168.0.100:3000/api/cliente/${id}`,
            {
              nombre: user.nombres,
  
              correo: user.correo,
              apellido: user.apellidos,
              contrasena: user.contrasena,
              celular: user.celular,
              direccion: cliente.direccion,
            }
          );
          if (resp.status === 200) {
            setModalVisible(true);
          }
        } catch (error: any) {
          console.log("Error: ", error);
        }
      } else {
        if (nombres.trim() === "") {
          setNombresError(true);
        } else {
          setNombresError(false);
        }
        if (apellidos.trim() === "") {
          setApellidosError(true);
        } else {
          setApellidosError(false);
        }
        if (correo.trim() === "") {
          setCorreoError(true);
        } else {
          setCorreoError(false);
        }
        if (celular.trim() === "") {
          setCelularError(true);
        } else {
          setCelularError(false);
        }
        if (direccion.trim() === "") {
          setDireccionError(true);
        } else {
          setDireccionError(false);
        }
      }
    };
    return (
      <ScrollView>
        <Stack.Screen options={{headerTitle: "Datos"}}></Stack.Screen>
        <SafeAreaView>
          <View
            style={{
              padding: 20,
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <View
              style={{
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  color: Colors.primary,
                  fontFamily: "poppins-bold",
                }}
              >
                Actualiza tus datos
              </Text>
            </View>
            <View
              style={{
                marginVertical: 20,
              }}
            >
              <TextInput
                placeholderTextColor={Colors.darkText}
                placeholder="Nombres"
                style={[styles.input, nombresError && styles.inputError]}
                value={nombres}
                onChangeText={(text) => setNombres(text)}
              />
              <Text style={styles.errorText}>
                {nombresError && "El nombre es obligatorio"}
              </Text>
              <TextInput
                placeholderTextColor={Colors.darkText}
                placeholder="Apellidos"
                style={[styles.input, apellidosError && styles.inputError]}
                value={apellidos}
                onChangeText={(text) => setApellidos(text)}
              />
              <Text style={styles.errorText}>
                {apellidosError && "El apellido es obligatorio"}
              </Text>
              <TextInput
                placeholderTextColor={Colors.darkText}
                placeholder="Correo Electrónico"
                style={[styles.input, correoError && styles.inputError]}
                value={correo}
                onChangeText={(text) => setCorreo(text)}
              />
              <Text style={styles.errorText}>
                {correoError && "El correo electrónico es obligatorio"}
              </Text>
              <TextInput
                placeholderTextColor={Colors.darkText}
                placeholder="Celular"
                keyboardType="numeric"
                style={[styles.input, celularError && styles.inputError]}
                value={celular}
                onChangeText={(text) => setCelular(text)}
              />
              <Text style={styles.errorText}>
                {celularError && "El celular es obligatorio"}
              </Text>
              <TextInput
                placeholderTextColor={Colors.darkText}
                placeholder="Dirección"
                style={[styles.input, direccionError && styles.inputError]}
                value={direccion}
                onChangeText={(text) => setDireccion(text)}
              />
              <Text style={styles.errorText}>
                {direccionError && "La dirección es obligatoria"}
              </Text>
            </View>
            <View
              style={{
                marginTop: 5,
              }}
            >
              <View style={{ marginVertical: 5 }}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    padding: 20,
                    backgroundColor: Colors.primary,
                    marginBottom: 10,
                    borderRadius: 30,
                    shadowColor: Colors.primary,
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: "poppins-bold",
                    }}
                  >
                    Actualizar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Modal de registro exitoso */}
          <Modal
            isVisible={isModalVisible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={1000}
            animationOutTiming={1000}
          >
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 40,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "poppins-regular",
                    marginBottom: 10,
                    fontSize: 16,
                  }}
                >
                  Datos actualizados correctamente
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    backgroundColor: Colors.success,
                    marginBottom: 10,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={closeModal}
                >
                  <Text style={{ fontFamily: "poppins-regular", color: "white" }}>
                    Aceptar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    );
  };
  export default UpdateData;
  const styles = StyleSheet.create({
    input: {
      fontSize: 14,
      padding: 15,
      backgroundColor: Colors.lightPrimary,
      borderRadius: 30,
      marginVertical: 5,
      fontFamily: "poppins-regular",
    },
    inputError: {
      borderColor: "red", // Puedes cambiar el color del borde o el estilo que desees.
      borderWidth: 1,
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginLeft: 10,
    },
  });
  