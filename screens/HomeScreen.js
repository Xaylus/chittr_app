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

class HomeScreen extends Component{
constructor(props){
  super(props);
  this.state = {
    isLoading: true,
    searchItem: "",
    chitsList: [],
  }

  this.search = this.search.bind(this);
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

getData(){
  var start = 0;
  var count = 3;
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
        <Text>{global.token}</Text>
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

export default HomeScreen;
