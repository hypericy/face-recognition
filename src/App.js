import './App.css';
import React from 'react'
// import Navigation from './components/Navigation'
import Logo from './components/Logo'
import ImageLinkForm from './components/ImageLinkForm'
// import Rank from './components/Rank'
import Particles from 'react-particles-js';
import Clarifai  from 'clarifai';
import FaceRecognition from './components/FaceRecognition'
const app = new Clarifai.App({
 apiKey: '1cd03f1ac99042079dd800ec49868432'
});

const particlesOptions ={
  "particles": {
      "number": {
          "value": 100
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
      box :{},
    }
  }
  calculateFaceLocation = (response) =>{
    const  face= response?.outputs?.[0]?.data?.regions?.[0]?.region_info?.bounding_box;
    const image = document.getElementById('inputImage');   
    const width =  Number(image.width);
    const height = Number(image.height);
    if(face !== undefined){
      this.setState({
        box : {
          leftCol : face.left_col * width,
          topRow : face.top_row * height,
          rightCol : width - face.right_col * width,
          bottomRow : height - face.bottom_row * height,
        }
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
        box : {} 
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
        <FaceRecognition url={this.state.url} box={this.state.box}/>
      </div>
    );
  }
}

export default App;
