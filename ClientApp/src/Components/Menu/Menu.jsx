import React from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import menuIcon from '../../Images/chef.png';

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
            <div className='menu-wrapper'>
                <div className='container'>
                    <div className='menu-header row'>
                        <h2 className='menu-title'>Welcome, <span className='menu-title-username'>{sessionStorage.getItem('username')}</span></h2>
                        <button type="button" className="btn btn-link menu-logout-btn" onClick={this.handleLogout}>
                            <span className="menu-logout-btn-link">(Logout)</span>
                        </button>
                    </div>
                    <ul className="nav menu-nav flex-column">
                        <li className="nav-item">
                            <NavLink className="menu-nav-link" tag={Link} to="/AddRestaurant"><span><img src={menuIcon} alt='nav-link-icon' className='menu-link-icon'/></span> Add Restaurant</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="menu-nav-link" tag={Link} to="/ViewRestaurants"><span><img src={menuIcon} alt='nav-link-icon' className='menu-link-icon'/></span> View Restaurants</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="menu-nav-link" tag={Link} to="/MyRestaurants"><span><img src={menuIcon} alt='nav-link-icon' className='menu-link-icon'/></span> My Restaurants</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="menu-nav-link" tag={Link} to="/PickRestaurant"><span><img src={menuIcon} alt='nav-link-icon' className='menu-link-icon'/></span> Pick Restaurant</NavLink>
                        </li>
                    </ul>
                </div>
                <div className='home-menu-bottom'></div>
            </div>
        );
    }
}

export default Menu;