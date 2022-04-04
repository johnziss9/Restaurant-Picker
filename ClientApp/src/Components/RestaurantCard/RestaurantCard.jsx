import React from 'react';
import './RestaurantCard.css';
import moment from 'moment';

class RestaurantCard extends React.Component {
    render() {
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
            </div>
        );
    }
}

export default RestaurantCard;