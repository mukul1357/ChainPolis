import React, { Component } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import "../App.css";
import emailjs from '@emailjs/browser';

export default class sendOTP extends Component {
    
    state = {
        searchActive: false,
        link1: null,
        link2: null,
        account: null,
        index: null,
        property: null,
        userAddress: null,
        email: '',
        otp: '',
        pan: ''
    }

    componentDidMount = async() => {
      
    }

    onSearch = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
            this.props.setStateData('load', true);
            this.props.makeBlur(1);
            let pan = document.getElementById("panInput").value
            let userAddress = await this.props.contract.methods.getUserAddressfromPAN(pan).call({ from: this.props.account});
            if(userAddress !== '0x0000000000000000000000000000000000000000') {
            let index = await this.props.contract.methods.get_current_property_index(userAddress).call({ from: this.props.account });
            let ipfs = await this.props.contract.methods.getIPFS(userAddress).call({ from: this.props.account });
            let property = await this.props.contract.methods.get_property_details(userAddress, index).call({ from: this.props.account });
            
            this.setState({index: index, link2: ipfs, property: property[0], link1: property[2]});
            this.setState({userAddress: userAddress, searchActive: true, pan: pan});
            }
            else {
              this.props.alertFunc("danger", "Invalid PAN!!");
            }
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            
          }
        }

    generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    sendOTP = async (event) => {
      event.preventDefault()
      const otp = this.generateOTP();
      this.props.setStateData('load', true);
      this.props.makeBlur(1);
      
      const email = await this.props.contract.methods.getEmail(this.state.userAddress).call({ from: this.props.account });
      this.setState({email: email, otp: otp})
      const form = {otp: otp, receiver_email: email}
      const data = {
        service_id: process.env.REACT_APP_SERVICE_ID,
        template_id: process.env.REACT_APP_TEMPLATE_ID,
        user_id: process.env.REACT_APP_PUBLIC_KEY,
        template_params: form
    };
    await this.props.contract.methods.setOTP(this.state.pan, otp).send({ from: this.props.account });

    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data)
    })

    .then(async (result) => {
        if(result.ok === true) {
          this.props.alertFunc("success", "OTP Sent Successfully")
        }
        else
          this.props.alertFunc("danger", "Some Error Occurred!!!")
    }, (error) => {
          this.props.alertFunc("danger", "Some Error Occurred!!!")
    });

      this.props.setStateData('load', false);
      this.props.makeBlur(0);
    //   if (result.status === "ok") {
    //     var pan = document.getElementById("panInput").value;
    //     await this.props.contract.methods.setOTP(pan, otp).send({ from: this.props.account });
    //     this.props.alertFunc('success', 'OTP Sent Successfully!!!');
    //   }
    //   else if(result.status === "error")
    //     this.props.alertFunc('danger', "Unable to Send OTP!!!");
    }

  render() {
    if(!this.props.state.govLoggedIn) {
      this.props.navigator("/admin/sign-in", true);
    }
    return (
        <>
        <div className='sendOTP'>
        <form onSubmit={sendOTP}>
  <div class="form-group">
    <input type="username" class="form-control" id="panInput" aria-describedby="emailHelp" placeholder="Enter PAN" required minLength={10} maxLength={10}/>
    <input type="text" name="otp" value={this.state.otp} style={{display: "none"}}/>
    <input type="text" name="receiver_email" value={this.state.email} style={{display: "none"}}/>
    <button type="button" class="btn btn-outline-primary" id='DetailsButton' onClick={this.onSearch}>Get Details</button>
  </div>
  {this.state.searchActive ?
  <>
  <div className='CardGov'>
    <div className='box2'>
    <p className='titleContentGov'>Property Description</p>
      <div className='contentBoxGov'>
        <p>{this.state.property}</p>
      </div>
    </div>
    <div className='box2'>
    <p className='titleContentGov'>Previous Registry Papers</p>
    <div className='contentBoxGov'>
    <p className='ipfsLink'><a href={this.state.link1} target='_black'>{this.state.link1}</a></p>
    </div>
    </div>
    <div className='box2'>
    <p className='titleContentGov'>New Registry Papers</p>
    <div className='contentBoxGov'>
    <p className='ipfsLink'><a href={this.state.link2} target='_black'>{this.state.link2}</a></p>
    </div>
    </div>
  </div>
  <button type="submit" class="btn btn-outline-success" id='OTPButton' onClick={this.sendOTP}>Send OTP</button>
  </>
  : undefined
  }
  </form>
  </div>
  </>
  )
}
}
