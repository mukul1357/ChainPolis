import React, { Component } from 'react';
import '../App.css';
class Home extends Component {

    componentDidMount = () => {
        this.props.setStateData("HomePageActive", true);
    }

    render() {
        return (
            <>
            <div className='homePage'>
                <div id='mainBox'>
                    <div id='descBox'>
                        <p id='desc1'>"Connecting Homes"</p>
                        <button type="button" className=" Searching btn btn-outline-success my-2 my-sm-0" id="SellButton" onClick={() => this.props.changeRoute('/about', false)}><p id="connectText">About</p></button>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default Home;
