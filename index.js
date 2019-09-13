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
    this.TakePhoto = this.TakePhoto.bind(this);
    this.player = React.createRef();
    this.canvas = React.createRef();
    this.image = React.createRef();
  }
  start() {
    console.log(this.refs)
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
  TakePhoto() {

    // first way
    const context = this.canvas.getContext('2d');
    context.drawImage(this.player, 0, 0, this.canvas.width, this.canvas.height); // generic way but if we want to see base64 , we must show in <img tag
    // first way END

    // second way Start
    this.image.src = this.canvas.toDataURL('image/png');
    // second way END
    this.stop();
  }
  pause() {
    this.player.pause();
  }
  stop() {
    this.player.srcObject.getVideoTracks()
      .forEach(x => {
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
          <button onClick={this.pause} disabled={!start} className='btn btn-danger m-2'>Pause Video</button>
          <button onClick={this.TakePhoto} disabled={!start} className='btn btn-danger m-2'>Take Photo</button>
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
        <p>
          <canvas style={{ display: 'none' }} ref={x => this.canvas = x} id='canvas' width='320' height='240'></canvas>
          <img ref={x => this.image = x} id='image' width='320' height='240' alt='' />
        </p>
      </div >
    );
  }
}

render(<App />, document.getElementById('root'));
