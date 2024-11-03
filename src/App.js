import React, { Component } from 'react';
import Navigation from './componenets/Navigation/Navigation';
import Particles from "react-tsparticles";
import Logo from './componenets/Logo/Logo';
import ImageLinkForm from './componenets/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './componenets/FaceRecognition/FaceRecognition';
import Signin from './componenets/Signin/Signin';
import Register from './componenets/Register/Register';
import Rank from './componenets/Rank/Rank';
import './App.css';



const intialState ={
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = intialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }


  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('https://smart-brain-api-teoc.onrender.com/imageurl', {
      method: 'post',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then(response => response.json())
      .then(response => {
        if(response){
          fetch('https://smart-brain-api-teoc.onrender.com/image', {
            method: 'put',
            headers: { 'content-Type': 'application/json' },
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(intialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    const particlesOptions = {
      particles: {
        number: {
          value: 30,
          density: {
            enable: true,
            value_area: 800
          }
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        fpsLimit: 60,
        interactivity: {
          detectsOn: "canvas",
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          }
        },
        collisions: {
          enable: true,
        },
        move: {
          direction: "none",
          enable: true,
          outMode: "bounce",
          random: false,
          speed: 6,
          straight: false,
        }
      }
    }
    return (

      <div className="App">
        <Particles id="tsparticles" className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )

        }
      </div>
    );
  }
}

export default App;
