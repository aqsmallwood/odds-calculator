import React, { Component } from 'react';

export class Calculator extends Component {
  static displayName = Calculator.name;

  constructor(props) {
    super(props);
    this.state = { oddsInput: "", result: "", error: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
   this.setState({...this.state, oddsInput: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let re = /([\+-])(\d\d\d+)/;
    if (re.exec(this.state.oddsInput) === null) {
      let error = "Invalid odds format";
      this.setState({...this.state, error});
      return
    }

    this.fetchBreakEvenPercentage(this.state.oddsInput);
  }

  async fetchBreakEvenPercentage(odds) {
    const uri = 'odds?americanOdds=' + encodeURIComponent(odds);
    const response = await fetch(uri);
    if (response.status != 200) {
      let error = "Invalid odds format";
      this.setState({...this.state, error});
      return
    }
    const data = await response.text();
    const result = "The Break Even Percentage for " + odds + " is " + data;
    this.setState({...this.state, error: "", result})
  }

  render() {
    return (
      <div>
        <h1>Break Even Percentage Calculator</h1>
        <p>
          The calculator below calulates implied win probability from American Odds.
        </p>
        <form onSubmit={this.handleSubmit}>
        { this.state.error !== "" &&
        <div className="errors">
          <label style={{color: "red"}}>Invalid Odds Format. Try Again</label>
        </div>
        }
         <label>
           Odds:
           <input name="odds" value={this.state.oddsInput} onChange={this.handleChange} placeholder="+300"/>
         </label>
         <input type="submit" value="Calculate" />
        </form>
        { this.state.result !== "" &&
          <p>{this.state.result}</p>
        }
      </div>
    );
  }
}
