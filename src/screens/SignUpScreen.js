import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password1: '',
      password2: '',
      birthdate: ''
    };
  }

  render() {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({ email: text })}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              secureTextEntry
              style={styles.inputText}
              placeholder="Password..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({ password1: text })}
            />
          </View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131114',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0
  },
  inputText: {
    height: 50,
    color: 'black'
  },
  inputView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 0,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20
  }
});

export default SignUpScreen;
