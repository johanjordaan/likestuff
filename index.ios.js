'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Camera from 'react-native-camera';

class LikeStuffApp extends Component {
   constructor () {
		super();
      this.watchID = null;
		this.state = {
         lastPosition: 'unknown',
		};
	}

   componentDidMount() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var initialPosition = JSON.stringify(position);
          this.setState({initialPosition});
        },
        (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPosition = JSON.stringify(position);
        this.setState({lastPosition:lastPosition});
      });
    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }


  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureAudio={false}>
          <Text>
          <Text style={styles.title}>Initial position: </Text>
          {this.state.initialPosition}
        </Text>
          <Text style={styles.capture} onPress={this.lovePicture.bind(this)}>[Love]</Text>
          <Text style={styles.capture} onPress={this.hatePicture.bind(this)}>[Hate]</Text>
        </Camera>
      </View>
    );
  }

  lovePicture() {
     var location = ""; //TODO : get location
     this.handlePicture("love",location).then(()=>{

     });
 }

  hatePicture() {
     var location = ""; //TODO : get location
     this.handlePicture("hate",location).then(()=>{
     });
  }

  handlePicture(caption,location) {
     return this.camera.capture().then((data)=>{
       // Send caption - with picture to server
       // Remove from your camera roll?
       // Send the picture to the server for processing
     }).catch((err)=>{
       // TODO : Do something with the error
     })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

AppRegistry.registerComponent('likestuff', () => LikeStuffApp);
