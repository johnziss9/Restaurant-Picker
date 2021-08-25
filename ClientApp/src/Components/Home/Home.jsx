 import React from 'react';
 import './Home.css';
import { UncontrolledAlert } from 'reactstrap';

 class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isActive: true,
            loginFail: false,
            username: '',
            password: ''
        }

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleShow = () => {
        this.setState({
            isActive: true        
        })
    }

    handleHide = () => {
        this.setState({
            isActive: false
        })
    }

    handleUsername(event) {
        this.setState({ username: event.target.value })
    }

    handlePassword(event) {
        this.setState({ password: event.target.value })
    }

    handleLogin(event) {
        fetch('http://localhost:5000/auth/Login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
        .then((Response) => Response.json())
        .then((result) => {
            sessionStorage.setItem('token', result.data);
            sessionStorage.setItem('username', this.state.username);

            if (result.success == false)
                this.setState({
                    loginFail: true
                })
            else
                this.props.history.push('/Menu');
        })
    }

     render() {
         return (
            <div className="home-container flex-column">
                {this.state.loginFail ?
                    <UncontrolledAlert color="danger">
                        <h4>Uh-oh!</h4>
                        <hr />
                        <p>It looks like the username or password you entered is incorrect. Please try again.</p>
                    </UncontrolledAlert>
                : null}
                {this.state.isActive ?
                <button type="button" className="btn btn-dark btn-lg login-btn" onClick={this.handleHide}>Login</button> :
                <form>
                    <div className="form-group">
                        <input type="text" className="form-control" id="username" placeholder="Username" onChange={this.handleUsername} />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handlePassword}/>
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-light login-form-btn" onClick={this.handleShow}>Cancel</button>
                        <button type="button" className="btn btn-dark login-form-btn" onClick={this.handleLogin}>Login</button>
                    </div>
                </form> }
            </div>
         );
     }
 }

 export default Home;