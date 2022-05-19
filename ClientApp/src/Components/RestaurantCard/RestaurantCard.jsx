import React from 'react';
import './RestaurantCard.css';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import MapButton from'../../Images/map_icon.png'
import { Map, GoogleApiWrapper, Marker  } from 'google-maps-react';

class RestaurantCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
       }
   }

    handleClose = () => {
        this.setState({ show: false });
    }
    
    handleShow = () => {
        this.setState({ show: true });
    }

    render() {
        const containerStyle = {
            position: 'relative',  
            width: '100%',
            height: '100%'
          }

        return (
            <div className="restaurant-card-wrapper">
                <div className='restaurant-card-title-container' style={{ backgroundColor: this.props.visited == false ? '#e64d00' : 'gray'}} >
                    {this.props.name}
                </div>
                <div className='restaurant-card-triangle' style={{ borderTop: this.props.visited == false ? '10px solid #e64d00' : '10px solid gray'}}></div>
                <div className='restaurant-card-details'>
                    <div>Location: <b>{this.props.location}</b></div>
                    <div>Cuisine: <b>{this.props.cuisine}</b></div>
                    <div>Added By: <b>{this.props.addedBy} on {moment(this.props.addedOn).format('DD/MM/YYYY')}</b></div>
                    <div>Visited On: <b>{this.props.visitedOn != 'N/A' ? moment(this.props.visitedOn).format('DD/MM/YYYY') : 'N/A'}</b></div>
                </div>
                <div className='restaurant-card-icons'>
                    <img src={MapButton} alt='map-button' className='restaurant-card-map-icon' onClick={this.handleShow} />
                </div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Body>
                        <div className='restaurant-card-modal-body'>
                            <Map
                                google={this.props.google}
                                zoom={16}
                                initialCenter={{
                                    lat: this.props.latitude,
                                    lng: this.props.longitude
                                }}
                                disableDefaultUI={true}
                                containerStyle={containerStyle}
                            >
                                <Marker
                                    name={'Restaurant'}
                                    position={{lat: this.props.latitude, lng: this.props.longitude}} />
                            </Map>
                        </div>           
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className='restaurant-card-modal-close-button' onClick={this.handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
  })(RestaurantCard)