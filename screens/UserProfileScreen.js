import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

class UserProfile extends Component{
constructor(props){
  super(props);
  this.state = {
    userJson: this.props.navigation.state.params.userJson,
  }
  this.Followers = this.Followers.bind(this);
  this.Following = this.Following.bind(this);
}

Followers(){
  this.props.navigation.push('Followers', { type: 'followers', user_id: this.state.userJson.user_id});
}
Following(){
  this.props.navigation.push('Followers', {type: 'following', user_id: this.state.userJson.user_id});
}

  render(){
    return(
      <View>
        <Text>My Profile</Text>
        <Text>{this.state.userJson.given_name + " " + this.state.userJson.family_name}</Text>

        <Button title="Followers"
          onPress={this.Followers} />
        <Button title="Following"
        onPress={this.Following} />

      </View>
    );
  }
}

export default UserProfile;
