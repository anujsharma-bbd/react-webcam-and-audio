import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ContexMenu from './context-menu';
class App extends Component {
  imageRefs = [];
  constructor() {
    super();
    this.state = { start: false, isError: false, left: 0, top: 0, selectedImg: null, takePhotoCount: 0, images: [], contextMenuOpen: false };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.TakePhoto = this.TakePhoto.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onContextItemSelect = this.onContextItemSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.player = React.createRef();
    this.canvas = React.createRef();
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
  componentDidMount() {
    document.addEventListener('click', ((e) => {
      this.setState({ contextMenuOpen: false });
    }).bind(this))
  }
  onRemove() {
    this.setState({ images: this.state.images.filter(x => x.number !== this.state.selectedImg.number), contextMenuOpen: false });
  }
  TakePhoto() {
    const context = this.canvas.getContext('2d');
    context.drawImage(this.player, 0, 0, this.canvas.width, this.canvas.height);
    this.setState({ takePhotoCount: (this.state.takePhotoCount + 1) }, () => {
      let count = this.state.takePhotoCount;
      this.setState({
        images: [...this.state.images, {
          number: count,
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
  onContextMenu(e, img) {
    e.persist(); // to persist synthetic event data after render, means disabling event-Pooling
    e.preventDefault();
    e.stopPropagation(); // so that documet client does not closes contextMenu
    this.setState({ contextMenuOpen: true, left: e.pageX, top: e.pageY, selectedImg: img });
  }
  onContextItemSelect(operation) {
    switch (operation.value) {
      case 'del':
        {
          this.onRemove();
          break;
        }
    }
  }
  render() {
    const { isError, errorMessage, start, images, left, top, contextMenuOpen } = this.state;
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
              images.length ? <strong>Right Click to delete Photos</strong> : ''
            }
            {
              images.map((img, index) =>
                <div key={'image-' + index} >
                  <img src={img.url} width='320' onContextMenu={x => this.onContextMenu(x, img)} className='m-2' style={{ float: 'left' }} height='240' alt='' />
                </div>
              )
            }
          </div>
        </div>
        <p>
          <canvas style={{ display: 'none' }} ref={x => this.canvas = x} id='canvas' width='320' height='240'></canvas>
        </p>
        <ContexMenu onSelect={this.onContextItemSelect} isOpen={contextMenuOpen}
          left={left} top={top} items={[{ text: 'Delete', value: 'del' }, { text: 'Copy', value: 'cop' }]} />

      </div >
    );
  }
}

render(<App />, document.getElementById('root'));
