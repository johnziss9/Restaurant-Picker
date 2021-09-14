import React from 'react';
import './AddRestaurant.css'
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { NavLink, UncontrolledAlert } from 'reactstrap';
import _ from 'lodash';

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
            showRestaurantExistsAlert: false
       }

        this.handleName = this.handleName.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleCuisine = this.handleCuisine.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
   }

   componentDidMount() {
    fetch("http://localhost:5000/restaurant/GetCuisines", {
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

    handleSubmit() {
        if (this.state.name == '')
            alert('Enter restaurant name.');
        else if (this.state.location == '')
            alert('Enter restaurant location.');
        else if (this.state.cuisine == 'Select Cuisine' || this.state.cuisine == '')
            alert('Select cuisine. If not sure, select \"Other\" option.');

        fetch('http://localhost:5000/restaurant', {
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
            }
            else {
                this.setState({
                    showRestaurantExistsAlert: true
                });
            }
        });
    }

    render() {
        return (
            <div className="add-restaurant-container">
                <div className="container flex-column">
                    <Header title="Add Restaurant" />
                    {this.state.showThankYouAlert ?
                        <UncontrolledAlert color="success">
                            <h4>Thank you!</h4>
                            <hr />
                            <p>The restaurant has been added and will be included in the next random selection.</p>
                        </UncontrolledAlert> 
                        : null}
                    {this.state.showRestaurantExistsAlert ?
                        <UncontrolledAlert color="danger">
                            <h4>Uh-oh!</h4>
                            <hr />
                            <p>It looks like the restaurant you are trying to add already exists. Check the View Restaurants page to confirm.</p>
                            <NavLink tag={Link} className="view-restaurants-alert-link" to="/ViewRestaurants">View Restaurants</NavLink>
                        </UncontrolledAlert> 
                        : null}
                    <form>
                        <div className="form-group">
                            <label htmlFor="restaurant-name">Restaurant Name:</label>
                            <input type="text" id="restaurant-name" className="form-control" placeholder="Enter Restaurant Name" onChange={this.handleName} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="restaurant-location">Location</label>
                            <input type="text" className="form-control" id="restaurant-location" placeholder="Enter Restaurant Location" onChange={this.handleLocation} />
                        </div>
                        <label htmlFor="restaurant-cuisine">Cuisine</label>
                        <select className="form-control" onChange={this.handleCuisine}>
                            <option>Select Cuisine</option>
                            {Array.isArray(this.state.cuisines.data) && _.orderBy(this.state.cuisines.data).map( c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        <button type="reset" className="btn btn-success add-restaurant-submit" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddRestaurant;