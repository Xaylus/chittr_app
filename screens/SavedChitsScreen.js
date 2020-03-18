import React, {Component} from 'react';
import {Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


class savedChits extends Component{
  constructor(props){
    super(props);

    this.state = {
      name: "name",
      chitID: global.user_id +'savedDrafts',
      savedDrafts: "",
      time: "",
      date: "",
    }
    this.getSavedChits = this.getSavedChits.bind(this);
    this.deleteDraft = this.deleteDraft.bind(this);
    this.time = this.time.bind(this);
  }


componentDidMount(){
  this.getSavedChits();
}

 getSavedChits = async() =>{
  try{
    let temp = await AsyncStorage.getItem(this.state.chitID)
    console.log(temp);
      this.setState({savedDrafts: JSON.parse(temp)});
  } catch(error){
     console.log(error);
   }
 }

 deleteDraft = async(timestamp) => {
   let tempArray = this.state.savedDrafts;
   let newArray = tempArray.filter((draft) =>{
     return draft.timestamp !== timestamp;
   });

   try {
     let tempArray = JSON.stringify(newArray);
     await AsyncStorage.setItem(this.state.chitID, tempArray);
     this.setState({savedDrafts: newArray});
   } catch(error){
     console.log(error);
   }

 }

 time(item){
   let milliseconds = parseInt((item.timestamp % 1000) / 100);
   let seconds = Math.floor((item.timestamp / 1000) % 60);
   let minutes = Math.floor((item.timestamp / (1000 * 60)) % 60);
   let hours = Math.floor((item.timestamp / (1000 * 60 * 60)) % 24);

   return hours + ':' + minutes + ':' + seconds + ' on ' + item.date;
 }

  editChit(item){
    this.props.navigation.push('CreateChit', {timestamp: item.timestamp})
  }

  render(){
    return(
      <View>
      <Text>Text</Text>
      <FlatList
        data={this.state.savedDrafts}
        renderItem={ ({item}) =>
          <ScrollView style={styles.container}>
            <Text>{item.chit_content}</Text>
            <Text>created at {this.time(item)}</Text>
            <TouchableOpacity onPress={() => this.deleteDraft(item.timestamp)}>
              <Text> Delete </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.editChit(item)}>
              <Text> Edit </Text>
            </TouchableOpacity>
          </ScrollView>
      }
      keyExtractor={item => item.timestamp.toString()}
      />


      </View>


    )
  }
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000'
  },
});
export default savedChits;
