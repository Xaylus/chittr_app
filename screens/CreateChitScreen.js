import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

class CreateChit extends Component{
constructor(props){
  super(props);
  this.state = {
      name: 'name',
      location: "",
      timestamp: 0,
      longitude: 0,
      latitude: 0,
      geoLocationPermission: false,
      chitText:"",
      TextLength : 0,
      userData: "",
      photo: "",
      isDraft: false,
      time : "",
      date: "",
      chitVar: global.user_id + 'savedDrafts',
      hasCoordinates: false,
  }


    this.requestLocationPermission = this.requestLocationPermission.bind(this);
    this.findCoordinates = this.findCoordinates.bind(this);
    this.storeGeoLocationPermission = this.storeGeoLocationPermission.bind(this);
    this.getGeoLocationPermissionValue = this.getGeoLocationPermissionValue.bind(this);
    this.postChit = this.postChit.bind(this);
    this.savedChits = this.savedChits.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.returningDraft = this.returningDraft.bind(this);
    this.getTime = this.getTime.bind(this);
    this.cancelChanges = this.cancelChanges.bind(this);
    this.removePostedDraft = this.removePostedDraft.bind(this);
  }

  returningDraft = async() =>{
    if(this.props.navigation.state.params !== undefined){
      this.setState({
        isDraft: true,
        timestamp: this.props.navigation.state.params.timestamp,
      });
      try{
        var draftsArray = await AsyncStorage.getItem(this.state.chitVar);
        draftsArray = JSON.parse(draftsArray);

        var draft = draftsArray.filter((item) => {return item.timestamp === this.state.timestamp});
        console.log(draft);
        this.setState({
          chitText: draft[0].chit_content,
          TextLength: draft[0].chit_content.length,
          latitude: draft[0].latitude,
          longitude: draft[0].longitude,
          date: draft[0].date,
        });

        let ts = this.state.timestamp;
        let milliseconds = (ts % 1000) / 100;
        let secs = Math.floor((ts/ 1000) % 60);
          secs = (secs < 10) ? "0" + secs : secs;
        let mins = Math.floor((ts / (1000 * 60)) % 60);
          mins = (mins < 10) ? "0" + mins : mins;
        let hrs = Math.floor((ts / (1000 * 60 * 60)) % 24);
          hrs = (hrs < 10) ? "0" + hrs : hrs;

        let timeString =  hrs + ':' + mins + ':' + secs + ' on ' + this.state.date;
        this.setState({
          time: timeString,
        });
      } catch(error){
        console.log(error);
      }
    }
  }

  cancelChangesRender(){
    if(this.state.isDraft){
      return(
        <Button title="cancel changes"
          onPress={this.cancelChanges} />
      )
    }
  }

  coordinatesRender(){
    if(this.state.hasCoordinates){
      return(
        <Text>Coordinates = {this.state.longitude},{this.state.latitude}</Text>
      )
    }
  }

  cancelChanges(){
    this.setState({
      isDraft: false,
      chitText: "",
      TextLength: 0,
    });
    this.getTime();
  }

  /*returningDraft(){
    if(this.props.navigation.state.params !== undefined){
      this.setState({
        isDraft: true,
        chitText: this.props.navigation.state.params.chit.chit_content,
        TextLength: this.props.navigation.state.params.chit.chit_content.length,
        latitude: this.props.navigation.state.params.chit.latitude,
        longitude: this.props.navigation.state.params.chit.longitude,
        timestamp: this.props.navigation.state.params.chit.timestamp,
        date: this.props.navigation.state.params.chit.date,
      });
      console.log("SAVED TIMESTAMP " + this.props.navigation.state.params.chit.date);
      console.log("state timestamp " + this.state.date);
      let ts = this.props.navigation.state.params.chit.timestamp;
      let milliseconds = (ts % 1000) / 100;
      let secs = Math.floor((ts/ 1000) % 60);
        secs = (secs < 10) ? "0" + secs : secs;
      let mins = Math.floor((ts / (1000 * 60)) % 60);
        mins = (mins < 10) ? "0" + mins : mins;
      let hrs = Math.floor((ts / (1000 * 60 * 60)) % 24);
        hrs = (hrs < 10) ? "0" + hrs : hrs;

      let timeString =  hrs + ':' + mins + ':' + secs + ' on ' + this.props.navigation.state.params.chit.date;
      this.setState({
        time: timeString,
      });
    }
  }*/

  getTime(){
    let date = new Date().getDate(); //Current Date
      date = (date < 10) ? "0" + date : date;
    let month = new Date().getMonth() + 1; //Current Month
      month = (month < 10) ? "0" + month : month;
    let year = new Date().getFullYear(); //Current Year
      year = (year < 10) ? "0" + year : year;
    let hrs = new Date().getHours(); //Current Hours
      hrs = (hrs < 10) ? "0" + hrs : hrs;
    let mins = new Date().getMinutes(); //Current Minutes
      mins = (mins < 10) ? "0" + mins : mins;
    let secs = new Date().getSeconds(); //Current Seconds
      secs = (secs < 10) ? "0" + secs : secs;

    let time = hrs + ':' + mins + ':' + secs;
    let dateString = date + '/' + month + '/' + year

    let timeString =  time + ' on ' + dateString;
    this.setState({
      time: timeString,
      timestamp: Date.now(),
      date: dateString,
    });
  }

  requestLocationPermission = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
          title: 'Lab04 Location Permission',
          message:'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({geoLocationPermission: true});
        console.log('You can access location');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
    this.storeGeoLocationPermission();
  }

  getUserData = async() => {
    try{
      let userData = await AsyncStorage.getItem('userData')
      this.setState({userData: userData});
      console.log("userData = "  + this.state.userData);
    } catch(error){
      console.log(error);
    }
  }

  storeGeoLocationPermission = async() =>{
      try{
        await AsyncStorage.setItem('geoLocationPermission', JSON.stringify(this.state.permission))
      } catch(error){
        console.log(error);
      }
  }

  getGeoLocationPermissionValue = async() => {
    try{
      let value = await AsyncStorage.getItem('geoLocationPermission')
      this.setState({geoLocationPermission: Boolean(value)});
    } catch(error) {
      console.log(error);
    }
  }

  postChit(){

    console.log("draft  = " + this.state.isDraft);
    if(!this.state.isDraft){
        this.getTime();
    }

    return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        'X-Authorization': global.token,
      },
      body: JSON.stringify({
        chit_id: 0,
        timestamp: this.state.timestamp,
        chit_content: this.state.chitText,
        location: {
          longitude: this.state.longitude,
          latitude: this.state.latitude,
        },
        user: {
          user_id:this.state.userData.user_id,
          given_name: this.state.userData.given_name,
          family_name: this.state.userData.family_name,
          email: this.state.userData.email,
        },
      })
    }).then((response) =>{
      if(response.status == 201){
        alert("Chit posted");
        if(this.state.isDraft){
          this.removePostedDraft();

        }
      } else {
        alert('Something went wrong please try again later');
      }
    }).catch((error) => console.log(error));

  }

  removePostedDraft = async() =>{
    try{
      var draftsArray = await AsyncStorage.getItem(this.state.chitVar);
      draftsArray = JSON.parse(draftsArray);

      var draft = draftsArray.filter((item) => {
        return item.timestamp !== this.state.timestamp;
      });
      console.log("DRAFTTTTTTTTTTTT" + draft[0]);
      draft = JSON.stringify(draft);
      await AsyncStorage.setItem(this.state.chitVar, draft);
    }catch(error){
      console.log(error);
    }
  }
  savedChits(){
    this.props.navigation.navigate('SavedChits');
  }

  saveDraft = async() =>{
    console.log(this.state.isDraft);
    if(!this.state.isDraft){
    let temp = await this.findCoordinates();
    this.getTime();
    }
        console.log("latitude! = " + this.state.latitude);
    let chit = {
      chit_content: this.state.chitText,
      photo: this.state.photo,
      timestamp: this.state.timestamp,
      date: this.state.date,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };
    try{
      let savedDrafts =[];
      let currentDrafts = await AsyncStorage.getItem(this.state.chitVar)
      //console.log(currentDrafts);

      if(currentDrafts !== null){
        currentDrafts = JSON.parse(currentDrafts);
        currentDrafts.push(chit);
        currentDrafts = JSON.stringify(currentDrafts);
      //  console.log(currentDrafts);
        await AsyncStorage.setItem(this.state.chitVar, currentDrafts);
        //savedDrafts.push(currentDrafts);
      } else {
        savedDrafts.push(chit);
        savedDrafts = JSON.stringify(savedDrafts);
        //console.log(savedDrafts);
        await AsyncStorage.setItem(this.state.chitVar, savedDrafts);
    }
    } catch(error){
      console.log(error);
    }
    //return await AsyncStorage.removeItem(chitVar)
  }

  findCoordinates(){
    if(this.state.geoLocationPermission || !this.state.isDraft){
      Geolocation.getCurrentPosition((position) => {
        let location = JSON.stringify(position);
        location = JSON.parse(location);
        console.log(location);
        this.setState({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          hasCoordinates: true,
      });
      },(error) => {
        alert(error.message);
        return false;
      },{
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      });
      return true;
    }
  }

  componentDidMount(){
    this.getUserData();
    this.getGeoLocationPermissionValue();
    if(!this.state.permission){
      this.state.permission = this.requestLocationPermission();
    }
    this.getTime();
    this.returningDraft();
  }

  render(){
    return(
      <View>
        <Text>Create Chits</Text>
        <Text>{this.state.name}</Text>
        <TextInput placeholder =" Chit Text"
          onChangeText={(text) => this.setState({chitText: text, TextLength: text.length})}
          value={this.state.chitText}
          maxLength={144}
          multiLine={true}
        />
        <Text> Characters used = {this.state.TextLength} / 144</Text>
        <Text> Created at {this.state.time} </Text>
        {this.coordinatesRender()}
        <Text>{this.state.location}</Text>
        <Button title="Post"
        onPress={this.postChit} />
        <Button title="Saved Chits"
        onPress={this.savedChits} />
        <Button title="Save draft"
        onPress={this.saveDraft}/>
        <Button title="set location"
          onPress={this.findCoordinates} />
        {this.cancelChangesRender()}



      </View>
    );
  }
}

export default CreateChit;
