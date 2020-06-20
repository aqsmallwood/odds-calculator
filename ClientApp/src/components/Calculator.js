import React, { Component } from 'react';

export class Calculator extends Component {
  static displayName = Calculator.name;

  constructor(props) {
    super(props);
    this.state = { oddsInput: "200", result: 66.7, error: "", favorite: true };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFavorite = this.setFavorite.bind(this);
    this.setUnderdog = this.setUnderdog.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.payout = this.payout.bind(this);
  }

  handleChange(event) {
   this.setState({...this.state, oddsInput: event.target.value});
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.fetchBreakEvenPercentage();
    }
  }

  async setFavorite() {
    await this.setState({...this.state, favorite: true})
    if (this.state.oddsInput !== "") {
      this.fetchBreakEvenPercentage();
    }
  }

  async  setUnderdog() {
    await this.setState({...this.state, favorite: false})
    if (this.state.oddsInput !== "") {
      this.fetchBreakEvenPercentage();
    }
  }

  validateInput() {
    let re = /([\+-])(\d\d\d+)/;
    return re.exec(this.state.oddsInput) === null
  }

  handleSubmit(event) {
    event.preventDefault();

    this.fetchBreakEvenPercentage();
  }

  async fetchBreakEvenPercentage() {
    let re = /(\d\d\d+)/;

    // if (this.state.oddsInput == "") {
    //   return
    // }

    if (re.exec(this.state.oddsInput) === null) {
     let error = "Invalid odds format";
     this.setState({...this.state, error});
     return
    }

    this.setState({...this.state, error: ""});

    let americanOdds = (this.state.favorite ? '-' : '+' ) + this.state.oddsInput

    const uri = 'odds?americanOdds=' + encodeURIComponent(americanOdds);
    const response = await fetch(uri);
    if (response.status !== 200) {
      const error = await response.text();
      this.setState({...this.state, error});
      return
    }
    const data = await response.text();
    const result = (data * 100).toPrecision(3);
    this.setState({...this.state, error: "", result})
  }

  payout() {
    let totalPayout = (1/this.state.result).toPrecision(3) * 10000;
    return totalPayout;
  }

  render() {
    return (
      <div className="container">
        <h1>Break Even Percentage Calculator</h1>
        <p>
          The calculator below calculates implied win probability from American Odds.
        </p>
        <div className="odds-table">
          <div>
            <p className="table-heading">American Odds</p>
          </div>
          <div>
            <p className="table-heading">Win Probability</p>
          </div>
          <div className="input-container">
            <div className="buttons">
              <button onClick={this.setUnderdog} className={ this.state.favorite ? '' : 'active' }>+</button>
              <button onClick={this.setFavorite} className={ this.state.favorite ? 'active' : '' }>-</button>
            </div>
            <div className="input">
              { this.state.error !== "" &&
              <div className="errors">
                <label style={{color: "red"}}>{this.state.error}</label>
              </div>
              }
              <input onKeyPress={this.handleKeyPress} value={this.state.oddsInput} onChange={this.handleChange} className="odds" type="text" pattern="\d*" maxLength="3"/>
            </div>
          </div>
          <div>
            <p className="probability">{this.state.result}%</p>
          </div>
        </div>
        <h4 className="payout">Payout for $100: <span>${this.payout()}</span></h4>
      </div>
    );
  }
}
