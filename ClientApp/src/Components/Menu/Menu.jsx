import React from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';

class Menu extends React.Component {

    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        sessionStorage.clear();
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="menu-container flex-column">
                <div className="menu-header row">
                    <h3>Hello, {sessionStorage.getItem('username')}</h3>
                    <button type="button" className="btn btn-link" onClick={this.handleLogout}>
                        <span className="menu-logout-button">(Logout)</span>
                    </button>
                </div>
                

                <ul className="nav menu-nav flex-column">
                    <li className="nav-item">
                        <NavLink className="menu-nav-link" tag={Link} to="/AddRestaurant">Add Restaurant</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="menu-nav-link" tag={Link} to="/ViewRestaurants">View Restaurants</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="menu-nav-link" tag={Link} to="/MyRestaurants">My Restaurants</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="menu-nav-link" tag={Link} to="/PickRestaurant">Pick Restaurant</NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Menu;