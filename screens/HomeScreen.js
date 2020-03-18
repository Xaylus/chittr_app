import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class HomeScreen extends Component{
constructor(props){
  super(props);
  this.state = {
    isLoading: true,
    searchItem: "",
    chitsList: [],
    test: "",
    userData: "",
  }

  this.search = this.search.bind(this);
  this.FollowUser = this.FollowUser.bind(this);
  this.asyncTest = this.asyncTest.bind(this);
  //this.getData = this.getData.bind(this);
}

search = () => {
  //let query = "SELECT * FROM "
  return fetch("http://10.0.2.2:3333/api/v0.0.5/search_user/?q=" + this.state.searchItem,{
    method:'GET'
  }).then((response) => {
    console.log(response);
    return response.json()
  }).then((responseJson) => {
    console.log(responseJson);
    console.log(responseJson.user_id);
  //  this.props.navigation.navigate('OtherUserProfile', {
  //    user_id: responseJson.user_id,
  //  });
  }).catch((error) => {
    console.log(error);
  })
  this.props.navigation.navigate('UserProfile');
}

asyncTest = async() => {
  try{
    const token = await AsyncStorage.getItem('token')
    this.setState({test: token});
  } catch(error) {
    console.log(error);
  }
}

getData(){
  var start = 0;
  var count = 5;
  return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",{
    method:'GET',
    headers:{
      'X-Authorization': global.token,
    }
  }).then((response) => response.json()).then((responseJson) =>{
    console.log(responseJson);
    this.setState({
      isLoading: false,
      chitsList: responseJson,
    });
  }).catch((error) =>{
    console.log(error);
  })
}

getUserData(){
  console.log(global.user_id);
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id,{
    method:'GET',
    headers: {
      'X-Authorization': global.token,
    }
  }).then((response) => response.json()).then((responseJson) =>{
      this.setState({
        userData: {
          user_id: responseJson.user_id,
          given_name: responseJson.given_name,
          family_name: responseJson.family_name,
          email: responseJson.email,
        }
      });
      this.storeUserData();
      console.log(responseJson);
    }).catch((error) =>{
      console.log(error);
  });
}

storeUserData = async() =>{
  try{
    await AsyncStorage.setItem('userData', JSON.stringify(this.state.userData))
  } catch(error){
    console.log(error);
  }
}

FollowUser(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.searchItem + "/follow",{
    method:'POST',
    headers:{
      'X-Authorization': global.token,
    },
  }).then((response) =>{
    if(response.status == 200){
      alert("following");
    } else {
      alert('Something went wrong please try again later');
    }
  }).catch((error) => console.log(error));
}

  render(){
    if(this.state.isLoading){
      return(
        <View>
          <ActivityIndicator/>
        </View>)
    }

    return(
      <View>
        <TextInput placeholder="  Search  "
          onChangeText={(text) => this.setState({searchItem: text})}
          value={this.state.searchItem}/>
        <Button title="Submit" onPress={this.search}/>
        <Text>Home Screen</Text>
        <Text> token = {this.state.test}</Text>
        <FlatList
          data={this.state.chitsList}
          renderItem={ ({item}) =>
            <ScrollView style={styles.container}>
              <Text>{item.user.given_name + " " + item.user.family_name}</Text>
              <Text>{item.chit_content}</Text>
            </ScrollView>
        }
        keyExtractor={item => item.chit_id.toString()}
        />
      </View>
    );
  }

  componentDidMount = async() => {
    await this.getData();
    await this.getUserData();
    console.log("global token = " + global.token);
    //dont use await as these should be done in the background
    // without after the data has loaded
    this.asyncTest();
  }


}


const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000'
  },
});

export default HomeScreen;
