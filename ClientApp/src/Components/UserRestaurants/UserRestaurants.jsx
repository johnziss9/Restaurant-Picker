import moment from 'moment';
import React from 'react';
import './UserRestaurants.css'
import Header from '../Header/Header';
import Loading from '../../Images/loading.gif';

class UserRestaurants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            restaurants: []
        }
   }

    componentDidMount() {
        fetch('https://restaurant-picker5.herokuapp.com/restaurant/GetUserRestaurants', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then (response => response.json())
        .then (data => {
            this.setState({
                isLoaded: true,
                restaurants: data
            });

            console.log(this.state.restaurants);
        });
    }

    render() {
        if (!this.state.isLoaded) {
            return (<div className="user-restaurants-container-loading flex-column">
                        <img src={Loading} alt="loading" className="user-restaurants-loading-gif" />
                        <p className="user-restaurants-loading-text">Loading Restaurants...</p>
                    </div>)
        } else {
        return (
            <div className="user-restaurants-container">
                <div className="user-restaurants-header-buttons container">
                    <Header title="My Restaurants" />
                </div>
                <div className="yser-restaurants-content-container container">
                    <div className="user-restaurants-content">
                        {Array.isArray(this.state.restaurants.data) && this.state.restaurants.data.map( res => (
                            <div className="user-restaurant-container" key={res.id}>
                                <h4 className="user-restaurant-name">{res.name}</h4>
                                <p className="user-restaurant-location">{res.location}</p>
                                <p className="user-restaurant-cuisine">{res.cuisine}</p>
                                <small className="user-restaurant-user-details">Added on {moment(res.addedOn).format('MMMM Do YYYY')}</small>
                                {res.visited ?
                                    <p className="user-restaurant-visited">Visited</p> :
                                    <p className="user-restaurant-visited">Not Visited</p>
                                }
                            </div>
                        ))}
                    </div> 
                </div>
            </div>
        )};
    }
}

export default UserRestaurants;