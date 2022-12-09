import { StyleSheet, Dimensions } from "react-native";

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    questionContainer: {
        flex: 1,
        // width: width*0.8,
        width: width - 60,
        // height: 300,
        borderRadius: 3,
        // borderColor: '#C9D9C1',
        borderWidth: 0,
        alignContent: 'center',
        padding: 0,
        color: '#BCEEFA'
        // textAlignVertical: "top"
    },
    childContainer: {
        borderWidth: 0.0,
        // borderColor: "#978d85",
        borderRadius: 5,
        backgroundColor: "#f2f4f6",
        margin: 10,
        padding: 10,
        // height: 350
    },  
    bodyPartCircle: {
        width: 15,
        height: 15,
        position: 'absolute',
        // backgroundColor: "#FF0000",
        borderRadius: 50
    },
    grayBorderBox: {
        borderRadius: 4,
        borderColor: '#808080',
        borderWidth: 0.5,
        marginBottom: 10,
        marginTop: 10,
        paddingBottom: 10,
        paddingTop: 10
    },
    bar: {
        height: 50,
        backgroundColor: '#00356b', 
        justifyContent: 'center'
    },
    barFont: {
        color: "#FFFFFF",
        fontSize: 15
    },
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        // textAlignVertical: 'top',
        padding: 10,
        color: '#286dc0'
    },
    textInput: {
        borderWidth: 0,
        height: 40,
        borderColor: '#000000',
        borderRadius: 5,
        borderWidth: 0.5,
        // width: 300,
        alignSelf: 'stretch',
        borderStyle: "dashed",
        color: '#000000',
        textAlignVertical: 'top',
        padding: 2
    },
    progressBar: {
        flexDirection: 'row',
        height: 20,
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 5
    },
    row: {
        flexDirection: "row",
        padding: 5
    },
    button: {
        borderColor: "grey",
        borderRadius: 5,
        borderWidth: 0.5,
        padding: 5,
        margin: 5,
        alignSelf: 'flex-end'
    },
    grayButton: {
        borderColor: 'grey',
        borderRadius: 2,
        borderWidth: 2,
        padding: 5,
        margin: 5,
        color: 'grey'
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    slider: {
        width: 100,
        height: 40
    },
    card: {
        height: 50,
        borderColor: '#C9D9C1',
        borderWidth: 1,
        borderRadius: 2,
        color: '#BCEEFA',
        margin: 4
        // textAlignVertical: 'top'
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold"
    },
    iconButton: {
      borderColor: "grey",
      borderRadius: 5,
      borderWidth: 0,
      padding: 5,
      margin: 5,
      alignSelf: 'flex-end',
      height: 64,
      width: 64
    },
    bottom: {
        position: 'absolute',
        height: 40,
        bottom: 0
    }
});