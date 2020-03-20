
import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

class loginScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:"",
      password:"",
      token:"",
      isUser: false,
      test: "",
    }
    global.token = "";
    global.user_id = "";
    this.Login = this.Login.bind(this);
    this.MoveToSignUp = this.MoveToSignUp.bind(this);
    this.storeToken = this.storeToken.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.getToken();
  }

Login() {
  console.log(this.state.email + " " + this.state.password);
  console.log(global.token);
  return fetch("http://10.0.2.2:3333/api/v0.0.5/login",{
    method:'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email:this.state.email,
      password:this.state.password
    })
  }).then((response) =>{
    if(response.status == '200'){
      this.setState({isUser: true});
      return response.json();
    } else {
      this.setState({isUser: false});
      return response;
    }
  }).then((responseJson) => {
    if(this.state.isUser){
    this.setState({token: responseJson.token});
    this.storeToken();
    global.token = this.state.token;
    global.user_id = responseJson.id;
    this.props.navigation.navigate('Home');
  } else{
    alert("incorrect email or password");
  }
  }).catch((error) => {
    console.log(error);
    alert("Something went wrong please try again later");
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
getToken = async() => {
  try{
    const testing = await AsyncStorage.getItem('token')
    let id = await AsyncStorage.getItem('user_id')
    console.log(id);
    this.setState({test: testing});
  } catch(error){
    console.log(error);
  }
}

MoveToSignUp(){
  this.props.navigation.navigate('SignUp');
}

static navigationOptions = {
    tabBarVisible:false
}

  render(){
    return(
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Login</Text>
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.titles}>Email: </Text>
          <TextInput style={styles.inputText} placeholder="Email" onChangeText={(text) => this.setState({email:text})}
            value={this.state.email} />
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.titles}>Password: </Text>
          <TextInput style={styles.inputText} placeholder="Password" onChangeText={(text) => this.setState({password:text})}
            value={this.state.password}
            secureTextEntry={true} />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttons} onPress={() => this.Login()} >
            <Text> Login </Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={() => this.MoveToSignUp()} >
              <Text> Sign Up </Text>
            </TouchableOpacity>
        </View>
      </View>
    )
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
  flatList:{
    marginTop: 10,
    marginBottom: 50,
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
    justifyContent: 'space-evenly',
  },
  inputText:{
    width: '50%'
  },
  titles: {
    padding: 14,
    width: '25%'
  },
  buttons:{
    width: '25%',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 10,
  }
});
export default loginScreen;
