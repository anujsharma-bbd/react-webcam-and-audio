import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor() {
    super();
    this.state = { start: false, isError: false, isLoading: false };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.player = React.createRef;
  }
  start() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.player.srcObject = stream;
          this.player.play();
          this.setState({
            isError: false,
            errorMessage: null,
            start: true
          });
        }).catch(err => {
          this.setState({ isError: true, errorMessage: err });
        })
    }
  }
  pause() {
    this.player.pause();
  }
  stop() {
    let stream = this.player.srcObject;
    var tracks = stream.getTracks();
    tracks.forEach(x => {
      x.stop();
    })
    this.player.srcObject = null;
    this.setState({
      isError: false,
      errorMessage: null,
      start: false
    });
  }
  render() {
    const { isError, errorMessage, start } = this.state;
    return (
      <div>
        <br />
        <p >
          <button onClick={this.start} className='btn btn-success m-2' disabled={start}>Start Video</button>
          <button onClick={this.stop} disabled={!start} className='btn btn-danger m-2'>Stop Video</button>
          <button onClick={this.secondary} disabled={!start} className='btn btn-danger m-2'>Pause Video</button>
        </p>
        {

        }
        <p >

        </p>
        <p className='player-container'>
          <video id='player' autoPlay={true} ref={x => this.player = x}
            poster="https://cdn2.iconfinder.com/data/icons/pixel-perfect-at-24px-volume-8-1/24/mic-video-512.png"
          ></video>
        </p>
      </div >
    );
  }
}

render(<App />, document.getElementById('root'));
