import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";
import SpinnerVerify from '../SpinnerVerify';

class SignUp extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
        pan: '',
        signedUp: false,
        verify: false,
        spinnerActive: false,
        disable: true,
        verifyClass: '',
        email: ''
    }

    componentDidMount = () => {
        this.props.initialize();
        // let doc = document.getElementsByClassName("content");
        // doc[0].style.paddingRight = "1.2em";
        let pan = document.getElementById("panStyle").style;
        pan.width = "123%";
        this.props.setStateData("HomePageActive", false);
    }

    Verify = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
        if(this.state.pan.length == 10) {
        this.setState({spinnerActive: true});
        let panStatus = await this.props.contract.methods.checkPANDetails(this.state.pan).call({ from: this.props.account });
        if(panStatus === "Exists") {
            this.props.alertFunc("danger", "PAN is already linked with an Account!!!");
            this.setState({spinnerActive: false})
            this.setState({verify: false})
            this.props.setStateData('disable', true);
            this.setState({disable: true});
        }
        else {
            let pan = document.getElementById("panStyle").style;
            pan.width = "123%";
            this.props.alertFunc("success", "PAN Verification Successful");
            this.setState({spinnerActive: false})
            this.setState({verify: true})
            this.setState({disable: false});
        }
    }
    else {
        this.props.alertFunc("danger", "PAN must of 10 letters!");
    }
}
    }

    Edit = () => {
        this.setState({disable: true, verify: false})
        let pan = document.getElementById("panStyle").style;
        pan.width = "123%";
    }

    onSignUp = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
        if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
            let username = this.state.username.trim();
            let password = this.state.password.trim();
            let digicode = this.state.digicode.trim();
            let pan = this.state.pan.trim();
            let email = this.state.email.trim();

            
            if (password.length < 8) {
                this.props.alertFunc("danger", "Password must be of at least 8 characters")
                return;
            } else {

            } if (digicode.length !== 6) {
                this.props.alertFunc("danger", "DigiCode must be of 6 digits")
                return
            } else {
                this.props.setStateData('load', true);
                this.props.setStateData('disable', true);
                this.props.makeBlur(1);
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });
                if (userAddress !== '0x0000000000000000000000000000000000000000') {
                    this.props.alertFunc("danger", "Account already Exists!")
                    this.props.setStateData('load', false);
                    this.props.makeBlur(0);
                    this.props.setStateData('disable', false);
                    return;
                } else {
                    let hash = await AuthenticationHash(username, this.props.account, password, digicode, this.props.web3);
                    await this.props.contract.methods.register(hash, pan, email).send({ from: this.props.account });
                    this.props.alertFunc("success", "Sign Up Successful");
                    this.props.setStateData('load', false);
                    this.props.makeBlur(0);
                    this.props.setStateData('disable', false);
                    this.Edit();
                    this.props.accountCreated(this.state.signedUp);
                    this.props.navigator('/sign-in', true);
                    return;
                }
            }
        }
    }
    }

    render() {
        return (
            <div className="sign-up">
                <div></div>
                <div className='signup-form'>
                <p style={{paddingBottom: '2px', position: 'relative', left: '40px', marginBottom: '1.1em'}}>Create an account</p>
                                <div className='field' id="panStyle" style={{width: '123%'}}>
                                <div id='panContain'>
                                    <input
                                        required
                                        type='text'
                                        placeholder='PAN Number'
                                        value={this.state.pan}
                                        autoComplete="off"
                                        onChange={e => this.setState({ pan: e.target.value })}
                                        disabled={!this.state.disable}
                                        minLength={10}
                                        id="pan"
                                    />
                                    <label for="pan" className='labelPassword'>
                                        {this.state.spinnerActive === true ? <SpinnerVerify/> : undefined}
                                        {this.state.spinnerActive === true ? undefined : this.state.verify === true ? <button type="button" className="verify-forgot" onClick={this.Edit}>Edit</button> : <button type="button" className="verify-forgot" onClick={this.Verify}>Verify</button>}
                                    </label>
                                    </div>
                                    </div>
                                
                                    <input
                                        required
                                        type='text'
                                        placeholder='Username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                        disabled={this.state.disable}
                                    />
                                    <input
                                        required
                                        type='email'
                                        placeholder='Enter Email'
                                        value={this.state.email}
                                        autoComplete="off"
                                        onChange={e => this.setState({ email: e.target.value })}
                                        disabled={this.state.disable}
                                    />
                                <label for="password" className='labelPassword'>
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('password', 1)}
                    disabled={this.state.disable}
                  >
                    <i className="showPassword material-icons">{this.props.state.password}</i>
                  </button>
                  </label>
                                    <input
                                        required
                                        type='password'
                                        placeholder='Password'
                                        id='password'
                                        value={this.state.password}
                                        autoComplete="new-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                        disabled={this.state.disable}
                                        minLength={8}
                                    />
                                <label for="code" className='labelPassword'>
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('code', 2)}
                    disabled={this.state.disable}
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
                                        disabled={this.state.disable}
                                        minLength={8}
                                    />
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignUp} disabled={this.state.disable}>
                                        Create account
                                    </Button>
                    <div className="signin-onUp">
                        Already have an account? <Link to='/sign-in'>Sign in</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp
