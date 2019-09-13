import React from 'react';
class ContexMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        {
          this.props.isOpen === true ?
            <div className='context-menu position-absolute' style={{ padding: '10px 0px', top: this.props.top, left: this.props.left }}>
              {
                this.props.items.map((item, index) =>
                  <div className='row m-0' key={'ctx-item-' + index} onClick={x => this.props.onSelect(item)}>
                    <div className=' item col-sm-12'>
                      {
                        item.text
                      }
                    </div>
                  </div>
                )
              }
            </div>
            : ''
        }
      </>
    );
  }
}


export default ContexMenu;