import React from "react";
import { View, Text, StatusBar, FlatList, TouchableOpacity, ToastAndroid } from "react-native"
import { COLORS, AppRequired, SIZES } from "../../constants";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
export default class Old_All_exam extends React.Component {
    constructor() {
        super()
        this.state = {
            exams: [{}, {}],
            student_data: "",
            subject_id: ""
        }
    }

    componentDidMount() {


        this.get_exams()

    }



    async get_exams() {
        let AllData = JSON.parse(await AsyncStorage.getItem('AllData'));
        let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));
        let data_to_send = {
            generation_id: 1,
            student_id: AllData.student_id,
            // subject_id: drInfo.subject_id,
        };


        axios.post(AppRequired.Domain + "select_my_solved_exams.php", data_to_send).then((res) => {


            if (res.status == 200) {
                console.log(res.data.exams)
                if (res.data != 'error') {
                    if (Array.isArray(res.data.exams)) {
                        if (res.data.exams.length > 0) {
                            this.setState({
                                exams: res.data.exams,

                            });

                        } else {
                            this.setState({
                                exams: [],

                            });

                        }

                    } else {
                        this.setState({
                            exams: [],

                        });

                    }
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        "حدث خطأ ما",
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                        25,
                        50,
                    );
                }
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    "حدث خطأ ما",
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25,
                    50,
                );

            }

        });
    }


















    render() {
        return (
            <>
                <StatusBar backgroundColor={COLORS.primary} />
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
                        }}>الإمتحانات السابقه</Text>
                    </View>

                    <FlatList data={this.state.exams}
                        renderItem={({ index, item }) => (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate("Old_exam", {
                                            exam_id: item.exam_quiz_id
                                        })
                                    }}


                                    style={{
                                        marginVertical: 10,
                                        alignSelf: "center",
                                        width: "85%",
                                        backgroundColor: "#fff",
                                        // padding: 10,
                                        height: 70,
                                        borderRadius: 10,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        elevation: 7
                                    }}>
                                    <View>
                                        <Text style={{ fontSize: 18, color: "#000" }}>{item.exam_name}</Text>
                                    </View>


                                </TouchableOpacity>
                            </>
                        )}


                        ListEmptyComponent={() => (
                            <View style={{

                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                height: SIZES.height,
                            }}>
                                <Text style={{ fontSize: 18, color: "#000" }}>
                                    لا يوجد  امتحانات
                                </Text>
                            </View>

                        )}

                    />


                </View>
            </>
        )
    }
}