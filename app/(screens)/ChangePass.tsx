import {
    SafeAreaView,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import fonts from "../../config/Fonts";
import Colors from "../../config/Colors";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const router = useRouter();
const ChangePass = () => {
    const [fontsLoaded] = useFonts(fonts);

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [oldPassError, setOldPassError] = useState("");
    const [newPassError, setNewPassError] = useState("");

    const handleSubmit = async () => {
        try {
            if (oldPass === "") {
                setOldPassError("Campo requerido.");
                return;
            }
            if (newPass === "") {
                setNewPassError("Campo requerido.");
                return;
            }
            const id = await AsyncStorage.getItem('my-key');
            const response = await axios.put(`http://${process.env.EXPO_PUBLIC_IP}:3000/api/login/${id}`, {
                contrasena: CryptoJS.MD5(newPass).toString(
                    CryptoJS.enc.Hex
                  )
            });
            alert("Contraseña Modificada");
            router.push("/Perfil");
        } catch (e) {
            alert("Tenemos problemas al actualizar tu contraseña");
            console.log(e.error);
        }
    };
    return !fontsLoaded ? null : (
        
        <ScrollView
            style={{
                backgroundColor: "#fff",
                height: "100%",
            }}
        >
            <Stack.Screen options={{headerTitle: "Cambio de Contraseña"}}></Stack.Screen>
            <TouchableOpacity onPress={() => router.push("Perfil")} />
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
                            textAlign: "center",
                            fontFamily: "poppins-bold",
                        }}
                    >
                        Cambio de Contraseña
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            marginTop: 20,
                            textAlign: "center",
                            fontFamily: "poppins-regular",
                        }}
                    >
                        Necesitamos saber si eres dueño de la cuenta, ingresa tu antigua contraseña ademas de la nueva.
                    </Text>
                </View>
                {/*  */}
                <View
                    style={{
                        marginVertical: 20,
                    }}
                >
                    <TextInput
                        placeholderTextColor={Colors.darkText}
                        placeholder="Contraseña Anterior"
                        style={styles.input}
                        value={oldPass}
                        onChangeText={(text) => setOldPass(text)}
                    />
                </View>
                <Text style={styles.errorText}>{oldPassError}</Text>
                {/* */}
                <View
                    style={{
                        marginVertical: 20,
                    }}
                >
                    <TextInput
                        placeholderTextColor={Colors.darkText}
                        placeholder="Nueva Contraseña"
                        style={styles.input}
                        value={newPass}
                        onChangeText={(text) => setNewPass(text)}
                    />
                </View>
                <Text style={styles.errorText}>{newPassError}</Text>
                <View
                    style={{
                        marginTop: 20,
                    }}
                >
                    <TouchableOpacity
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
                            onPress={handleSubmit}
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 16,
                                fontFamily: "poppins-bold",
                            }}
                        >
                            Cambiar Contraseña
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default ChangePass;

const styles = StyleSheet.create({
    input: {
        fontSize: 14,
        padding: 15,
        backgroundColor: Colors.lightPrimary,
        borderRadius: 30,
        fontFamily: "poppins-regular",
    },
    errorText: {
        color: "red",
        marginLeft: 10,
        fontSize: 12,
        fontFamily: "poppins-regular",
    },
});