
import React, { Component } from 'react';
import { Text, View, TextInput, Button } from 'react-native';

class loginScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:"",
      password:"",
      authCode:""
    }
    this.Login = this.Login.bind(this);
  }

Login = () => {
  console.log(this.state.email + " " + this.state.password);
  return fetch("http://10.0.2.2:3333/api/v0.0.5/login",{
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email:this.state.email,
      password:this.state.password
    })
  }).then((response) =>response.json()).then((responseJson) => {
    this.setState({authCode: responseJson.token});
    global.token = responseJson.token;
    global.user_id = responseJson.id;
    console.log(global.token);
    this.props.navigation.navigate('Home');
  }).catch((error) => {
    console.log(error);
    alert("Incorrect Details");
  });
}

static navigationOptions = {
    tabBarVisible:false
}

  render(){
    return(
      <View>
        <Text>Hi</Text>
        <TextInput placeholder="Email"
        onChangeText={(text) => this.setState({email:text})}
        value={this.state.email}/>
        <TextInput placeholder="Password"
        onChangeText={(text) => this.setState({password:text})}
        value={this.state.password}
        secureTextEntry={true} />
        <Button title="Submit"
        onPress={this.Login} />
      </View>
    )
  }

}

export default loginScreen;
