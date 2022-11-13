import React, { Component } from 'react'
import { Form, Button, Card, Message } from 'semantic-ui-react';
import '../App.css';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
require("dotenv").config();

export default class SellContinue extends Component {

    state = {
        propertyDesc: '',
        oldipfslink: '',
        ipfsHash: ''
    }

    componentDidMount = () => {
        this.props.initialize();
        this.props.setStateData("HomePageActive", true);
        try {
        this.setState({propertyDesc: this.props.state.property[0], oldipfslink: this.props.state.property[2]});
        }
        catch {
            this.props.navigator('/sign-in', true);
        }
    }

    onSignIn = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
            if(this.props.state.pan.length === 10) {
            let panStatus = await this.props.contract.methods.checkPANDetails(this.props.state.pan).call({ from: this.props.account });
            if(panStatus === "Exists") {
            const fileInput = document.querySelector('input[type="file"]')
        if ((this.state.propertyDesc !== '') && (fileInput.files.length > 0)) {
            this.props.setStateData('load', true);
            this.props.makeBlur(1);
            this.props.alertFunc("primary", "Uploading File to IPFS")
            try {
            const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_KEY })
            const rootCid = await client.put(fileInput.files)
            const info = await client.status(rootCid)
            const res = await client.get(rootCid)
            // const files = await res.files()
            // for (const file of files) {
            //     this.setState({ipfsHash: "https://ipfs.io/ipfs/"+file.cid})
            // }
            let url = await res.url
            url = url.split("/")
            var name = this.props.urlCreate(fileInput.files[0].name)
            this.setState({ipfsHash: "https://ipfs.io/ipfs/"+url[4]+'/'+name})
            console.log(this.state.ipfsHash)
        
            this.props.alertFunc("primary", "Uploading to BlockChain")
              await this.props.contract.methods.set_current_property_index(this.props.account, this.props.state.index).send({ from: this.props.account });
              await this.props.contract.methods.setIPFS(this.props.account, this.state.ipfsHash).send({ from: this.props.account });
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            this.props.navigator("/api/receiveOTP", false);
        }
        catch (error) {
            this.props.alertFunc("danger", "Somer Error Occurred!!");
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            console.log(error)
        }
        }
        else
            this.props.alertFunc("danger", "Information is not Sufficient!!!");
    }
    else {
        this.props.alertFunc("danger", "PAN does not Exist!!!")
    }
}
else
    this.props.alertFunc("danger", "PAN must be of 10 letters")
    }
}

  render() {
    if(!this.props.state.loggedIn) {
        this.props.navigator('/sign-in', true);
    }
    return (
        <div className="sign-up">
        <div className='signup-form'>
        <p style={{paddingBottom: '2px', left: '38px', position: 'relative'}}>Property Details</p>
                            <input
                                required
                                type='text'
                                class="form-control"
                                id="panText"
                                aria-describedby="emailHelp"
                                placeholder="Enter PAN of Buyer"
                                minLength={10}
                                maxLength={10}
                                value={this.props.state.pan}
                                autoComplete="off"
                                className='adminLogin'
                                onChange={e => this.props.setStateData('pan', e.target.value)}
                            />
                            <textarea
                                required
                                type='text'
                                placeholder='Property Description'
                                value={this.state.propertyDesc}
                                autoComplete="off"
                                id='pdesc'
                                className='adminLogin'
                                onChange={e => this.setState({ propertyDesc: e.target.value })}
                            />
                            <input
                                required
                                type='url'
                                placeholder='IPFS Link (Old)'
                                value={this.state.oldipfslink}
                                autoComplete="off"
                                id='urlID'
                                className='adminLogin'
                                onChange={e => this.props.alertFunc("danger", "Can't Change the link for Old Registry Papers")}
                            />
                            <input
                                required
                                type='file'
                                name='Upload'
                                id='myFiles'
                                autoComplete="off"
                                className='hidden adminLogin'
                                title='Upload Registry Papers'
                            />
                            <Button type='submit' primary fluid size='large' onClick={this.onSignIn} style={{position: 'relative', left: '47px'}}>
                                Send for Verification
                            </Button>
        </div>
    </div>
    )
  }
}
