import React, { Component } from 'react'
import '../App.css';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
require("dotenv").config();


export default class AllotProperty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            alertMessage: '',
            status: '',
            digicode: '',
            ipfsHash: ''
        }
        this.onSignIn = this.onSignIn.bind(this);
    }
    

    componentDidMount = () => {
        this.props.initialize();
        this.props.setStateData("HomePageActive", true);
    }

    onSignIn = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
            let username = this.state.username.trim();
            const fileInput = document.querySelector('input[type="file"]')
        if ((this.state.username !== '') && (fileInput.files.length > 0)) {
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
            this.props.alertFunc("primary", "Uploading to BlockChain")
            await this.props.contract.methods.allot_property(username, this.state.ipfsHash).send({ from: this.props.account });
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            this.setState({username: ''});
            }
        catch (error) {
            this.props.alertFunc("danger", "Somer Error Occurred!!");
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            console.log(error)
        }
        }
    }
}
    
  render() {
    if(!this.props.state.loggedIn) {
        this.props.navigator('/sign-in', true);
    }
    return (
        <div className="sign-up">
                <div className='signup-form'>
                <p style={{paddingBottom: '2px'}}>Enter Property Details</p>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {
                                    this.state.alertMessage !== '' && this.state.status === 'failed' ?
                                        <Message negative>
                                            {this.state.alertMessage}
                                        </Message> :
                                        this.state.alertMessage !== '' && this.state.status === 'success' ?
                                            <Message positive>
                                                {this.state.alertMessage}
                                            </Message> :
                                            console.log('')
                                }
                                <Form.Field>
                                    <textarea
                                        required
                                        type='text'
                                        placeholder='Property Description'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='file'
                                        name='Upload'
                                        id='myFiles'
                                        autoComplete="off"
                                        className='hidden'
                                        title='Upload Registry Papers'
                                    />
                                    <label for='myFiles'>Upload Registry Papers</label>
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignIn}>
                                        Allot Property
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                </div>
            </div>
    )
  }
}
