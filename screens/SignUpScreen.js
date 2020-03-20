import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity
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
      <View style={styles.imgContainer}>
        <Image style={styles.img}
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Sign Up</Text>
      </View>
        {this.renderImage()}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.longButton} onPress={() => this.imagePicker()}>
            <Text>Add Profile Picture</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Forename: </Text>
          <TextInput style={styles.inputText} placeholder="Forename" onChangeText={(text) => this.setState({forename: text})}
            value={this.state.forename} />
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Surname: </Text>
          <TextInput style={styles.inputText} placeholder="surname" onChangeText={(text) => this.setState({surname: text})}
            value={this.state.surname}/>
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Email: </Text>
          <TextInput style={styles.inputText} placeholder="email" onChangeText={(text) => this.setState({email:text})}
            value={this.state.email} />
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Confirm Email: </Text>
          <TextInput style={styles.inputText} placeholder="Confirm Email" onChangeText={(text) => this.setState({confirmEmail:text})}
            value={this.state.confirmEmail} />
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Password: </Text>
          <TextInput placeholder="Password" style={styles.inputText} onChangeText={(text) => this.setState({password:text})}
            value={this.state.password}
            secureTextEntry={true}/>
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Confirm Password: </Text>
          <TextInput  placeholder="Confirm Password" style={styles.inputText} onChangeText={(text) => this.setState({confirmPassword: text})}
            value={this.state.confirmPassword}
            secureTextEntry={true}/>
        </View>

        <Button title="Sign Me Up!"
          onPress={this.CreateAccount} />

        <Button title="Back"
        onPress={this.GoBack} />


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    width: '80%',
    marginLeft: '10%',
  },
  header: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 0,
  },
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  img:{
    width: 150,
    height: 150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  followingContainer:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  buttonsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  InputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttons:{
    width: '25%',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 10,
  },
  longButton:{
    width: '40%',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 10,
  },
  inputText:{
    width: '50%'
  },
  titles: {
    padding: 14,
    width: '25%'
  },
  longTitle:{
    marginLeft: 70,
    padding: 14,
    width: '30%'
  }
});

export default SignUp;
