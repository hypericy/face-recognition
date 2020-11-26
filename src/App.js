import './App.css';
import React from 'react'
// import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
// import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import Clarifai  from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
const app = new Clarifai.App({
 apiKey: '1cd03f1ac99042079dd800ec49868432'
});

const particlesOptions ={
  "particles": {
      "number": {
          "value": 75
      },
      "size": {
          "value": 3
      }
  },
  "interactivity": {
    "detectsOn": "window",
      "events": {
          "onhover": {
              "enable": true,
              "mode": "repulse"
          }
      }
  }
}
class App extends React.Component{
  constructor(){
    super();
    this.state ={
      input : '',
      url : '',
      box :[],

    }
  }
  calculateFaceLocation = (response) =>{
    const faces= response?.outputs?.[0]?.data?.regions;
    const image = document.getElementById('inputImage');   
    const width =  Number(image.width);
    const height = Number(image.height);
    

    if(faces !== undefined){
      this.setState({
        box : faces.map(region_raw =>{ 
          const region = region_raw.region_info.bounding_box;
          return {
          leftCol : region.left_col * width,
          topRow : region.top_row * height,
          rightCol : width - region.right_col * width,
          bottomRow : height - region.bottom_row * height,
        };
      })
        })
    }
    
  }
  

  inputChange = (event) =>{
    // console.log(event.target.value);
    this.setState(
      {input : event.target.value}
    );
  }

  buttonSubmit = () =>{
    this.setState({
        url : this.state.input,
        box : [] 
      })
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
    response=> this.calculateFaceLocation(response))
    .catch(err => console.log(err));
  
  }

  render(){
    return (
      <div className="App ma3">
        <Particles className='particles' params={particlesOptions}/>
        {/* <Navigation /> */}
        <Logo />
        {/* <Rank/> */}
        <ImageLinkForm 
          inputChange={this.inputChange} 
          buttonSubmit={this.buttonSubmit}
        />
        <FaceRecognition url={this.state.url} boxes={this.state.box}/>
      </div>
    );
  }
}

export default App;
