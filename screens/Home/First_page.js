import React from "react"
import { TouchableOpacity, View, Text, StatusBar } from "react-native"
import { COLORS } from "../../constants"
export default class First_page extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <StatusBar backgroundColor={COLORS.primary} />
                <View style={{
                    height: 70,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff", elevation: 7
                }}>
                    <Text style={{
                        color: COLORS.primary,
                        fontSize: 20,
                        fontWeight: "bold"
                    }}>الصفحه الرئيسيه</Text>
                </View>
                <View style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate("SelectSubject")
                        }}
                        style={{
                            height: 150, width: "90%",
                            backgroundColor: "#fff", elevation: 7,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center"
                        }}

                    >
                        <Text style={{ color: COLORS.primary, fontSize: 20, fontWeight: "bold" }}>
                            الكورسات
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate("About_courses")
                        }}
                        style={{
                            height: 150, width: "90%",
                            backgroundColor: "#fff", elevation: 7,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            marginVertical: 20
                        }}

                    >
                        <Text style={{ color: COLORS.primary, fontSize: 20, fontWeight: "bold" }}>
                            معلومات عن الكورسات
                        </Text>

                    </TouchableOpacity>



                </View>



            </View>
        )
    }
}