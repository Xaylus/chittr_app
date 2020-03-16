import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

class UserProfile extends Component{
constructor(props){
  super(props);
  this.state = {
    user_id: this.props.navigation.state.params.user_id,
    userData: "",
    chitsList: "",
    isFollowing: false,
    following: {
      data: "",
      total: 0,
    },
    followers: {
      data: "",
      total: 0,
    },
    followButtonName: "Follow",
  }
  this.Followers = this.Followers.bind(this);
  this.Following = this.Following.bind(this);
  this.getUserData = this.getUserData.bind(this);
  this.getFollowersData = this.getFollowersData.bind(this);
  this.getFollowingData = this.getFollowingData.bind(this);
  this.isFollowing = this.isFollowing.bind(this);
  this.isFollowingRender = this.isFollowingRender.bind(this);
  this.FollowBtnPress = this.FollowBtnPress.bind(this);

}
getUserData(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id,{
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
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id + "/followers",{
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
      this.setState({
        followers: {
          data: response,
          total: tempArray.length,
        }
      });
    }
  }).catch((error)=>{
    console.log(error);
  });
}

getFollowingData(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id + "/following",{
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
      this.setState({
        following: {
          data: response,
          total: tempArray.length,
        }
      });

    }
  }).catch((error)=>{
    console.log(error);
  });
}

isFollowing(){
  if(global.following.idArray.includes(this.state.user_id)){
    console.log("IS FOLLOWING");
    this.setState({
      isFollowing: true,
      followButtonName: "Unfollow",
    });
  } else {
    console.log("NOT FOLLOWING");
    this.setState({
      isFollowing: false,
      followButtonName: "Follow",
    });
  }

}

isFollowingRender(){
  if(this.state.isFollowing){
    return(
        <Text> {this.state.userData.given_name} follows you! </Text>
    );
  }
}
componentDidMount = async() =>{
  await this.getUserData();
  await this.getFollowersData();
  await this.getFollowingData();
  this.isFollowing();
}

Followers(){
  this.props.navigation.push('Followers', { type: 'followers', user_id: this.state.user_id});
}
Following(){
  this.props.navigation.push('Followers', {type: 'following', user_id: this.state.user_id});
}

FollowUser(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id + "/follow",{
    method:'POST',
    headers:{
      'X-Authorization': global.token,
    },
  }).then((response) =>{
    if(response.status == 200){
      this.setState({
        isFollowing: false,
        followButtonName: "UnFollow",
        followers: {
          data: this.state.followers.data.filter(user => user.user_id !== global.user_id),
          total: this.state.followers.total + 1,
        }
      });
      global.following.idArray = [global.following.idArray, this.state.user_id];
      global.following.total = global.following.idArray.length;
      alert("following");
    } else {
      alert('Something went wrong please try again later');
    }
  }).catch((error) => console.log(error));
}

UnfollowUser(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id + "/follow",{
    method:'DELETE',
    headers:{
      'X-Authorization': global.token,
    },
  }).then((response) =>{
    if(response.status == 200){
      this.setState({
        isFollowing: false,
        followButtonName: "Follow",
        followers: {
          data: this.state.following.data.filter(user => user.user_id !== global.user_id),
          total: this.state.followers.total - 1,
        }
      });
      global.following.idArray = global.following.idArray.filter(id => id !== this.state.user_id); // if worked
      alert("Unfollowed!");
    } else {
      alert('Something went wrong please try again later');
    }
  }).catch((error) => console.log(error));
}

FollowBtnPress(){
  //Follower count and following count
  if(this.state.isFollowing){
    // unfollow stuff
    this.UnfollowUser();
  } else {
    //Follow user
    this.FollowUser();
  }
  console.log(global.following.idArray);
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
        <Button title="Followers"
          onPress={this.Followers} />
        <Button title="Following"
        onPress={this.Following} />
        <Text> Num of Following = {this.state.following.total}</Text>
        <Text> Num of Followers = {this.state.followers.total}</Text>
        <Button title={this.state.followButtonName}
          onPress={this.FollowBtnPress} />
          {this.isFollowingRender()}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000'
  },
});

export default UserProfile;
