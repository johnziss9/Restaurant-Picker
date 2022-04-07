import React from 'react';
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
            name: '',
            location: '',
            cuisine: '',
            addedBy: null,
            showThankYouAlert: false,
            showRestaurantExistsAlert: false,
            showNoNameAlert: false,
            showNoLocationAlert: false,
            showNoCuisineAlert: false
       }

        this.handleName = this.handleName.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleCuisine = this.handleCuisine.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
   }

   componentDidMount() {
    fetch("https://restaurant-picker5.herokuapp.com/restaurant/GetCuisines", {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then (data => {
        this.setState({ 
            cuisines: data 
        });
    });
   }

    handleName(event) {
        this.setState({ name: event.target.value })
    }

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
                                <input type="text" id="restaurant-name" className="form-control" placeholder="Enter Restaurant Name" onChange={this.handleName} />
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