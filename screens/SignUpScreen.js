import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

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
    token:"",
    Image:null,
    gotImage: false,
  }

  this.CreateAccount = this.CreateAccount.bind(this);
  this.GoBack = this.GoBack.bind(this);
  this.imagePicker = this.imagePicker.bind(this);
  this.renderImage = this.renderImage.bind(this);
  this.postProfilePicture = this.postProfilePicture.bind(this);
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
        //this.props.navigation.navigate('Login');
        this.login();
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


login() {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/login",{
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email:this.state.email,
      password:this.state.password
    })
  }).then((response) =>{
    if(response.status == '200'){
      return response.json();
    }
  }).then((responseJson) => {
    this.setState({
      token: responseJson.token,
      user_id: responseJson.id,
    });
    console.log(this.state.token);
    //global.user_id = responseJson.id;
    this.storeToken();
    if(this.state.gotImage){
      this.postProfilePicture();
    }
  }).catch((error) => {
    console.log(error);
    alert("Something went wrong please try again later");
  });
}

postProfilePicture(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/photo",{
  method: 'POST',
  headers: {
    'X-Authorization': this.state.token
  },
  body: this.state.Image
}).then((response) =>{
  if(response.status == 201){
    this.props.navigation.navigate('Home');
  } else {
    alert("Something went wrong");
  }
}).catch((error) => {
  console.log(error)
  });
}

storeToken = async() => {
  try{
    await AsyncStorage.setItem('token', this.state.token)
    await AsyncStorage.setItem('user_id', global.user_id.toString())
  } catch (error) {
    console.log(error);
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

imagePicker(){
  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
  //const source = { uri: response.uri };
    console.log(response);
  // You can also display the image using data:
  // const source = { uri: 'data:image/jpeg;base64,' + response.data };

      this.setState({
        Image: response,
        gotImage: true,
      });
    }
  });
}


renderImage(){
  if(this.state.gotImage){
    return(
      <View>
        <Image style={{width: 50, height: 50}}
          source={{uri : this.state.Image.uri}} />
      </View>
    )
  }
}

GoBack(){
  this.props.navigation.goBack();
}
render(){
    return(
      <View>
        <Text>Sign up Screen</Text>
        {this.renderImage()}
        <Button title="add profile picture"
        onPress={this.imagePicker} />
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
