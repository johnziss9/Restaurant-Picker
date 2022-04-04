import React from 'react';
import './UserRestaurants.css'
import Loading from '../../Images/loading.gif';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import HomeButton from '../../Images/home.png';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import _ from 'lodash';

class UserRestaurants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            restaurants: [],
            input: ""
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
        });
    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <div className='user-restaurants-wrapper'>
                    <div className='container'>
                        <h1 className='user-restaurants-title'>My Restaurants
                            <span className='homepage-button'>
                                <NavLink tag={Link} to="/Menu">
                                    <img src={HomeButton} alt='home-button' className='homepage-button-image' />
                                </NavLink>
                            </span>
                        </h1>
                    </div>
                    <div className='user-restaurants-bottom'>
                        <div className='container user-restaurants-container'>
                            <div className="user-restaurants-container-loading">
                                <img src={Loading} alt="loading" className="user-restaurants-loading-gif" />
                                <p className="user-restaurants-loading-text">Loading Restaurants...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
        return (
            <div className='user-restaurants-wrapper'>
                <div className='container'>
                    <h1 className='user-restaurants-title'>My Restaurants
                        <span className='homepage-button'>
                            <NavLink tag={Link} to="/Menu">
                                <img src={HomeButton} alt='home-button' className='homepage-button-image' />
                            </NavLink>
                        </span>
                    </h1>
                </div>
                <div className='user-restaurants-bottom'>
                    <div className='container user-restaurants-container'>
                        <div className="form-group user-restaurants-search-container">
                            <span className="fa fa-search"></span>
                            <input type="text" className="form-control user-restaurants-search" placeholder="Search name..." onChange={event => this.setState({ input: event.target.value})} />
                        </div>
                        <div className='user-restaurants-key'>
                            <div className='user-restaurants-visited'>
                                <div className='user-restaurants-visited-key'></div>
                                <div>Visited</div>
                            </div>
                            <div className='user-restaurants-not-visited'>
                                <div className='user-restaurants-not-visited-key'></div>
                                <div>Not Visited</div>
                            </div>
                        </div>
                        <div className='user-restaurants-card-container'>
                            {Array.isArray(this.state.restaurants.data) && 
                                _.orderBy(this.state.restaurants.data, ['name'], ['asc'])
                                .filter((el) => { 
                                    if (this.state.input === '') {
                                        return el;
                                    }
                                    else {
                                        return el.name.toLowerCase().includes(this.state.input.toLowerCase())
                                    }
                                })
                                .map( res => (
                                <RestaurantCard 
                                    key={res.id}
                                    name={res.name}
                                    location={res.location}
                                    cuisine={res.cuisine}
                                    visited={res.visited}
                                    addedBy={res.addedBy.username}
                                    addedOn={res.addedOn}
                                    visitedOn={res.visited == true ? res.visitedOn : 'N/A'}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )};
    }
}

export default UserRestaurants;