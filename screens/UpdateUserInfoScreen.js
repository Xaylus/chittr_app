import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';

class UpdateUserInfo extends Component{
constructor(props){
  super(props);
  this.state = {
    userData: this.props.navigation.state.params.userData,
    given_name: "",
    family_name: "",
    email: "",
    changePassword: false,
    old_password: "",
    new_password: "",
    confirm_password:"",
  }

  this.Submit = this.Submit.bind(this);
  this.Cancel = this.Cancel.bind(this);
}

  componentDidMount(){
    this.setState({
      given_name: this.state.userData.given_name,
      family_name: this.state.userData.family_name,
      email: this.state.userData.email,
    });
  }

  Submit(){
    console.log( this.state.given_name + " " + this.state.family_name + " " +
                    this.state.email);

if(this.state.changePassword){
      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id,{
        method:'PATCH',
        headers: {
          'X-Authorization': global.token,
        },
        body: JSON.stringify({
          given_name: this.state.given_name,
          family_name: this.state.family_name,
          email: this.state.email,
          password: this.state.new_password,
        })
      }).then((response) =>{
        if(response.status == '201'){
          alert("complete");
          this.props.navigation.navigate('UserProfile');
        } else{
          alert("error occurred");
        }
      }).catch((error)=>{
        console.log(error);
      });
    } else {
      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id,{
        method:'PATCH',
        headers: {
          'X-Authorization': global.token,
        },
        body: JSON.stringify({
          given_name: this.state.given_name,
          family_name: this.state.family_name,
          email: this.state.email,
        })
      }).then((response) =>{
        if(response.status == '201'){
          alert("complete");
          this.props.navigation.navigate('UserProfile');
        } else{
          alert("error occurred");
        }
      }).catch((error)=>{
        console.log(error);
      });
    }
  }

  Cancel(){
    this.props.navigation.navigate('UserProfile');
  }

  addPassword(){
    if(this.state.changePassword){
      return(
        <View>
          <TextInput placeholder="Old Password"
          onChangeText={(text) => this.setState({old_password:text})}
          value={this.state.old_password} />

          <TextInput placeholder="New Password"
          onChangeText={(text) => this.setState({new_password:text})}
          value={this.state.new_password} />

          <TextInput placeholder="Confirm password"
          onChangeText={(text) => this.setState({confirm_password: text})}
          value={this.state.confirm_password} />
        </View>
      );
    }
  }

  render(){
    return(
      <View>
        <Text>My Profile</Text>
        <TextInput onChangeText={(text) => this.setState({given_name: text})}
        value={this.state.given_name} />
        <TextInput onChangeText={(text) => this.setState({family_name: text})}
        value={this.state.family_name}/>
        <TextInput onChangeText={(text) => this.setState({email:text})}
        value={this.state.email} />

        <TouchableOpacity onPress={() => this.setState({changePassword: true})} >
          <Text> Change Password? </Text>
        </TouchableOpacity>
        {this.addPassword()}

        <Button title="Submit"
        onPress={this.Submit} />
        <Button title="Cancel"
        onPress={this.Cancel} />

      </View>
    );
  }
}

export default UpdateUserInfo;
