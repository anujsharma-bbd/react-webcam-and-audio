import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  imageRefs = [];
  constructor() {
    super();
    this.state = { start: false, isError: false, isLoading: false, takePhotoCount: 0, images: [] };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.TakePhoto = this.TakePhoto.bind(this);
    this.remove = this.remove.bind(this);
    this.player = React.createRef();
    this.canvas = React.createRef();
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
  remove(ref) {

  }
  TakePhoto() {
    const context = this.canvas.getContext('2d');
    context.drawImage(this.player, 0, 0, this.canvas.width, this.canvas.height);
    this.setState({ takePhotoCount: (this.state.takePhotoCount + 1) }, () => {
      let count = this.state.takePhotoCount;
      this.setState({
        images: [...this.state.images, {
          count,
          url: this.canvas.toDataURL('image/png')
        }]
      });
    });
    // this.stop();
  }
  pause() {
    if (!this.player.paused)
      this.player.pause();
    else
      this.player.play();
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
    const { isError, errorMessage, start, images } = this.state;
    return (
      <div className='container-fluid'>
        <br />
        <p >
          <button onClick={this.start} className='btn btn-success m-2' disabled={start}>Start Video</button>
          <button onClick={this.stop} disabled={!start} className='btn btn-danger m-2'>Stop Video</button>
          <button onClick={this.pause} disabled={!start} className='btn btn-danger m-2'>Pause Video</button>
          <button onClick={this.TakePhoto} disabled={!start} className='btn btn-danger m-2'>Take Photo</button>
        </p>
        <div className='row'>
          <div className='col-sm-6'>
            <p className='player-container'>
              <video id='player' autoPlay={true} ref={x => this.player = x}
                poster="https://cdn2.iconfinder.com/data/icons/pixel-perfect-at-24px-volume-8-1/24/mic-video-512.png"
              ></video>
            </p>
          </div>
          <div className='col-sm-6 all-images'>
            {
              images.map((img, index) =>
                <img key={'image-' + index} src={img.url} width='320' className='m-2' style={{ float: 'left' }} height='240' alt='' />
              )
            }
          </div>
        </div>
        <p>
          <canvas style={{ display: 'none' }} ref={x => this.canvas = x} id='canvas' width='320' height='240'></canvas>
        </p>
      </div >
    );
  }
}

render(<App />, document.getElementById('root'));
