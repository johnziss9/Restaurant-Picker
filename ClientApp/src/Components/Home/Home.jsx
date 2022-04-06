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
        this.onDismiss = this.onDismiss.bind(this);
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
        fetch('https://restaurant-picker5.herokuapp.com/auth/Login', {
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

    onDismiss() {
        this.setState({
            loginFail: false
        });
    }

     render() {
         return (
            <div className='home-wrapper'>
                <div className='container home-wrapper-container'>
                    {this.state.loginFail ?
                        <UncontrolledAlert color="danger" toggle={this.onDismiss}>
                            <h4>Uh-oh!</h4>
                            <hr />
                            <p>It looks like the username or password you entered is incorrect. Please try again.</p>
                        </UncontrolledAlert>
                        : null
                    }
                    <div className='home-content'>
                        <h1 className='home-title'>Restaurant Picker</h1>
                        {this.state.isActive ?
                        <button type="button" className="btn btn-dark btn-lg home-login-btn" onClick={this.handleHide}>Login</button> :
                        <form className='login-form'>
                            <div className="form-group">
                                <input type="text" className="form-control home-textbox" id="username" placeholder="Username" onChange={this.handleUsername} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control home-textbox" id="password" placeholder="Password" onChange={this.handlePassword}/>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-light home-form-login-btn" onClick={this.handleShow}>Cancel</button>
                                <button type="button" className="btn btn-dark home-form-login-btn" id="home-form-login-btn-login" onClick={this.handleLogin}>Login</button>
                            </div>
                        </form> }
                    </div>
                </div>
                <div className='home-login-bottom'></div>
            </div>
         );
     }
 }

 export default Home;