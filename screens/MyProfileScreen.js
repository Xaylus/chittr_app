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

class MyProfile extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      userData: "",
      chitsList: "",
      temp: false,
      followers: {
        data: global.followers.data,
        idArray: global.followers.idArray,
        total: global.followers.total,
      },
      following: {
        data: global.following.data,
        idArray: global.following.idArray,
        total: global.following.total,
      },
      followersDataJson: "",
    }
    this.Logout = this.Logout.bind(this);
    this.UpdateInfo = this.UpdateInfo.bind(this);
    this.Followers = this.Followers.bind(this);
    this.Following = this.Following.bind(this);
    this.getFollowersData = this.getFollowersData.bind(this);
    this.getFollowingData = this.getFollowingData.bind(this);
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
        this.props.navigation.navigate('Login');
      } else {
        alert("Something went wrong");
      }
      }).catch((error) =>{
        console.log(error);
    });
  }

  UpdateInfo(){
    this.props.navigation.navigate('UpdateUserInfo', { userData: this.state.userData});
  }

  Followers(){
    this.props.navigation.navigate('Followers', { type: 'followers', data: this.state.followers});
  }
  Following(){
    this.props.navigation.navigate('Followers', {type: 'following', data: this.state.following});
  }
  putThis(){
    return(
      <View>
        <Text>{this.state.following.idArray}</Text>
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
        <Text>Num Followers = {global.followers.total}</Text>
        <Text>Num Following = {global.following.total}</Text>
        <Button title="Logout"
        onPress={this.Logout} />

        <Text>Number of followers = {this.state.followers.total}</Text>
        <Text>Number of following = {this.state.following.total}</Text>
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

          <Button title="HA"
          onPress={() => console.log("nothing")} />

          {this.putThis()}
      </View>

    );
  }

  componentDidMount = async() => {
    await this.getUserData();
    if(global.followers.isChanged ){
      await this.getFollowersData();
    }
    if(global.following.isChanged){
      await this.getFollowingData();
    }
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
