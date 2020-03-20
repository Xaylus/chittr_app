import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

class UpdateUserInfo extends Component{
constructor(props){
  super(props);
  this.state = {
    userData: this.props.navigation.state.params.userData,
    given_name: "",
    family_name: "",
    email: "",
    changePassword: false,
    old_password: "",
    new_password: "",
    confirm_password:"",
    gotImage: false,
    changedImage: false,
    Image:null
  }
  this.Submit = this.Submit.bind(this);
  this.Cancel = this.Cancel.bind(this);
  this.imagePicker = this.imagePicker.bind(this);
  this.renderImage = this.renderImage.bind(this);
  this.postProfilePicture = this.postProfilePicture.bind(this);
}

imagePicker(){
  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
  //const source = { uri: response.uri };
    console.log(response);
  // You can also display the image using data:
  // const source = { uri: 'data:image/jpeg;base64,' + response.data };

      this.setState({
        Image: response,
        changedImage: true,
      });
    }
  });
}

  componentDidMount(){
    this.setState({
      given_name: this.state.userData.given_name,
      family_name: this.state.userData.family_name,
      email: this.state.userData.email,
    });
    if(this.props.navigation.state.params.Image !== undefined){
      this.setState({
        Image: this.props.navigation.state.params.Image,
        gotImage: true,
      });
    }
  }

  Submit(){
    console.log( this.state.given_name + " " + this.state.family_name + " " +
                    this.state.email);

    if(this.state.changePassword){
      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id,{
        method:'PATCH',
        headers: {
          'Content-Type' : 'application/json',
          'X-Authorization': global.token,
        },
        body: JSON.stringify({
          given_name: this.state.given_name,
          family_name: this.state.family_name,
          email: this.state.email,
          password: this.state.new_password,
        })
      }).then((response) =>{
        if(response.status == '201'){
        //  alert("complete");
          if(this.state.changedImage){
            this.postProfilePicture();
          }
          this.props.navigation.navigate('UserProfile');
        } else{
          alert("error occurred");
        }
      }).catch((error)=>{
        console.log(error);
      });
    } else {
      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.user_id,{
        method:'PATCH',
        headers: {
          'X-Authorization': global.token,
        },
        body: JSON.stringify({
          given_name: this.state.given_name,
          family_name: this.state.family_name,
          email: this.state.email,
        })
      }).then((response) =>{
        if(response.status == '201'){
          //alert("complete");
          if(this.state.changedImage){
            this.postProfilePicture();
          }
          this.props.navigation.navigate('UserProfile');
        } else{
          alert("error occurred");
        }
      }).catch((error)=>{
        console.log(error);
      });
    }
  }

  postProfilePicture(){
    return fetch("http://10.0.2.2:3333/api/v0.0.5/user/photo",{
    method: 'POST',
    headers: {
      'X-Authorization': global.token
    },
    body: this.state.Image
  }).then((response) =>{
    if(response.status == 201){
      alert("completed");
      //this.props.navigation.navigate('Home');
    } else {
      alert("Something went wrong");
    }
  }).catch((error) => {
    console.log(error)
    });
  }

  Cancel(){
    this.props.navigation.navigate('UserProfile');
  }

  addPassword(){
    if(this.state.changePassword){
      return(
        <View>
        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Old Password: </Text>
          <TextInput placeholder="Old Password" style={styles.inputText} onChangeText={(text) => this.setState({old_password:text})}
            value={this.state.old_password} />
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>New Password: </Text>
          <TextInput placeholder="New Password" style={styles.inputText} onChangeText={(text) => this.setState({new_password:text})}
            value={this.state.new_password} />
        </View>

        <View style={styles.InputContainer}>
        <Text style={styles.longTitle}>Confirm Password: </Text>
          <TextInput placeholder="Confirm Password" style={styles.inputText} onChangeText={(text) => this.setState({confirm_password: text})}
            value={this.state.confirm_password} />
        </View>
        </View>

      );
    }
  }

renderImage(){
  if(this.state.gotImage){
    return(
      <View style={styles.imgContainer}>
        <Image style={styles.img}
          source={{uri : this.state.Image.uri}} />
      </View>
    )
  }

}
  render(){
    return(
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Update Information</Text>
        </View>
        {this.renderImage()}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.longButton} onPress={() => this.imagePicker()}>
            <Text>Change Profile Picture</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.InputContainer}>
        <Text style={styles.titles}>Forename: </Text>
          <TextInput style={styles.inputText} onChangeText={(text) => this.setState({given_name: text})}
            value={this.state.given_name} />
        </View>
        <View style={styles.InputContainer}>
        <Text style={styles.titles}>Surname: </Text>
          <TextInput style={styles.inputText} onChangeText={(text) => this.setState({family_name: text})}
            value={this.state.family_name}/>
        </View>
        <View style={styles.InputContainer}>
        <Text style={styles.titles}>Email: </Text>
          <TextInput style={styles.inputText} onChangeText={(text) => this.setState({email:text})}
            value={this.state.email} />
        </View>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.longButton} onPress={() => this.setState({changePassword: true})} >
            <Text> Change Password? </Text>
          </TouchableOpacity>
        </View>
        {this.addPassword()}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttons} onPress={() => this.Submit()} >
            <Text> Submit </Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={() => this.Cancel()} >
              <Text> Cancel </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    width: '80%',
    marginLeft: '10%',
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
  img:{
    width: 150,
    height: 150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  followingContainer:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  buttonsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  InputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  buttons:{
    width: '25%',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 10,
  },
  longButton:{
    width: '40%',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 10,
  },
  inputText:{
    width: '50%'
  },
  titles: {
    padding: 14,
    width: '25%'
  },
  longTitle:{
    padding: 14,
    width: '40%'
  }
});

export default UpdateUserInfo;
