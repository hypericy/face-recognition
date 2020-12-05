import './App.css';
import React from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Resgister from './components/Register/Register'

const app = new Clarifai.App({
  apiKey: '1cd03f1ac99042079dd800ec49868432'
});

const particlesOptions = {
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
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      url: '',
      box: [],
      route: 'signout'
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(console.log);
  }

  calculateFaceLocation = (response) => {
    const faces = response?.outputs?.[0]?.data?.regions;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);


    if (faces !== undefined) {
      this.setState({
        box: faces.map(region_raw => {
          const region = region_raw.region_info.bounding_box;
          return {
            leftCol: region.left_col * width,
            topRow: region.top_row * height,
            rightCol: width - region.right_col * width,
            bottomRow: height - region.bottom_row * height,
          };
        })
      })
    }

  }


  inputChange = (event) => {
    // console.log(event.target.value);
    this.setState(
      { input: event.target.value }
    );
  }

  buttonSubmit = () => {
    this.setState({
      url: this.state.input,
      box: []
    });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(data => {
              this.setState(Object.assign(this.state.user,{ entries: data}))
            })

        }
        this.calculateFaceLocation(response)

      })
      .catch(err => console.log(err));

  }
  onRouteChange = (route) => {
    this.setState({
      url : '',
      box: [],
      route: route
    })
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
      }
    })
  }
  render() {
    const { route } = this.state;
    let show;
    switch (route) {
      case 'signout':
        show = (<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
        break;
      case 'signin':
        show = [
          <Logo key={1} />,
          <Rank key={2} name={this.state.user.name} entries={this.state.user.entries} />,
          <ImageLinkForm
            key={3}
            inputChange={this.inputChange}
            buttonSubmit={this.buttonSubmit}
          />,
          <FaceRecognition key={4} url={this.state.url} boxes={this.state.box} />,
        ];
        break;
      case 'register':
        show = <Resgister onRouteChange={this.onRouteChange} />
        break;
      default:
        break;
    }
    return (
      <div className="App ma3">
        <Particles className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} route={route} />
        {show}
      </div>
    )
  }
}

export default App;
