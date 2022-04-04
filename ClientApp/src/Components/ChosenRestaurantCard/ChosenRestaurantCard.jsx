import React from 'react';
import './ChosenRestaurantCard.css';
import moment from 'moment';

class ChosenRestaurantCard extends React.Component {
    render() {
        return (
            <div className="chosen-restaurant-card-wrapper">
                <div className='chosen-restaurant-card-title-container'>
                    {this.props.name} <br /> {moment(this.props.visitedOn).format('Do MMMM YYYY')}
                </div>
                <div className='chosen-restaurant-card-triangle'></div>
                <div className='chosen-restaurant-card-details'>
                    <div>Location: <b>{this.props.location}</b></div>
                    <div>Cuisine: <b>{this.props.cuisine}</b></div>
                    <div>Added By: <b>{this.props.addedBy} on {moment(this.props.addedOn).format('DD/MM/YYYY')}</b></div>
                </div>
            </div>
        );
    }
}

export default ChosenRestaurantCard;