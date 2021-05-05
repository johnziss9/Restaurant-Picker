import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...rest }) {

    var token = sessionStorage.getItem('token');
    
    return (
        <Route {...rest} render={props => (
            token !== null ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
            )
        )} />
    )
}

export default ProtectedRoute;