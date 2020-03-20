import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

class UserProfile extends Component{
constructor(props){
  super(props);
  this.state = {
    user_id: this.props.navigation.state.params.user_id,
    userData: "",
    chitsList: "",
    isFollowingYou: false,
    youFollowingUser: false,
    followingTotal: 0,
    followersTotal:0,
    followButtonName: "Follow",
    isLoading: true,
    Image: null,
    gotImage: false,
  }
  this.Followers = this.Followers.bind(this);
  this.Following = this.Following.bind(this);
  this.getUserData = this.getUserData.bind(this);
  this.getFollowersData = this.getFollowersData.bind(this);
  this.getFollowingData = this.getFollowingData.bind(this);
  this.isFollowingRender = this.isFollowingRender.bind(this);
  this.FollowBtnPress = this.FollowBtnPress.bind(this);
  this.renderImage = this.renderImage.bind(this);
  this.getprofilePicture = this.getprofilePicture.bind(this);

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
      let tempArray = response.map(function(item){
        return item.user_id
      });
      if(tempArray.includes(global.user_id)){
        this.setState({
          youFollowingUser: true,
          followButtonName: "Unfollow",
        });
      }
      this.setState({followersTotal: tempArray.length});
    }
  }).catch((error)=>{
    console.log(error);
  });
}

getprofilePicture(){
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id + "/photo",{
  method: 'GET',
}).then((response) =>{
  if(response.status == 200){
    console.log(response);
    this.setState({
      Image: response,
      gotImage: true,
    });
  } else {
    alert("Something went wrong IMAGE ");
  }
}).catch((error) => {
  console.log(error)
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
      let tempArray = response.map(function(item){
        if(item.user_id == global.user_id){
          this.setState({isFollowingYou: true});
        }
        return item.user_id
      });
      this.setState({followingTotal: tempArray.length});
    }
  }).catch((error)=>{
    console.log(error);
  });
}

isFollowingRender(){
  if(this.state.isFollowingYou){
    return(
        <Text> {this.state.userData.given_name} follows you! </Text>
    );
  }
}
componentDidMount = async() =>{
  await this.getUserData();
  await this.getFollowersData();
  await this.getFollowingData();
  this.setState({isLoading: false});
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
        youFollowingUser: true,
        followButtonName: "UnFollow",
        followersTotal: this.state.followersTotal +1,
      });
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
        youFollowingUser: false,
        followButtonName: "Follow",
        followersTotal: this.state.followersTotal - 1,
      });
      alert("Unfollowed!");
    } else {
      alert('Something went wrong please try again later');
    }
  }).catch((error) => console.log(error));
}

FollowBtnPress(){
  //Follower count and following count
  if(this.state.youFollowingUser){
    // unfollow stuff
    this.UnfollowUser();
  } else {
    //Follow user
    this.FollowUser();
  }
}

renderImage(){
  if(this.state.gotImage){
    return(
      <Image style={{width: 50, height: 50}}
        source={{uri : this.state.Image.url}} />
    )
  }

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
        {this.renderImage()}
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
        <Text> Num of Following = {this.state.followingTotal}</Text>
        <Text> Num of Followers = {this.state.followersTotal}</Text>
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
