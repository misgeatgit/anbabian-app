import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


class SignInScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }
    render() {
        const {navigation} = this.props;
        return (
            <React.Fragment>
            <View style={styles.container}>
                <Text style={styles.logo}>LOGO</Text>
                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email..."
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({ email: text })} />
                </View>
                <View style={styles.inputView} >
                    <TextInput
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password..."
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({ password: text })} />
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.loginText} onPress={this._signInAsync}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.loginText} onPress={()=>navigation.navigate('SignUp')}>Signup</Text>
                </TouchableOpacity>
            </View>
      </React.Fragment>
        );
    }

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131114',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0
    },
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#45D15B",
        marginBottom: 40
    },
    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 0,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "black"
    },
    forgot: {
        color: "white",
        fontSize: 11
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#45D15B",
        borderRadius: 0,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    loginText: {
        color: "white"
    }
});

export default SignInScreen;