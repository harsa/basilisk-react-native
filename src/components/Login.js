import React from "react";
import PropTypes from "prop-types";
import { Button, Text, TextInput, View, StyleSheet, StatusBar } from "react-native";
import firebase from 'react-native-firebase';
import { iOSUIKit } from "react-native-typography";
import createTheme from '../theme';
const theme = createTheme()
export default class LoginDialog extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: ""
    };
  }
	handleLogin = () => {
		const { email, password } = this.state
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(() => this.props.navigation.navigate('Devices'))
			.catch(error => this.setState({ errorMessage: error.message }))
	}
  render() {
    return (
      <View style={styles.container}>
				<StatusBar
					barStyle="light-content"
					backgroundColor="#6a51ae"
				/>
        <Text style={iOSUIKit.title3EmphasizedWhite}>Login to continue</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor={'white'}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
					placeholderTextColor={'white'}
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="OK" onPress={this.handleLogin} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    paddingLeft: 8,
    height: 40,
    width: "90%",
    borderColor: "white",
    color: 'white',
    borderWidth: 1,
    marginTop: 8
  }
});
