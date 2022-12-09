import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    borderRadius: 4,
    borderWidth: 1,
    height: 24
  },
  textInput: {
    borderRadius: 4,
    borderWidth: 1,
    height: 24,
    padding: 2,
    alignItems: 'center'
  }
});
export default styles;