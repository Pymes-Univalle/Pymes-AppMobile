import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppRegistry,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../config/Colors";
import axios from "axios";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const router = useRouter();

const Perfil = () => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [direccion, setDireccion] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleConfirm, setModalVisibleConfirm] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const id = await AsyncStorage.getItem("my-key");
          const response = await axios.get(
            `http://192.168.0.100:3000/api/cliente/${id}`
          );
          if (response.status === 200) {
            const data = await response.data;
            const clienteData = await data.cliente;

            setNombres(clienteData["usuario"]["nombre"] || "");
            setApellidos(clienteData["usuario"]["apellido"] || "");
            setCorreo(clienteData["usuario"]["correo"] || "");
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
    }, [])
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  const deleteCliente = async () => {
    try {
      const id = await AsyncStorage.getItem("my-key");
      const response = await axios.delete(
        `http://${process.env.EXPO_PUBLIC_IP}:3000/api/cliente/${id}`,
        {
          data: {
            estado: 0,
            fechaActualizacion: new Date(),
          },
        }
      );

      if (response.status === 200) {
        //navigation.navigate("Login");
        setModalVisible(false);
        setModalVisibleConfirm(true);
      } else {
        console.error("Error al actualizar:", response.data);
      }
    } catch (error) {
      console.error("Error en la solicitud PUT:", error);
    }
  };
  const clickDelete = () => {
    setModalVisible(true);
  };
  const confirmDelete = () => {
    setModalVisibleConfirm(false);
    router.push("/Login");
  };
  return (
    <ScrollView style={{ margin: 10 }}>
      <TouchableOpacity onPress={() => router.push("/Home")} />
      <View
        style={{
          backgroundColor: Colors.background,
          borderRadius: 30,
          padding: 15,
        }}
      >
        <View style={styles.profileContainer}>
          <MaterialCommunityIcons
            name="account-circle"
            size={100}
            color={Colors.gray}
          />
        </View>
        <Text style={styles.textTittle}>
          {" "}
          Nombre: <Text style={styles.textData}>{nombres}</Text>
        </Text>
        <Text style={styles.textTittle}>
          {" "}
          Apellido: <Text style={styles.textData}>{apellidos}</Text>
        </Text>
        <Text style={styles.textTittle}>
          {" "}
          Correo: <Text style={styles.textData}>{correo}</Text>
        </Text>
        <Text style={styles.textTittle}>
          {" "}
          Celular: <Text style={styles.textData}>{celular}</Text>
        </Text>
        <Text style={styles.textTittle}>
          {" "}
          Dirección: <Text style={styles.textData}>{direccion}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text
          onPress={() => router.push("UpdateData")}
          style={styles.buttonText}
        >
          Cambiar Datos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text
          onPress={() => router.push("ChangePass")}
          style={styles.buttonText}
        >
          Cambiar Contraseña
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonDelete}>
        <Text onPress={clickDelete} style={styles.buttonText}>
          Eliminar Cuenta
        </Text>
      </TouchableOpacity>

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
              ¿Deseas eliminar tu cuenta?
            </Text>
            <TouchableOpacity
              style={{
                padding: 5,
                backgroundColor: Colors.danger,
                marginBottom: 10,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={deleteCliente}
            >
              <Text style={{ fontFamily: "poppins-regular", color: "white" }}>
                Eliminar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                backgroundColor: Colors.gray,
                marginBottom: 10,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={closeModal}
            >
              <Text
                style={{ fontFamily: "poppins-regular", color: Colors.text }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isModalVisibleConfirm}
        animationIn="zoomIn"
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
              Su cuenta ha sido eliminada
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
              onPress={confirmDelete}
            >
              <Text style={{ fontFamily: "poppins-regular", color: "white" }}>
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  textTittle: {
    fontSize: 16,
    color: Colors.primary,
    marginVertical: 10,
    fontFamily: "poppins-bold",
  },
  textData: {
    fontSize: 14,
    fontFamily: "poppins-regular",
    color: Colors.text,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.primary,

    marginTop: 15,
    borderRadius: 30,
  },
  buttonDelete: {
    padding: 15,
    backgroundColor: Colors.danger,
    marginTop: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "poppins-semiBold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
});
