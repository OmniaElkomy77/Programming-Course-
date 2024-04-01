import React from "react";
import { View, Text, StatusBar, FlatList, TouchableOpacity, ToastAndroid, Image, Modal, Dimensions, TouchableWithoutFeedback } from "react-native"
import { COLORS, AppRequired, images } from "../../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-community/async-storage";
import LottieView from 'lottie-react-native'
import { RFValue } from 'react-native-responsive-fontsize';
const { width, height } = Dimensions.get('window');
import axios from "axios";

export default class Old_exam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Questions: [],
            exam_id: this.props.navigation.getParam("exam_id"),
            answers: [],
            data: '',
            modalVisible1: false,
            fullDegree: "",
            studenDegree: "",
            percent: "",
            status: "",
            answer: false,


        }
    }
    componentDidMount() {
        this.selectQuestions()
    }

    async selectQuestions() {
        let AllData = JSON.parse(await AsyncStorage.getItem('AllData'))
        let data_to_send = {
            exam_quiz_id:
                // "Exam_" +
                this.state.exam_id,
            student_id: AllData.student_id,

        };
        console.log(data_to_send)

        axios.post(AppRequired.Domain + 'select_solved_student_exam_quiz.php', data_to_send)
            .then((res) => {
                // console.log(res.data)
                if (res.data) {
                    if (res.data == 'error') {


                        ToastAndroid.showWithGravityAndOffset(
                            AppRequired.appName + "\n" + 'هناك خطأ ما في استرجاع بيانات الامتحان',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                            25,
                            50,
                        );

                    } else {

                        console.log(res.data)

                        let arr = res.data
                        for (let i = 0; i < arr.length; i++) {
                            var questions = arr[i].question_answers.split("//CAMP//")
                            arr[i].question_answers = questions
                        }
                        // console.log(arr)
                        this.setState({ Questions: res.data });
                    }
                }

            });
    }








    answers(data, index) {
        return (
            <>
                {data.question_answers.map((item, i) => (
                    data.choosed_answer == data.question_valid_answer ?
                        <View
                            style={{

                                padding: 10,
                                width: "90%",
                                // alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,


                                backgroundColor: item != data.choosed_answer ? "#eee" : "#583",


                                marginVertical: 5,
                                alignSelf: "center"
                            }}>
                            <Text style={{ fontSize: 15, color: "#000" }}>
                                {item}
                            </Text>

                        </View >
                        :
                        <View
                            style={{

                                padding: 10,
                                width: "90%",
                                // alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,


                                backgroundColor: data.choosed_answer == item ? "#f00" : data.question_valid_answer == item ? "#583" : "#eee",


                                marginVertical: 5,
                                alignSelf: "center"
                            }}>
                            <Text style={{ fontSize: 15, color: "#000" }}>
                                {item}
                            </Text>

                        </View >
                ))
                }
            </>
        )
    }















    render() {
        return (
            <>
                <StatusBar backgroundColor={COLORS.primary} />
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    <View style={{
                        height: 70,
                        // padding: 10,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fff", flexDirection: "row",
                        elevation: 7
                    }}>
                        <Text style={{
                            color: COLORS.primary,
                            fontSize: 20,
                            fontWeight: "bold",
                            width: "82%",
                            textAlign: "center",
                            // backgroundColor: "#e54"
                        }}> الأسئله</Text>




                    </View>

                    <FlatList data={this.state.Questions}
                        renderItem={({ index, item }) => (
                            <>

                                <View style={{
                                    marginVertical: 7,
                                    alignSelf: "center",
                                    width: "90%",
                                    backgroundColor: "#fff",
                                    padding: 10,
                                    borderRadius: 10, elevation: 7
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 18, color: "#000" }}>{(index + 1) + ")" + " " + item.question_text}</Text>
                                        {item.question_image != null ? (
                                            <Image
                                                source={{ uri: item.question_image }}

                                                style={{ height: 100, width: 200, resizeMode: "center", marginVertical: 5 }} />
                                        ) : null}

                                    </View>
                                    <View>
                                        {this.answers(item, index)}


                                    </View>




                                </View>
                            </>
                        )} />




                </View>


                <Modal
                    visible={this.state.modalVisible1}
                    onRequestClose={() => {
                        this.setState({ modalVisible1: false });
                    }}
                    animationType="slide"

                    transparent={true}>
                    <View
                        style={{

                            backgroundColor: 'rgba(0,0,0,0.6)',
                            flex: 1,
                            justifyContent: 'flex-end',
                        }}>
                        <TouchableWithoutFeedback
                            style={{ flex: 1 }}
                            onPress={() => {
                                this.setState({ modalVisible1: false });
                            }}>
                            <View
                                style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </TouchableWithoutFeedback>
                        <View
                            style={{
                                height: height,
                                flex: 1,
                                justifyContent: 'space-around',
                            }}>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'space-around',
                                    width: '90%',
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    elevation: 5,
                                    paddingVertical: 15,
                                    marginBottom: 10,
                                }}>
                                <View
                                    style={{
                                        height: 50,
                                        width: '100%',

                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text
                                        style={{ color: '#000', fontWeight: 'bold', fontSize: 15 }}>
                                        درجه الإمتحان
                                    </Text>
                                </View>

                                {this.state.percent >= 0 && this.state.percent < 50 ?
                                    <LottieView
                                        source={images.failed}
                                        autoPlay
                                        loop
                                        style={{ height: RFValue(180), width: '100%', alignSelf: "center" }}
                                        resizeMode="contain"
                                    />

                                    :
                                    <LottieView
                                        source={images.success}
                                        autoPlay
                                        loop
                                        style={{ height: RFValue(180), width: '100%', alignSelf: "center" }}
                                        resizeMode="contain"
                                    />

                                }


                                <View
                                    style={{
                                        height: 70,
                                        width: '95%',
                                        backgroundColor: '#eee',
                                        borderRadius: 20,
                                        alignSelf: 'center',
                                        padding: 10,
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    }}>

                                    <View
                                        style={{
                                            // height: 70,
                                            width: '50%',
                                            padding: 10,
                                            backgroundColor: '#eee',
                                            borderRadius: 20,
                                            alignItems: "center",
                                            justifyContent: "center"

                                        }}>

                                        <Text style={{ color: "#000", fontSize: 18 }}>{this.state.studenDegree + "/" + this.state.fullDegree}</Text>






                                    </View>
                                </View>

                                <View
                                    style={{
                                        height: 100,
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',

                                        alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ modalVisible1: false, answer: true })
                                        }}
                                        style={{
                                            height: 50,
                                            width: '40%',
                                            backgroundColor: COLORS.primary,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 25,
                                        }}>
                                        <Text
                                            style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
                                            تم
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                        <TouchableWithoutFeedback
                            style={{ flex: 1 }}
                            onPress={() => {
                                this.setState({ modalVisible1: false });
                            }}>
                            <View
                                style={{
                                    width: '100%',
                                }}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
















            </>
        )
    }
}