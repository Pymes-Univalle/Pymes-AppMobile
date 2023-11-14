import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import fonts from '../../config/Fonts';
import Colors from "../../config/Colors";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Stack, router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import AppTextInput from "../components/AppTextInput"
const Login = () => {

    const navigation = useRouter();
    const [fontsLoaded] = useFonts(fonts);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //const { onLogin, onRegister } = useAuth();

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    // const login = async () => {
    //   const result = await onLogin!(email, password);
    //   if(result && result.error){
    //     alert(result.msg);
    //   }
    // }

    // const register = async () => {
    //   const result = await onRegister!(email, password);
    //   if(result && result.error){
    //     alert(result.msg);
    //   } else {
    //     login();
    //   }
    // }

    const handleLogin = async () => {
        if (email.trim() === "") {
            setEmailError(true);
        } else if (password.trim() === "") {
            setPasswordError(true);
        } else {
            try {
                const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/api/login`, {
                    correo: email,
                    contrasena: password
                });
                //alert(response);
                const { token } = response.data;
                await AsyncStorage.setItem('my-key', response.data.user.id.toString());
                // Guardar el token en el almacenamiento seguro del dispositivo
                //await Keychain.setGenericPassword('token', token);
                // Redireccion Inicio
                //alert("Todo posi");
                router.push("/Home")
            } catch (e: any) {
                alert("error2: " + e.toString());
            }
        }
    };
    return !fontsLoaded ? null : (
        <ScrollView
            style={{
                backgroundColor: "#fff",
                height: "100%",
            }}
        >
            <Stack.Screen options={{headerTitle: "Inicio de Sesión"}}></Stack.Screen>
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
                        marginTop: 120,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            color: Colors.primary,
                            fontFamily: "poppins-bold",
                        }}
                    >
                        Inicia Sesión
                    </Text>
                    {/* <Text
              style={{
              
                fontSize: 20,
                maxWidth: "60%",
                textAlign: "center",
              }}
            >
              Bienvenido de vuelta
            </Text> */}
                </View>
                <View
                    style={{
                        marginVertical: 20,
                    }}
                >
                    <TextInput
                        placeholderTextColor={Colors.darkText}
                        placeholder="Correo Electrónico"
                        style={[styles.input, emailError && styles.inputError]}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError(false); // Reinicia el estado de error cuando se edita el campo.
                        }}
                    />
                    <Text style={styles.errorText}>
                        {emailError && "El correo electrónico es obligatorio"}
                    </Text>

                    <TextInput
                        placeholderTextColor={Colors.darkText}
                        placeholder="Contraseña"
                        secureTextEntry
                        style={[styles.input, passwordError && styles.inputError]}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError(false); // Reinicia el estado de error cuando se edita el campo.
                        }}
                    />
                    <Text style={styles.errorText}>
                        {passwordError && "La contraseña es obligatoria"}
                    </Text>
                </View>
                <View
                    style={{
                        marginTop: 20,
                    }}
                >
                    <View>
                        <Text
                            onPress={() => router.push("/Inicio")}
                            style={{
                                fontSize: 14,
                                color: Colors.primary,
                                alignSelf: "flex-end",
                                fontFamily: "poppins-semiBold",
                                marginRight: 10,
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{
                            padding: 20,
                            backgroundColor: Colors.primary,
                            marginBottom: 10,
                            marginTop: 10,
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
                            onPress={handleLogin}
                            style={{
                                color: Colors.onPrimary,
                                textAlign: "center",
                                fontSize: 16,
                                fontFamily: "poppins-bold",
                            }}
                        >
                            Iniciar sesión
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push("Register")}
                        style={{
                            padding: 20,
                            backgroundColor: Colors.gray,
                            borderRadius: 30,
                            marginTop: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: "#000",
                                textAlign: "center",
                                fontSize: 16,

                                fontFamily: "poppins-regular",
                            }}
                        >
                            Crear Cuenta
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    input: {
        fontSize: 14,
        padding: 15,
        backgroundColor: Colors.lightPrimary,
        borderRadius: 30,
        marginVertical: 10,
        fontFamily: "poppins-regular",
    },
    inputError: {
        borderColor: "red", // Puedes cambiar el color del borde o el estilo que desees.
        borderWidth: 1,
    },
    errorText: {
        color: "red",
        fontSize: 12,
    },
});
