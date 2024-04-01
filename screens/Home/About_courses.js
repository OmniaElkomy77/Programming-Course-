import React from "react"
import { View, Text, StatusBar, Image, ToastAndroid, FlatList, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import { COLORS } from "../../constants"
import axios from "axios"
export default class About_courses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lesson_name: this.props.navigation.getParam("lesson_name"),
            lesson_id: this.props.navigation.getParam("lesson_id"),
            data: [{}, {}],
            sound: [],
            loading: false

        }
    }
    // componentDidMount() {
    //     this.get_content()
    // }

    // get_content() {
    //     let data_to_send = {
    //         lesson_id: this.state.lesson_id
    //     }
    //     this.setState({ loading: true })
    //     axios.post("https://elearning0103.000webhostapp.com/select_lesson_content.php", data_to_send).then(res => {
    //         console.log(JSON.stringify(res.data.massage.txt))
    //         if (res.data.status == "success") {

    //             this.setState({
    //                 data: res.data.massage.txt,
    //                 sound: res.data.massage.sound,
    //                 loading: false
    //             })
    //             // console.log(res.data.massage.sound)
    //         } else {
    //             ToastAndroid.showWithGravityAndOffset(
    //                 "حدث خطأ ما ",
    //                 ToastAndroid.SHORT,
    //                 ToastAndroid.BOTTOM,
    //                 20,
    //                 20
    //             );
    //         }
    //     }

    //     )
    // }


    render() {
        return (
            <>
                <StatusBar backgroundColor={COLORS.primary} />
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    {/* <ScrollView> */}
                    <View style={{
                        height: 70,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%", backgroundColor: "#fff",
                        elevation: 7

                    }}>
                        <Text style={{ color: COLORS.primary, fontSize: 20, }}>معلومات عن الكورسات </Text>

                    </View>




                    {/* <View style={{
                        alignSelf: "center",
                        width: "70%",
                        borderBottomColor: "#000",
                        borderBottomWidth: 3,
                        padding: 15
                    }}>
                        <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold", color: "#000" }}>
                            html
                        </Text>

                    </View> */}


                    {this.state.loading ?
                        <View style={{ height: "70%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator size={25} color={COLORS.primary} />
                        </View>
                        :
                        <View style={{ marginVertical: 10, padding: 7, }}>

                            <FlatList
                                data={this.state.data}
                                keyExtractor={(_, index) => `txt-${index.toString()}`}
                                renderItem={({ index, item }) => (
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: "800",
                                        color: "#000",
                                        textAlign: "auto"
                                    }}>
                                        html
                                    </Text>
                                )}
                                ListEmptyComponent={() => {
                                    <View style={{ height: "70%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                        <Text style={{ fontSize: 20, color: "#000" }}>لا يوجد اي بيانات </Text>
                                    </View>
                                }}

                            />

                        </View>


                    }

                </View>


            </>
        )
    }
}