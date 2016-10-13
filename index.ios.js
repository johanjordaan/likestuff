'use strict';
import React, { Component } from 'react';
import {
   AppRegistry,
   Dimensions,
   StyleSheet,
   Text,
   TouchableHighlight,
   View,
   Image,
} from 'react-native';
import Camera from 'react-native-camera';
var RNFS = require('react-native-fs');
var CryptoJS = require('crypto-js');

const CAMERA = 'camera';
const AFTER = 'after';

class LikeStuffApp extends Component {
   constructor () {
	   super();
      this.watchID = null;
      this.lovePicture = this.lovePicture.bind(this);
      this.hatePicture = this.hatePicture.bind(this);
		this.state = {
         currentScreen: CAMERA,
         lastPosition: 'unknown',
		};
	}

   componentDidMount() {
      navigator.geolocation.getCurrentPosition((position) => {
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

   testFS () {
   RNFS.readDir(RNFS.DocumentDirectoryPath)
     .then((result) => {
      console.log('GOT RESULT', result);

      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
     })
     .then((statResult) => {
      if (statResult[0].isFile()) {
         // if we have a file, read it
         return RNFS.readFile(statResult[1], 'utf8');
      }

      return 'no file';
     })
     .then((contents) => {
      // log the file contents
      console.log(contents);
     })
     .catch((err) => {
      console.log(err.message, err.code);
     });
  }


   renderCamera() {
      return (
        <View style={styles.container}>
         <Camera
            ref="camera"
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            captureTarget={Camera.constants.CaptureTarget.disk}
            captureAudio={false}>
            <Text>
               <Text style={styles.title}>Initial position: </Text>
               {this.state.initialPosition}
            </Text>
            <Text style={styles.capture} onPress={this.lovePicture}>[Love]</Text>
            <Text style={styles.capture} onPress={this.hatePicture}>[Hate]</Text>
         </Camera>
        </View>
      );
   }
   renderAfter() {
      return (
         <View style={styles.container}>
            <Text style={styles.capture} onPress={this.doAfter.bind(this)}>[Back]</Text>
            <Image style={styles.preview} source={{uri: this.state.photo.path}}/>
         </View>
      );
   }

   render() {
      console.log("Here ...",this.state.currentScreen)
      if(this.state.currentScreen === CAMERA) {
         return this.renderCamera();
      } else {
         return this.renderAfter();
      }
   }

   doAfter() {
      this.setState({currentScreen:CAMERA});
   }

   lovePicture() {
      var location = ""; //TODO : get location
      this.handlePicture("love",this.state.lastPosition).then(()=>{
         this.testFS();
      });
   }

   hatePicture() {
      var location = ""; //TODO : get location
      this.handlePicture("hate",this.state.lastPosition).then(()=>{
         this.testFS();
      });
   }



   uploadImagex(uri,tags) {
     let timestamp = (Date.now() / 1000 | 0).toString();
     let api_key = config.KEY
     let api_secret = config.SECRET
     let cloud = config.CLOUD
     let hash_string = 'tags='+tags+'&timestamp=' + timestamp + api_secret;
     let signature = CryptoJS.SHA1(hash_string).toString();
     let upload_url = 'https://api.cloudinary.com/v1_1/' + cloud + '/image/upload'

     let xhr = new XMLHttpRequest();
     xhr.open('POST', upload_url);
     xhr.onload = () => {
     };
     xhr.onreadystatechange = (e) => {
       if (xhr.readyState !== 4) {
         return;
       }

       if (xhr.status === 200) {
         console.log('success', xhr.responseText);
       } else {
         console.warn('error',xhr.responseText,"--");
       }
     };
     let formdata = new FormData();
     formdata.append('file', {uri: uri, type: 'image/png', name: 'upload.png'});
     formdata.append('timestamp', timestamp);
     formdata.append('api_key', api_key);
     formdata.append('signature', signature);
     formdata.append('tags', tags);
     xhr.send(formdata);
   }

   uploadImage(uri,tags,location) {

     let upload_url = 'http://127.0.0.1:3000/upload'


     let xhr = new XMLHttpRequest();
     xhr.open('POST', upload_url);
     xhr.onload = () => {
     };
     xhr.onreadystatechange = (e) => {
       if (xhr.readyState !== 4) {
         return;
       }
       if (xhr.status === 200) {
         console.log('success', xhr.responseText);
       } else {
         console.warn('error',xhr.responseText,"--");
       }
     };
     let formdata = new FormData();
     formdata.append('file', {uri: uri, type: 'image/png', name: 'upload.png'});
     formdata.append('tags', tags);
     formdata.append('location', location);

     xhr.send(formdata);
   }


   handlePicture(caption,location) {
      return this.refs.camera.capture().then((data)=>{
         this.setState({currentScreen:AFTER,photo:data})
         console.log(data);
         this.uploadImage(data.path,caption,location)
         // Send caption - with picture to server
         // Remove from your camera roll?
            // Send the picture to the server for processing
      }).catch((err)=>{
         console.log(err);
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
