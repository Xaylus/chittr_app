import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

class CreateChit extends Component{
constructor(props){
  super(props);
  this.state = {
    data: {
      name: 'name'
    }
  }
}

  render(){
    return(
      <View>
        <Text>My Profile</Text>
        <Text>{this.state.data.name}</Text>

      </View>
    );
  }
}

export default CreateChit;
