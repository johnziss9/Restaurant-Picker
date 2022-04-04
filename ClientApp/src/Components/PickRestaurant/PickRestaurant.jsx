import React from 'react';
import './PickRestaurant.css'
import { Link } from 'react-router-dom';
import { NavLink, UncontrolledAlert } from 'reactstrap';
import HomeButton from '../../Images/home.png';
import ChosenRestaurantCard from '../ChosenRestaurantCard/ChosenRestaurantCard';

class PickRestaurant extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            visitationDate: new Date(),
            chosenRestaurant: {},
            visitedRestaurant: {},
            showChosenRestaurant: false,
            showForm: true,
            showErrorAlert: false,
            showDateAlert: false,
        }

        this.handleRandom = this.handleRandom.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    componentDidMount() {
        Promise.all([
            fetch('https://restaurant-picker5.herokuapp.com/restaurant/GetNotVisited', {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(res => res.json()),
            fetch('https://restaurant-picker5.herokuapp.com/restaurant/GetRestaurantByDate',  {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(res => res.json())
        ]).then(([restaurantData, visitedRestaurantItem]) => {
            this.setState({
                isLoaded: true,
                restaurants: restaurantData,
                visitedRestaurant: visitedRestaurantItem
            });
        })
    }

    handleErrorAlert = () => {
        this.setState({ showErrorAlert: true })
    }

    handleDateAlert = () => {
        this.setState({ showDateAlert: true })
    }

    handleRandom() {
        const today = new Date();
        const selectedDate = new Date(this.state.visitationDate);

        if (this.state.restaurants.data.length <= 0) {
            this.handleErrorAlert();
        } else if (selectedDate <= today) {
            this.handleDateAlert();
        } else {
            const randomRestaurant = Math.floor(Math.random() * this.state.restaurants.data.length);

            this.setState({ 
                chosenRestaurant: {
                    name: this.state.restaurants.data[randomRestaurant].name ,
                    cuisine: this.state.restaurants.data[randomRestaurant].cuisine,
                    location: this.state.restaurants.data[randomRestaurant].location,
                    addedOn: this.state.restaurants.data[randomRestaurant].addedOn,
                    addedBy: this.state.restaurants.data[randomRestaurant].addedBy.username,
                    visitedOn: this.state.visitationDate
                },
                showChosenRestaurant: true,
                showForm: false
            });

            fetch("https://restaurant-picker5.herokuapp.com/restaurant/" + this.state.restaurants.data[randomRestaurant].id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    id: this.state.restaurants.data[randomRestaurant].id,
                    name: this.state.restaurants.data[randomRestaurant].name,
                    cuisine: this.state.restaurants.data[randomRestaurant].cuisine,
                    location: this.state.restaurants.data[randomRestaurant].location,
                    visited: true,
                    visitedOn: new Date(this.state.visitationDate),
                    addedBy: this.state.restaurants.data[randomRestaurant].addedBy,
                    addedOn: this.state.restaurants.data[randomRestaurant].addedOn,
                })
            })
            .then (response => response.json())
        }
    }

    handleDate(event) {
        this.setState({
            visitationDate: event.target.value
        });
    }

    render() {
        return (
            <div className='pick-restaurant-wrapper'>
                <div className='container'>
                    <h1 className='pick-restaurant-title'>Pick Restaurant
                        <span className='homepage-button'>
                            <NavLink tag={Link} to="/Menu">
                                <img src={HomeButton} alt='home-button' className='homepage-button-image' />
                            </NavLink>
                        </span>
                    </h1>
                </div>
                <div className='pick-restaurant-bottom'>
                    <div className="container pick-restaurant-bottom-container" style={{ justifyContent: this.state.visitedRestaurant.data != null || this.state.showChosenRestaurant ? 'center': 'left'}}>
                        {this.state.showErrorAlert 
                            ? <UncontrolledAlert color="danger">
                                <h4>Uh-oh!</h4>
                                <hr />
                                <p>No more restaurants. Please add some restaurants before picking one.</p>
                                <NavLink tag={Link} className="add-restaurant-alert-link" to="/AddRestaurant">Add Restaurant</NavLink>
                            </UncontrolledAlert>
                            : null }
                        {this.state.showDateAlert 
                            ? <UncontrolledAlert color="danger">
                                <h4>Uh-oh!</h4>
                                <hr />
                                <p>Make sure the selected date is in the future.</p>
                            </UncontrolledAlert>
                            : null }
                        {/* Showing the restaurant from the state when the button is clicked. */}
                        {this.state.showChosenRestaurant ?
                            <div>
                                <h2 className='chosen-restaurant-title'>The next scheduled visit:</h2>
                                <ChosenRestaurantCard 
                                    name={this.state.chosenRestaurant.name}
                                    location={this.state.chosenRestaurant.location}
                                    cuisine={this.state.chosenRestaurant.cuisine}
                                    visitedOn={this.state.visitationDate}
                                    addedBy={this.state.chosenRestaurant.addedBy.username}
                                    addedOn={this.state.chosenRestaurant.addedOn}
                                />
                            </div> :
                            null
                        }
                        {/* Showing the restaurant when the page loads from the fetched object. */}
                        {this.state.visitedRestaurant.data != null ?
                            <div>
                                <h2 className='chosen-restaurant-title'>The next scheduled visit:</h2>
                                <ChosenRestaurantCard
                                    name={this.state.visitedRestaurant.data.name}
                                    location={this.state.visitedRestaurant.data.location}
                                    cuisine={this.state.visitedRestaurant.data.cuisine}
                                    visitedOn={this.state.visitedRestaurant.data.visitedOn}
                                    addedBy={this.state.visitedRestaurant.data.addedBy.username}
                                    addedOn={this.state.visitedRestaurant.data.addedOn}
                                />
                            </div> :
                            <div className={!this.state.showForm ? "d-none" : "pick-restaurant-form"}>
                                <div className="form-group row">
                                    <label>Select date of visit:</label>
                                    <input className="form-control" type="date" onSelect={this.handleDate} />
                                </div>
                                <div className="form-group row">
                                    <button type="button" className="btn btn-dark pick-restaurant-form-button" onClick={this.handleRandom}>Pick a Random Restaurant</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default PickRestaurant;