import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

// this screen will be used for both followers and following
// this.state.type is = followers || following
class Follow extends Component{
constructor(props){
  super(props);
  this.state = {
    type: this.props.navigation.state.params.type,
    data:"",
    user_id: this.props.navigation.state.params.user_id,
    isLoading: true,
  }
  this.getUser = this.getUser.bind(this);
  this.refresh = this.refresh.bind(this);
}

componentDidMount = async() => {
  await this.getData();
  this.setState({isLoading: false});
}

refresh(){
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
      this.setState({data: response});
        //console.log(this.state.followersDataJson);
    }
  }).catch((error)=>{
    console.log(error);
  });
}


getUser(user){
  if(user.user_id == global.user_id){
    this.props.navigation.push('UserProfile');
  } else {
    this.props.navigation.push('OtherUserProfile', { user_id: user.user_id});
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
        <Text>{this.state.type}</Text>

        <FlatList
          data={this.state.data}
          renderItem={ ({item}) =>
            <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => this.getUser(item)}>
              <Text>{item.given_name + " " + item.family_name}</Text>
            </TouchableOpacity>
            </ScrollView>

        }
        keyExtractor={item => item.user_id.toString()}
        />

        <Button title="HAA"
          onPress={this.refresh}/>
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
