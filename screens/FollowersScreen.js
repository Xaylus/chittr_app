import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// this screen will be used for both followers and following
// this.state.type is = followers || following
class Follow extends Component{
constructor(props){
  super(props);
  this.state = {
    type: this.props.navigation.state.params.type,
    user_id: this.props.navigation.state.params.user_id,
    followersDataJson: "",
    followersArray : [],
    totalFollow : 0,
  }
  this.getUser = this.getUser.bind(this);
  this.populateArray = this.populateArray.bind(this);
}

componentDidMount(){
  this.getData();
  //this.populateArray();
}

getData() {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id + "/" + this.state.type,{
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
      this.setState({followersDataJson: response});
        //console.log(this.state.followersDataJson);
    }
  }).catch((error)=>{
    console.log(error);
  });
}

populateArray(){
  //this.setState({totalFollow: this.state.followersDataJson.length});
  console.log(this.state.followersDataJson);
  //var data = JSON.parse(this.state.followersDataJson);
  try{
    this.setState({followersArray : this.state.followersDataJson.map(function(item){
      return item.user_id
    })});

    return true;
  } catch(error){
    console.log(error);
    return false;
  }

}

setNumbers = async() => {
  const answer = await this.populateArray();
  if(answer){
    console.log(this.state.followersArray);
    this.setState({totalFollow: this.state.followersArray.length});
  } else {
    console.log("nothing");
  }
}

getUser(user){
  if(user.user_id == global.user_id){
    this.props.navigation.push('UserProfile');
  } else {
    this.props.navigation.push('OtherUserProfile', { userJson: user});
  }
}

  render(){
    return(
      <View>
        <Text>{this.state.type}</Text>
        <Text>{this.state.user_id}</Text>
        <Text>{this.state.totalFollow}</Text>

        <FlatList
          data={this.state.followersDataJson}
          renderItem={ ({item}) =>
            <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => this.getUser(item)}>
              <Text>{item.given_name + " " + item.family_name}</Text>
            </TouchableOpacity>
            </ScrollView>
        }
        keyExtractor={item => item.user_id.toString()}
        />

        <Button title="FUCK YOU" onPress={this.setNumbers} />
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

export default Follow;
