import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';

class SignUp extends Component{
constructor(props){
  super(props);
  this.state = {
    forename:"",
    surname:"",
    email: "",
    confirmEmail:"",
    password:"",
    confirmPassword:"",
    emailCorrectColor: "",
    passwordCorrectColor:"",
  }

  this.CreateAccount = this.CreateAccount.bind(this);
  this.GoBack = this.GoBack.bind(this);
}

CreateAccount(){

  if(this.state.email == this.state.confirmEmail &&
      this.state.password == this.state.confirmPassword){
    //server stuff here
    return fetch("http://10.0.2.2:3333/api/v0.0.5/user",{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "given_name":this.state.forename,
          "family_name":this.state.surname,
          "email":this.state.email,
          "password":this.state.password
        })
      }).then((response) => response.json()).then((responseJson) => {
        alert("You have been signed up!");
        this.props.navigation.navigate('Login');
      }).catch((error) =>{
        console.log(error);
        alert("Something went wrong please try again");
      })
  } else if(this.state.email != this.state.confirmEmail ||
              this.state.password !== this.state.confirmPassword){
    alert("email or password do not match");
  } else{
    alert("Something went wrong please try again later");
  }

}

ConfirmEmailOnChange(text){
  this.setState({confirmEmail: text});
  if(text === this.state.email){
    this.setState({emailCorrectColor: '#00FF00'});
  } else{
    this.setState({emailCorrectColor: '#FF0000'});
  }
}
ConfirmPasswordOnChange(text){
  this.setState({confirmPassword: text});
  if(text === this.state.password){
    this.setState({passwordCorrectColor: '#00FF00'});
  } else{
    this.setState({passwordCorrectColor: '#FF0000'});
  }
}

GoBack(){
  this.props.navigation.goBack();
}
render(){
    return(
      <View>
        <Text>Sign up Screen</Text>
        <TextInput placeholder="Forename"
        onChangeText={(text) => this.setState({forename:text})}
        value={this.state.forename} />

        <TextInput placeholder="Surname"
        onChangeText={(text) => this.setState({surname:text})}
        value={this.state.surname} />

        <TextInput placeholder="Email"
        onChangeText={(text) => this.setState({email:text})}
        value={this.state.email} />

        <TextInput placeholder="Confirm email"
        onChangeText={(text) => this.ConfirmEmailOnChange(text)}
        value={this.state.confirmEmail} />

        <TextInput placeholder="password"
        onChangeText={(text) => this.setState({password: text})}
        value={this.state.password} />

        <TextInput placeholder="Confirm password"
        onChangeText={(text) => this.ConfirmPasswordOnChange(text)}
        value={this.state.confirmPassword} />

        <Button title="Sign Me Up!"
          onPress={this.CreateAccount} />

        <Button title="Back"
        onPress={this.GoBack} />

        <Text style={[styles.square, { backgroundColor: this.state.emailCorrectColor}]}></Text>
        <Text style={[styles.square, { backgroundColor: this.state.passwordCorrectColor}]}></Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  square:{
    width:25,
    height:25,
  },
});

export default SignUp;
