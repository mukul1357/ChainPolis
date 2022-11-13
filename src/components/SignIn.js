import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthValidation from '../utils/AuthValidation';
import "../App.css";

class SignIn extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
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

            
            if (password.length < 8) {
                this.props.alertFunc("danger", "Password must be of at least 8 characters")
                return;
            } else {

            } if (digicode.length !== 6) {
                this.props.alertFunc("danger", "DigiCode must be of 6 digits")
                return
            } else {
                this.props.setStateData('load', true);
                this.props.makeBlur(1);
                this.props.setStateData('disable', true);
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });
                if (userAddress === '0x0000000000000000000000000000000000000000') {
                    this.props.alertFunc("danger", "Account does not Exists!")
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
                        this.props.alertFunc("danger", "Incorrect Credentials")
                        this.props.setStateData('load', false);
                        this.props.makeBlur(0);
                        this.props.setStateData('disable', false);
                        return
                    } else {
                        this.props.alertFunc("success", "Sign In Successful")
                        this.props.setStateData('load', false);
                        this.props.makeBlur(0);
                        this.props.setStateData('disable', false);
                        this.props.userSignedIn(
                            true,
                            this.state.username
                        );
                        this.setState({
                            username: '',
                            password: '',
                            digicode: ''
                        })
                        this.props.setNavBarWidth();
                        // this.props.navigator('/sell', true);
                        this.props.navigator("/sell", true);
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
                </div>
                <div className='signup-form'>
                <p style={{paddingBottom: '2px', width: '445px', left: '19px', position: 'relative'}}>Sign In to your Account</p>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        className='adminLogin'
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
                                        className='adminLogin'
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
                                        className='adminLogin'
                                        onChange={e => this.setState({ digicode: e.target.value })}
                                        length={8}
                                    />
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignIn} disabled={this.props.state.disable} style={{position: 'relative', left: '47px'}}>
                                        Sign in
                                    </Button>
                            <div className="signin-onUp adminLogin">
                                Don't have an account? <Link to='/sign-up'>Sign up</Link>
                            </div>
                </div>
            </div>
        );
    }
}

export default SignIn
