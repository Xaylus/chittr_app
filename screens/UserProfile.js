import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

class UserProfile extends Component{
constructor(props){
  super(props);
  this.state = {
    //userJson: this.props.navigation.state.params.userJson,
  }
}

  render(){
    return(
      <View>
        <Text>My Profile</Text>
        //<Text>{this.state.userJson.given_name}</Text>

      </View>
    );
  }
}

export default UserProfile;
