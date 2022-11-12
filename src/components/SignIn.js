import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthValidation from '../utils/AuthValidation';
import "../App.css";
import Property from '../img/Property.jpg';

class SignIn extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
        alertMessage: '',
        status: '',
        loggedIn: false
    }

    componentDidMount = () => {
        this.props.initialize();
        this.props.setStateData("HomePageActive", false);
    }

    onSignIn = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
        if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
            let username = this.state.username.trim();
            let password = this.state.password.trim();
            let digicode = this.state.digicode.trim();

            let usernameToSend = username;

            //===
            if (password.length < 8) {
                this.setState({
                    alertMessage: "Password must be of at least 8 characters",
                    status: 'failed',
                    password: '',
                    digicode: '',
                });
                setTimeout(() => {
                    this.setState({
                      alertMessage: null,
                      status: ''
                    })
                  }, 1800);
                return;
            } else {

            } if (digicode.length !== 6) {
                this.setState({
                    alertMessage: "DigiCode must be of 6 digits",
                    status: 'failed',
                    digicode: ''
                });
                setTimeout(() => {
                    this.setState({
                      alertMessage: null,
                      status: ''
                    })
                  }, 1800);
                return
            } else {
                this.props.setStateData('load', true);
                this.props.makeBlur(1);
                this.props.setStateData('disable', true);
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });
                if (userAddress === '0x0000000000000000000000000000000000000000') {
                    this.setState({
                        alertMessage: 'Account does not Exists!',
                        status: 'failed',
                        username: '',
                        password: '',
                        digicode: '',
                    });
                    setTimeout(() => {
                        this.setState({
                          alertMessage: null,
                          status: ''
                        })
                      }, 1800);
                    this.props.setStateData('load', false);
                    this.props.setStateData('disable', false);
                    this.props.makeBlur(0);
                    return;
                } else {
                    let validated = await
                        AuthValidation(
                            username,
                            this.props.account,
                            password, digicode,
                            this.props.web3,
                            this.props.contract
                        );

                    if (!validated) {
                        this.setState({
                            alertMessage: 'Incorrect Credentials',
                            status: 'failed',
                            username: '',
                            password: '',
                            digicode: '',
                        });
                        setTimeout(() => {
                            this.setState({
                              alertMessage: null,
                              status: ''
                            })
                          }, 1800);
                        this.props.setStateData('load', false);
                        this.props.makeBlur(0);
                        this.props.setStateData('disable', false);
                        return
                    } else {
                        this.setState({
                            username: '',
                            password: '',
                            digicode: '',
                            status: 'success',
                            alertMessage: "Sign In successful",
                            loggedIn: true
                        });
                        setTimeout(() => {
                            this.setState({
                              alertMessage: null,
                              status: ''
                            })
                          }, 1800);

                        this.props.setStateData('load', false);
                        this.props.makeBlur(0);
                        this.props.setStateData('disable', false);
                        this.props.userSignedIn(
                            this.state.loggedIn,
                            usernameToSend
                        );
                        this.setState({
                            username: '',
                            password: '',
                            digicode: ''
                        })
                        this.props.setNavBarWidth();
                        // this.props.navigator('/sell', true);
                        this.props.navigator("/api/allot/property", true);
                        return;
                    }
                }
            }
        }
    }
}
    render() {
        return (
            <div className="sign-up">
                <div>
                {/* <img src={Property} id='property'></img> */}
                </div>
                <div className='signup-form'>
                <p style={{paddingBottom: '2px'}}>Sign in to your account</p>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                <label for="password" className='labelPassword'>
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('password', 1)}
                  >
                    <i className="showPassword material-icons">{this.props.state.password}</i>
                  </button>
                  </label>
                                    <input
                                        required
                                        type='password'
                                        placeholder='Password'
                                        value={this.state.password}
                                        id='password'
                                        autoComplete="current-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                        minLength={8}
                                    />
                                <label for="code" className='labelPassword'>
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('code', 2)}
                  >
                    <i className="showPassword material-icons">{this.props.state.code}</i>
                  </button>
                  </label>
                                    <input
                                        required
                                        type='password'
                                        placeholder='6 Digit Code'
                                        value={this.state.digicode}
                                        id='code'
                                        autoComplete="digicode"
                                        onChange={e => this.setState({ digicode: e.target.value })}
                                        length={8}
                                    />
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignIn} disabled={this.props.state.disable}>
                                        Sign in
                                    </Button>
                            <div className="signin-onUp">
                                Don't have an account? <Link to='/sign-up'>Sign up</Link>
                            </div>
                </div>
            </div>
        );
    }
}

export default SignIn
