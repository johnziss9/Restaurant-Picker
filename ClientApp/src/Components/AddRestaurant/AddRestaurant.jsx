import React, { Fragment } from 'react';
import './AddRestaurant.css'
import { Link } from 'react-router-dom';
import { NavLink, UncontrolledAlert } from 'reactstrap';
import _ from 'lodash';
import HomeButton from '../../Images/home.png';

class AddRestaurant extends React.Component {

   constructor(props) {
       super(props);
       this.state = {
            cuisines: [],
            restaurants: [],
            name: '',
            location: '',
            cuisine: '',
            addedBy: null,
            showThankYouAlert: false,
            showRestaurantExistsAlert: false,
            showNoNameAlert: false,
            showNoLocationAlert: false,
            showNoCuisineAlert: false,

            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: "",
       }

        this.handleLocation = this.handleLocation.bind(this);
        this.handleCuisine = this.handleCuisine.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
   }

   componentDidMount() {
        Promise.all([
            fetch('https://restaurant-picker5.herokuapp.com/restaurant/GetCuisines', {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(res => res.json()),
            fetch('https://restaurant-picker5.herokuapp.com/restaurant/GetAll',  {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(res => res.json())
        ]).then(([cuisineData, restaurantData]) => {
            this.setState({
                isLoaded: true,
                cuisines: cuisineData,
                restaurants: restaurantData
            });
        })
    }

   // Autocomplete functions

   onChange = e => {
        const suggestions = this.state.restaurants.data.map(res => res.name);
        const userInput = e.currentTarget.value;

        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value,
            name: e.currentTarget.value
        });
    };

    onClick = e => {
        this.setState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: e.currentTarget.innerText,
        name: e.currentTarget.innerText
        });
    };

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion],
            });
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
        }
        this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };

    handleLocation(event) {
        this.setState({ location: event.target.value })
    }

    handleCuisine(event) {
        this.setState({ cuisine: event.target.value })
    }

    onDismiss() {
        this.setState({
            showThankYouAlert: false,
            showRestaurantExistsAlert: false,
            showNoNameAlert: false,
            showNoLocationAlert: false,
            showNoCuisineAlert: false
        });
    }

    handleSubmit() {
        if (this.state.name == '')
            this.setState({ showNoNameAlert: true });
        else if (this.state.location == '')
            this.setState({ showNoLocationAlert: true });
        else if (this.state.cuisine == 'Select Cuisine' || this.state.cuisine == '')
            this.setState({ showNoCuisineAlert: true });
        else {
            fetch('https://restaurant-picker5.herokuapp.com/restaurant', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    name: this.state.name,
                    location: this.state.location,
                    cuisine: this.state.cuisine
                })
            })
            .then (response => response.json())
            .then (data => {
                if (data.success) {
                    this.setState({
                        showThankYouAlert: true
                    });
                } else {
                    this.setState({
                        showRestaurantExistsAlert: true
                    });
                }
            });
        }
    }

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;
    
        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul class="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;
      
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }
                            
                            return (
                                <li className={className} key={suggestion} onClick={onClick}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div class="no-suggestions">
                        <em>No suggestions available.</em>
                    </div>
                );
            }
        }

        return (
            <div className='add-restaurant-wrapper'>
                <div className='container'>
                    <h1 className='add-restaurant-title'>Add Restaurant
                        <span className='homepage-button'>
                            <NavLink tag={Link} to="/Menu">
                                <img src={HomeButton} alt='home-button' className='homepage-button-image' />
                            </NavLink>
                        </span>
                    </h1>
                </div>
                <div className='add-restaurant-bottom'>
                    <div className='container add-restaurant-form'>
                        {this.state.showThankYouAlert ?
                            <UncontrolledAlert color="success" toggle={this.onDismiss}>
                                <h4>Thank you!</h4>
                                <hr />
                                <p>The restaurant has been added and will be included in the next random selection.</p>
                            </UncontrolledAlert> 
                            : null}
                        {this.state.showRestaurantExistsAlert ?
                            <UncontrolledAlert color="danger" toggle={this.onDismiss}>
                                <h4>Uh-oh!</h4>
                                <hr />
                                <p>It looks like the restaurant you are trying to add already exists. Check the View Restaurants page to confirm.</p>
                                <NavLink tag={Link} className="view-restaurants-alert-link" to="/ViewRestaurants">View Restaurants</NavLink>
                            </UncontrolledAlert> 
                            : null}
                        {this.state.showNoNameAlert 
                            ? <UncontrolledAlert color="danger" toggle={this.onDismiss}>
                                <h4>Uh-oh!</h4>
                                <hr />
                                <p>Make sure the name field is completed.</p>
                            </UncontrolledAlert>
                            : null }
                        {this.state.showNoLocationAlert 
                            ? <UncontrolledAlert color="danger" toggle={this.onDismiss}>
                                <h4>Uh-oh!</h4>
                                <hr />
                                <p>Make sure the location field is completed.</p>
                            </UncontrolledAlert>
                            : null }
                        {this.state.showNoCuisineAlert 
                            ? <UncontrolledAlert color="danger" toggle={this.onDismiss}>
                                <h4>Uh-oh!</h4>
                                <hr />
                                <p>Make sure the cuisine field is selected.</p>
                            </UncontrolledAlert>
                            : null }
                        <form>
                            <div className="form-group">
                                <label htmlFor="restaurant-name">Restaurant Name:</label>
                                <Fragment>
                                    <input
                                        type="text"
                                        onChange={onChange}
                                        onKeyDown={onKeyDown}
                                        value={userInput}
                                        className="form-control test-input"
                                        id="restaurant-name" 
                                        placeholder="Enter Restaurant Name"
                                    />
                                    {suggestionsListComponent}
                                </Fragment>
                            </div>
                            <div className="form-group">
                                <label htmlFor="restaurant-location">Location:</label>
                                <input type="text" className="form-control" id="restaurant-location" placeholder="Enter Restaurant Location" onChange={this.handleLocation} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="restaurant-cuisine">Cuisine:</label>
                                <select className="form-control" onChange={this.handleCuisine}>
                                    <option>Select Cuisine</option>
                                    {Array.isArray(this.state.cuisines.data) && _.orderBy(this.state.cuisines.data).map( c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="reset" className="btn btn-success add-restaurant-submit" onClick={this.handleSubmit}>Submit</button>
                        </form>
                    </div>           
                </div>
            </div>
        );
    }
}

export default AddRestaurant;