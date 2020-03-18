import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator
 } from 'react-native';
 import AsyncStorage from '@react-native-community/async-storage';


class MyProfile extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      userData: "",
      chitsList: "",
      temp: false,
      followersTotal: 0,
      followingTotal:0,
      followersDataJson: "",
    }
    this.Logout = this.Logout.bind(this);
    this.UpdateInfo = this.UpdateInfo.bind(this);
    this.Followers = this.Followers.bind(this);
    this.Following = this.Following.bind(this);
  }



//Get original user followers for verification, does not need to save them
//
getUserData(){
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
      console.log("something went wrong");
    }else{
      let tempArray = response.map(function(item){
        return item.user_id
      });
      this.setState({followersTotal: tempArray.length});
      console.log(tempArray + "IHIHIHIHIHIHIH" + this.state.followersTotal);
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
      console.log("Something went wrong");
    }else{
      console.log(response);
      let tempArray = response.map(function(item){
        return item.user_id
      });
      this.setState({followingTotal: tempArray.length});
      console.log(tempArray + "FOLLOWING" + this.state.followingTotal);

    }
  }).catch((error)=>{
    console.log(error);
  });
}

  Logout(){
    return fetch("http://10.0.2.2:3333/api/v0.0.5/logout",{
      method:'POST',
      headers: {
        'X-Authorization': global.token,
      }
    }).then((response) => {
      if(response.status == '200'){
        this.clearToken();
        this.props.navigation.navigate('Login');
      } else {
        alert("Something went wrong");
      }
      }).catch((error) =>{
        console.log(error);
    });
  }

  clearToken = async() =>{
    try {
      await AsyncStorage.removeItem('token')
    } catch(error) {
      console.log(error);
    }
  }

  UpdateInfo(){
    this.props.navigation.navigate('UpdateUserInfo', { userData: this.state.userData});
  }

  Followers(){
    this.props.navigation.push('Followers', { type: 'followers', user_id: global.user_id});
  }
  Following(){
    this.props.navigation.push('Followers', {type: 'following', user_id: global.user_id});
  }
  putThis(){
    return(
      <View>
        <Text>{this.state.followingTotal}</Text>
      </View>
    )
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
        <Text>My Profile</Text>
        <Text>{this.state.userData.given_name + " " + this.state.userData.family_name}</Text>
        <Text>Num Followers = {this.state.followersTotal}</Text>
        <Text>Num Following = {this.state.followingTotal}</Text>
        <Button title="Logout"
        onPress={this.Logout} />
        <Button title="Update"
        onPress={this.UpdateInfo} />

        <FlatList
          data={this.state.chitsList}
          renderItem={ ({item}) =>
            <ScrollView style={styles.container}>
              <Text>{item.chit_content}</Text>
            </ScrollView>
          }
          keyExtractor={item => item.chit_id.toString()}
          />
          <Button title="Followers"
          onPress={this.Followers} />
          <Button title="Following"
          onPress={this.Following} />
          {this.putThis()}
      </View>

    );
  }

  componentDidMount = async() => {
    await this.getUserData();
    await this.getFollowersData();
    await this.getFollowingData();
    this.setState({isLoading: false});
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
