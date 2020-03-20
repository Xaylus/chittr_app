import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
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
          <TextInput placeholder="Old Password"
          onChangeText={(text) => this.setState({old_password:text})}
          value={this.state.old_password} />

          <TextInput placeholder="New Password"
          onChangeText={(text) => this.setState({new_password:text})}
          value={this.state.new_password} />

          <TextInput placeholder="Confirm password"
          onChangeText={(text) => this.setState({confirm_password: text})}
          value={this.state.confirm_password} />
        </View>
      );
    }
  }

renderImage(){
  if(this.state.gotImage){
    return(
      <View>
        <Image style={{width: 50, height: 50}}
          source={{uri : this.state.Image.uri}} />
      </View>
    )
  }

}
  render(){
    return(
      <View>
        <Text>My Profile</Text>
        {this.renderImage()}
        <Button title="Change profile picture"
        onPress={() => this.imagePicker()} />
        <TextInput onChangeText={(text) => this.setState({given_name: text})}
        value={this.state.given_name} />
        <TextInput onChangeText={(text) => this.setState({family_name: text})}
        value={this.state.family_name}/>
        <TextInput onChangeText={(text) => this.setState({email:text})}
        value={this.state.email} />

        <TouchableOpacity onPress={() => this.setState({changePassword: true})} >
          <Text> Change Password? </Text>
        </TouchableOpacity>
        {this.addPassword()}

        <Button title="Submit"
        onPress={this.Submit} />
        <Button title="Cancel"
        onPress={this.Cancel} />

      </View>
    );
  }
}

export default UpdateUserInfo;
