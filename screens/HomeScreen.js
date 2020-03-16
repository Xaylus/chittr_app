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
  }

  global.followers = {
    data: "",
    idArray: [],
    total: 0,
    isChanged: false,
  };

  global.following ={
    total: "",
    idArray: [],
    total: 0,
    isChanged: false,
  };

  this.search = this.search.bind(this);
  this.getFollowersData = this.getFollowersData.bind(this);
  this.getFollowingData = this.getFollowingData.bind(this);
  this.FollowUser = this.FollowUser.bind(this);
  this.asyncTest = this.asyncTest.bind(this);
  //this.getData = this.getData.bind(this);
}

search = () => {
  //let query = "SELECT * FROM "
  /*return fetch("http://10.0.2.2:3333/api/v0.0.5/search_user/" + this.state.searchItem,{
    method:'GET'
  }).then((response) => response.json()).then((responseJson) => {
    this.props.navigation.navigate('UserProfile', {
      userJson: responseJson,
    });
  }).catch((error) => {
    console.log(error);
  })*/
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
  return fetch("http://10.0.2.2:3333/api/v0.0.5/chits?start=" + start + "&count=" + count,{
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

getFollowersData(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id + "/followers",{
    method:'GET',
    headers:{
      'X-Authorization': global.token,
    }
  }).then((response) =>{
    if(response.status == '200'){
      return response.json();
    } else return "Err";
  }).then((response) =>{
    if(response == 'Err'){
      alert('nothing found');
    }else{
      const tempArray = response.map(function(item){
        return item.user_id
      });
        global.followers.data = response;
        global.followers.idArray = tempArray;
        global.followers.total = tempArray.length;
    }
  }).catch((error)=>{
    console.log(error);
  });
}

getFollowingData(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id + "/following",{
    method:'GET',
    headers:{
      'X-Authorization': global.token,
    }
  }).then((response) =>{
    if(response.status == '200'){
      return response.json();
    } else return "Err";
  }).then((response) =>{
    if(response == 'Err'){
      alert('nothing found');
    }else{
      console.log(response);
      const tempArray = response.map(function(item){
        return item.user_id
      });
      global.following.data = response;
      global.following.idArray = tempArray;
      global.following.total = tempArray.length;
      console.log(global.following.total);
    }
  }).catch((error)=>{
    console.log(error);
  });
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
        <Button title="Submit" onPress={this.FollowUser}/>
        <Text>Home Screen</Text>
        <Text>{global.following.total}</Text>
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
    console.log("global token = " + global.token);

    //dont use await as these should be done in the background
    // without after the data has loaded
    this.asyncTest();
    this.getFollowersData();
    this.getFollowingData();
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
