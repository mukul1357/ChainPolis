import React, { Component } from 'react'
import '../App.css';
import OtpInput from 'react-otp-input';

export default class receiveOTP extends Component {
    
    state = {
        otp: null
    }

componentDidMount = () => {
  this.form = document.querySelector("#otp-form");
    this.inputs = document.querySelectorAll(".otp-input");
    
    this.form.addEventListener("input", (e) => {
      const target = e.target;
      const value = target.value;
      this.toggleFilledClass(target);
      if (target.nextElementSibling) {
        target.nextElementSibling.focus();
      }
      // verifyOTP();
    });

    this.inputs.forEach((input, currentIndex) => {
      // fill check
      this.toggleFilledClass(input);
    
      // paste event
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        this.inputs.forEach((item, index) => {
          if (index >= currentIndex && text[index - currentIndex]) {
            item.focus();
            item.value = text[index - currentIndex] || "";
            this.toggleFilledClass(item);
            // verifyOTP();
          }
        });
      });

      input.addEventListener("keydown", (e) => {
        if (e.keyCode === 8) {
          e.preventDefault();
          input.value = "";
          // console.log(input.value);
          this.toggleFilledClass(input);
          if (input.previousElementSibling) {
            input.previousElementSibling.focus();
          }
        } else {
          if (input.value && input.nextElementSibling) {
            input.nextElementSibling.focus();
          }
        }
      });
  });
}

isAllInputFilled = () => {
  return Array.from(this.inputs).every((item) => item.value);
};

getOtpText = () => {
  let text = "";
  this.inputs.forEach((input) => {
    text += input.value;
  });
  return text;
};

verifyOTP = () => {
  if (this.isAllInputFilled()) {
    const text = this.getOtpText();
    return text
  }
  return ""
};

toggleFilledClass = (field) => {
  if (field.value) {
    field.classList.add("filled");
  } else {
    field.classList.remove("filled");
  }
};

  // backspace event

    Verify = async() => {
        let input = this.verifyOTP()
        if(input.length < 6) {
            this.props.alertFunc("danger", "Insufficient Length");
        }
        else {
        this.props.setStateData('load', true);
        this.props.makeBlur(1);
        console.log(this.props.contract.methods)
        let otp = await this.props.contract.methods.getOTP(this.props.account).call({ from: this.props.account });
        console.log(await otp)
        if(input === otp) {
            await this.props.contract.methods.sell_property(this.props.state.property[0], this.props.state.pan, this.props.state.property[2], this.props.state.index).send({ from: this.props.account });
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            this.props.alertFunc("success", "Property Sold Successfully!");
        }
        else {
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            this.props.alertFunc("danger", "Property Not Sold!!!");
        }
    }
    }

  render() {
    if(!this.props.state.loggedIn) {
      this.props.navigator('/sign-in', true);
    }
    return (
      <div id='box1'>
        <div id='box2'>
        <p id='verifyText'>OTP Verification</p>
        <p id='smallText'>Your Documents have been sent to government for verification</p>
        <p id='smallText'>An OTP will be sent to the government to your registered email address</p>
        
  <div class="form-group">
  <form id="otp-form">
      <input type="text" class="otp-input" maxlength="1"/>
      <input type="text" class="otp-input" maxlength="1"/>
      <input type="text" class="otp-input" maxlength="1"/>
      <input type="text" class="otp-input" maxlength="1"/>
      <input type="text" class="otp-input" maxlength="1"/>
      <input type="text" class="otp-input" maxlength="1"/>
    </form>
    <button type="button" class="btn btn-outline-primary" id='DetailsButton' onClick={this.Verify}>Verify and Sell</button>
  </div>
      </div>
      </div>
    )
  }
}
