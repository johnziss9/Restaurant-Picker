import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';

class NotFound extends React.Component {

    render() {
        return (
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="not-found-text">
                        <p>Looks like the page you are trying to access doesn't exist. You have two options: </p>
                        <ol>
                            <li>Go back to the homepage.</li>
                            <li>Call John and tell him there's a error with the website.</li>
                        </ol>
                    </div>
                    {sessionStorage.getItem('token') == '' ?
                    <NavLink className="btn btn-dark back-to-home-btn" tag={Link} to="/Login">Back to Homepage</NavLink> :
                    <NavLink className="btn btn-dark back-to-home-btn" tag={Link} to="/Menu">Back to Homepage</NavLink> }
                </div>
            </div>
        );
    }
}

export default NotFound;