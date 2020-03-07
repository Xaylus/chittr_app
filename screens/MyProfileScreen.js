import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  ScrollView,
  FlatList,
  StyleSheet,
 } from 'react-native';

class MyProfile extends Component{
  constructor(props){
    super(props);
    this.state = {
      userData: "",
      chitsList: "",
    }

  }

getData(){
  console.log(global.user_id);
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id,{
    method:'GET',
    headers: {
      'X-Authorization': global.token,
    }
  }).then((response) => response.json()).then((responseJson) =>{
      this.setState({
        userData:responseJson,
        chitsList:responseJson.recent_chits,
      });
      console.log(responseJson);
    }).catch((error) =>{
      console.log(error);
  });
}

  render(){
    return(
      <View>
        <Text>My Profile</Text>
        <Text>{this.state.userData.given_name + " " + this.state.userData.family_name}</Text>

        <FlatList
          data={this.state.chitsList}
          renderItem={ ({item}) =>
            <ScrollView style={styles.container}>
              <Text>{item.chit_content}</Text>
            </ScrollView>
          }
          keyExtractor={item => item.chit_id.toString()}
          />

      </View>
    );
  }

  componentDidMount(){
    this.getData();
  }

}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000'
  },
});

export default MyProfile;
