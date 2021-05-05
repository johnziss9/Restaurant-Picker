import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';

class Header extends React.Component {
    render() {
        return (
            <div className="header-container">
                <h1 className="header-title">{this.props.title}</h1>
                <NavLink className="header-go-back" tag={Link} to="/Menu">Main Menu</NavLink>
            </div>
        );
    }
}

export default Header;