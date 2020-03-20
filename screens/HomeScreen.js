import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class HomeScreen extends Component{
constructor(props){
  super(props);
  this.state = {
    isLoading: true,
    isSearching: false,
    searchResult: [],
    searchItem: "",
    chitsList: [],
    test: "",
    userData: "",
    id: 0,
  }
  global.idArray = [];
  global.response ="";
  this.search = this.search.bind(this);
  this.FollowUser = this.FollowUser.bind(this);
  this.getToken = this.getToken.bind(this);
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
    this.setState({
      searchResult: responseJson,
      isSearching: true,
    })
    //console.log(responseJson.user_id);
  //  this.props.navigation.navigate('OtherUserProfile', {
  //    user_id: responseJson.user_id,
  //  });
  }).catch((error) => {
    console.log(error);
  })
  this.props.navigation.navigate('UserProfile');
}

getToken = async() => {
  try{
    const token = await AsyncStorage.getItem('token')
    const user_id = await AsyncStorage.getItem('user_id')
    this.setState({test: token});
    global.token = token;
    global.user_id = user_id;
  } catch(error) {
    console.log(error);
  }
}

getData(){
  var start = 0;
  var count = 20;
  return fetch("http://10.0.2.2:3333/api/v0.0.5/chits?start=" + start +"&count=" + count,{
    method:'GET',
    headers:{
      'X-Authorization': global.token,
    }
  }).then((response) => response.json()).then((responseJson) =>{
    console.log(responseJson);
    this.setState({
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

getRenderImage = (item) =>{
  let id = item.chit_id;
  var url = "";
  var temp = false;
  this.getImage(item.chit_id).then((response) => {
       //console.log("temp = " + temp);
       console.log("global response = " + global.response);

       url = global.response.url;
       console.log("UWL = " +url);
       console.log("RESPONSE + " + global.response);
      return(
          <View>
            <Image style={{width: 50, height: 50}}
              source={{uri : url}} />
          </View>
      );

   });
    return(
        <View>
          <Image style={{width: 50, height: 50}}
            source={{uri :global.response.url}} />
        </View>
    );

  }




getImage = async(chitID)=>{
  //console.log("GET IMAGEEEEEEEEEEEEEEEEE");
  return fetch("http://10.0.2.2:3333/api/v0.0.5/chits/" + chitID +"/photo",{
    method:'GET',
  }).then((response) =>{
    if(response.status == 200 || response.status == 304){
      //console.log(response);
      global.response = response;

      return true;
    } else if(response.status == 404){
      return false;
    }
  }).catch((error) => {
    //console.log(error);
    return false;
  })
}

navigateToUserScreen(user){
  this.props.navigation.navigate('OtherUserProfile', { user_id: user.user_id});
}

  render(){
    if(this.state.isLoading){
      return(
        <View>
          <ActivityIndicator/>
        </View>)
    }
    if(this.state.isSearching){
      return(
        <View>
        <View style={styles.headerContainer}>
                <Text style={styles.header}>Home Screen</Text>
        </View>
        <TextInput placeholder="  Search  "
          onChangeText={(text) => this.setState({searchItem: text})}
          value={this.state.searchItem}/>
          <TouchableOpacity style={styles.button} onPress={() => this.setState({isSearching: false, searchItem: ""})}>
            <Text> Cancel </Text>
          </TouchableOpacity>
        <Button title="Submit" onPress={this.search}/>
        <FlatList
          data={this.state.searchResult}
          renderItem={ ({item}) =>
            <TouchableOpacity onPress={()=>this.navigateToUserScreen(item)} >
              <ScrollView style={styles.container}>
                <Text>{item.given_name + " " + item.family_name}</Text>
                <Text>{item.email}</Text>
                </ScrollView>
            </TouchableOpacity>
          }
          keyExtractor={item => item.user_id.toString()}
          />
        </View>
      )
    }

    return(
      <View style={styles.view}>
      <View style={styles.headerContainer}>
              <Text style={styles.header}>Home Screen</Text>
      </View>
        <TextInput style={styles.search}placeholder="  Search  "
          onChangeText={(text) => this.setState({searchItem: text})}
          value={this.state.searchItem}/>
        <Button title="Submit" onPress={this.search}/>
        <FlatList style={styles.flatList}
          data={this.state.chitsList}
          renderItem={ ({item}) =>
            <ScrollView style={styles.container}>
              <Text>{item.user.given_name + " " + item.user.family_name}</Text>
              {this.getRenderImage(item)}
              <Text>{item.chit_content}</Text>
            </ScrollView>
        }
        keyExtractor={item => item.chit_id.toString()}
        />
      </View>
    );
  }

  componentDidMount = async() => {
    await this.getToken();
    await this.getData();
    await this.getUserData();
    this.setState({isLoading:false});
    console.log("global token = " + global.token);
    //dont use await as these should be done in the background
    // without after the data has loaded
  }


}


const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    width: '90%',
    marginLeft: '5%',
    margin: '1%'
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
  search: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 10,
    paddingLeft: 10,
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

export default HomeScreen;
