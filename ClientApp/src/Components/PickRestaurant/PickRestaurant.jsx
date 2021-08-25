import React from 'react';
import './PickRestaurant.css'
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { NavLink, UncontrolledAlert } from 'reactstrap';
import moment from 'moment';

class PickRestaurant extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            visitedRestaurant: {},
            visitationDate: new Date(),
            chosenRestaurant: {
                name: '',
                location: '',
                cuisine: '',
                addedOn: new Date().toLocaleString()
            },
            showChosenRestaurant: false,
            showErrorAlert: false,
            showDateAlert: false,
            showForm: true
        }

        this.handleRandom = this.handleRandom.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    componentDidMount() {
        Promise.all([
            fetch('http://localhost:5000/restaurant/GetNotVisited', {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(res => res.json()),
            fetch('http://localhost:5000/restaurant/GetVisitedSingle',  {
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
                showChosenRestaurant: true, 
                chosenRestaurant: {
                    name: this.state.restaurants.data[randomRestaurant].name ,
                    location: this.state.restaurants.data[randomRestaurant].location,
                    cuisine: this.state.restaurants.data[randomRestaurant].cuisine,
                    addedOn: this.state.restaurants.data[randomRestaurant].addedOn,
                },
                showForm: false
            });

            fetch("http://localhost:5000/restaurant", {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    id: this.state.restaurants.data[randomRestaurant].id,
                    name: this.state.restaurants.data[randomRestaurant].name,
                    location: this.state.restaurants.data[randomRestaurant].location,
                    cuisine: this.state.restaurants.data[randomRestaurant].cuisine,
                    visited: true,
                    dateVisited: new Date(this.state.visitationDate)
                })
            })
            .then (response => response.json())
        }
    }

    handleDone = () => {
        this.setState({
            showChosenRestaurant: false        
        });

        this.componentDidMount();
    }

    handleDate(event) {
        this.setState({
            visitationDate: event.target.value
        });
    }

    render() {
        return (
            <div className="pick-restaurant-container">
                <div className="container flex-column">
                    <Header title="Pick Restaurant" />
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
                    {this.state.showChosenRestaurant
                        ?   <div className="chosen-restaurant-container">
                                <h2 className="chosen-restaurant-title">The randomly chosen restaurant is:</h2>
                                <h3 className="chosen-restaurant-name">{this.state.chosenRestaurant.name}</h3>
                                <div className="chosen-restaurant-info">
                                    <h4 className="chosen-restaurant-location"><u><b>Location:</b></u> {this.state.chosenRestaurant.location}</h4>
                                    <h4 className="chosen-restaurant-cuisine"><u><b>Cuisine:</b></u> {this.state.chosenRestaurant.cuisine}</h4>
                                </div>
                                <p className="chosen-restaurant-user-date">This restaurant was added on {moment(this.state.chosenRestaurant.addedOn).format('MMMM Do YYYY')}.</p>
                                <button type="button" className="btn btn-dark" onClick={this.handleDone}>Save & Exit</button>
                            </div>     
                        : null }
                    {this.state.visitedRestaurant.data != null ?
                    <div className="already-chosen-restaurant-container">
                        <div className="chosen-restaurant-container">
                            <h2 className="already-chosen-restaurant-title">The next visit is on {moment(this.state.visitedRestaurant.data.dateVisited).format('MMMM Do YYYY')}</h2>
                            <h3 className="chosen-restaurant-name">{this.state.visitedRestaurant.data.name}</h3>
                            <div className="chosen-restaurant-info">
                                <h4 className="chosen-restaurant-location"><u><b>Location:</b></u> {this.state.visitedRestaurant.data.location}</h4>
                                <h4 className="chosen-restaurant-cuisine"><u><b>Cuisine:</b></u> {this.state.visitedRestaurant.data.cuisine}</h4>
                            </div>
                            <p className="chosen-restaurant-user-date">This restaurant was added on {moment(this.state.visitedRestaurant.data.addedOn).format('MMMM Do YYYY')}.</p>
                        </div> 
                    </div>
                    :
                    <div className={!this.state.showForm ? "d-none" : "pick-restaurant-form"} >
                        <div className="form-group row">
                            <label className="pick-visit-date-label">Select date of visit:</label>
                            <input className="form-control pick-visit-date" type="date" id="example-date-input" onSelect={this.handleDate} />
                        </div>
                        <div className="form-group row">
                            <button type="button" className="btn btn-dark pick-restaurant-button" onClick={this.handleRandom}>Pick a Random Restaurant</button>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

export default PickRestaurant;