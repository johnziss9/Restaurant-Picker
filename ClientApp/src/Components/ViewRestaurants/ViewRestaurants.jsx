import React from 'react';
import './ViewRestaurants.css'
import Loading from '../../Images/loading.gif';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import HomeButton from '../../Images/home.png';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import _ from 'lodash';

class ViewRestaurants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        isLoaded: false,
        restaurants: [],
        notVisitedRestaurants: [],
        visitedRestaurants: [],
        showVisited: false,
        input: ""
       }
   }
    componentDidMount() {
        fetch('https://restaurant-picker5.herokuapp.com/restaurant/GetAll', {
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
                <div className='view-restaurants-wrapper'>
                    <div className='container'>
                        <h1 className='view-restaurants-title'>View Restaurants
                            <span className='homepage-button'>
                                <NavLink tag={Link} to="/Menu">
                                    <img src={HomeButton} alt='home-button' className='homepage-button-image' />
                                </NavLink>
                            </span>
                        </h1>
                    </div>
                    <div className='view-restaurants-bottom'>
                        <div className='container view-restaurants-container'>
                            <div className="view-restaurants-container-loading">
                                <img src={Loading} alt="loading" className="view-restaurants-loading-gif" />
                                <p className="view-restaurants-loading-text">Loading Restaurants...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
        return (
            <div className='view-restaurants-wrapper'>
                <div className='container'>
                    <h1 className='view-restaurants-title'>View Restaurants
                        <span className='homepage-button'>
                            <NavLink tag={Link} to="/Menu">
                                <img src={HomeButton} alt='home-button' className='homepage-button-image' />
                            </NavLink>
                        </span>
                    </h1>
                </div>
                <div className='view-restaurants-bottom'>
                    <div className='container view-restaurants-container'>
                        {this.state.restaurants.data.length == 0 ?
                            <>
                                <div className='view-restaurants-none'>No restaurants found. <br /> Click the link below to add some.</div>
                                <NavLink tag={Link} className="view-restaurants-none-link" to="/AddRestaurant">Add Restaurants</NavLink>
                            </> :
                            <>
                                <div className="form-group view-restaurants-search-container">
                                    <span className="fa fa-search"></span>
                                    <input type="text" className="form-control view-restaurants-search" placeholder="Search name..." onChange={event => this.setState({ input: event.target.value})} />
                                </div>
                                <div className='view-restaurants-key'>
                                    <div className='view-restaurants-visited'>
                                        <div className='view-restaurants-visited-key'></div>
                                        <div>Visited ({this.state.restaurants.data.filter(res => res.visited).length})</div>
                                    </div>
                                    <div className='view-restaurants-not-visited'>
                                        <div className='view-restaurants-not-visited-key'></div>
                                        <div>Not Visited ({this.state.restaurants.data.filter(res => !res.visited).length})</div>
                                    </div>
                                </div>
                                <div className='view-restaurants-card-container'>
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
                            </>
                        }
                    </div>
                </div>
            </div>
        )};
    }
}

export default ViewRestaurants;