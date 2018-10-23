import React, { Component } from "react";
import Link from "next/link";
import "../scss/style.scss";
import $ from 'jquery';

class Login extends Component {
  state = {
    inputDev: 'developer',
    inputCom: 'company',
    inputVot: ''
  }

  componentDidMount() {
    $("#loadingSpinner").hide();
  }

  updateInputDev = e => {
    e.preventDefault();
    this.setState({
      inputDev: e.target.value
    })
  }

  updateInputCom = e => {
    e.preventDefault();
    this.setState({
      inputCom: e.target.value
    })
  }

  updateInputVot = e => {
    e.preventDefault();
    this.setState({
      inputVot: e.target.value
    })
  }

  render() {
    return (
      <div>
        <div className="loading" id="loadingSpinner">
          Loading&#8230;
        </div>
      <section className="section-tours">
        <nav className="nav-login">
          <div className="row row--login">
            <Link href="/">
              <a>
                <img
                  src="/static/img/ecta2.png"
                  alt="ECTA logo"
                  className="logo-login"
                />
              </a>
            </Link>
            <ul className="main-nav--login">
              <li>
                <Link href="https://ecta.io/">
                  <a target="_blank">WHAT IS ECTA</a>
                </Link>
              </li>
              <li>
                <Link href="https://ecta.io/whitepaper/">
                  <a target="_blank">WHITEPAPER</a>
                </Link>
              </li>
              <li>
                <Link href="https://ecta.io/">
                  <a target="_blank">FAQS</a>
                </Link>
              </li>
              <li>
                <Link href="https://ecta.io/">
                  <a target="_blank">CONTACT US</a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="u-center-text u-margin-top row anim-top">
          <h2 className="heading-secondary color-black">Who are you?</h2>
        </div>

        <div className="row">
          <div className="col-1-of-3">
            <div className="card anim-bottom">
              <div className="card__side card__side--front">
                <div className="card__picture card__picture--1">&nbsp;</div>
                <h4 className="card__heading">
                  <span className="card__heading-span card__heading-span--1">
                    Developer
                  </span>
                </h4>
                <div className="card__details">
                  <ul>
                    <li>Prove your skills</li>
                    <li>Earn reputation</li>
                    <li>Get discovered</li>
                    <li>Create experience</li>
                      <li>Simple User Interface</li>
                    </ul>
                  </div>
                </div>
                <div className="card__side card__side--back card__side--back-1">
                  <div className="card__cta">
                    <div className="card__form">
                      <div>
                        <label className="card__form--user-label">
                          Username:
                        </label>
                        <input
                          type="text"
                          defaultValue="developer"
                          placeholder="Username"
                          className="card__form-input"
                          onChange={this.updateInputDev}
                        />
                        <svg className="icon icon-user">
                          <use xlinkHref="/static/img/symbol-defs.svg#icon-user" />
                        </svg>
                      </div>
                      <div>
                        <label className="card__form--user-label">
                          Password:
                        </label>
                        <input
                        defaultValue="asdfasdf12"
                          type="password"
                          placeholder="Password"
                          className="card__form-input"
                        />
                        <svg className="icon icon-lock">
                          <use xlinkHref="/static/img/symbol-defs.svg#icon-lock" />
                        </svg>
                      </div>
                    </div>
                    <Link href={{ pathname: '/dashboard', query: { type: this.state.inputDev } }}>
                      <button className="login__btn_inline">Log in</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-1-of-3">
              <div className="card anim-bottom">
                <div className="card__side card__side--front">
                  <div className="card__picture card__picture--2">&nbsp;</div>
                  <h4 className="card__heading">
                    <span className="card__heading-span card__heading-span--2 ">
                      Company
                    </span>
                  </h4>
                  <div className="card__details">
                    <ul>
                      <li>Time-saving recruiting tools</li>
                      <li>Hire talented developers</li>
                      <li>Avoid fake CV's</li>
                      <li>Simple user interface</li>
                      <li>Communication Tools</li>
                    </ul>
                  </div>
                </div>
                <div className="card__side card__side--back card__side--back-2">
                  <div className="card__cta">
                    <div className="card__form">
                      <div>
                        <label className="card__form--user-label">
                          Username:
                        </label>
                        <input
                          defaultValue="company"
                          type="text"
                          placeholder="Username"
                          className="card__form-input"
                          onChange={this.updateInputCom}
                        />
                        <svg className="icon icon-user">
                          <use xlinkHref="/static/img/symbol-defs.svg#icon-user" />
                        </svg>
                      </div>
                      <div>
                        <label className="card__form--user-label">
                          Password:
                        </label>
                        <input
                        defaultValue="asdfasdf12"
                          type="password"
                          placeholder="Password"
                          className="card__form-input"
                        />
                        <svg className="icon icon-lock">
                          <use xlinkHref="/static/img/symbol-defs.svg#icon-lock" />
                        </svg>
                      </div>
                    </div>
                    <Link href={{ pathname: '/dashboard', query: { type: this.state.inputCom } }}>
                      <button onClick="#" className="login__btn_inline">Log in</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-1-of-3">
              <div className="card anim-bottom">
                <div className="card__side card__side--front">
                  <div className="card__picture card__picture--3">&nbsp;</div>
                  <h4 className="card__heading">
                    <span className="card__heading-span card__heading-span--3">
                      Voter
                    </span>
                  </h4>
                  <div className="card__details">
                    <ul>
                      <li>Simple user interface</li>
                      <li>Show your knowledge</li>
                      <li>Make the right decision</li>
                      <li>Help others</li>
                      <li>Everything in one place</li>
                    </ul>
                  </div>
                </div>
                <div className="card__side card__side--back card__side--back-3">
                  <div className="card__cta">
                    <div className="card__form">
                      <div>
                        <label className="card__form--user-label">
                          Username:
                        </label>
                        <input
                          type="text"
                          placeholder="Username"
                          className="card__form-input"
                          onChange={this.updateInputVot}
                        />
                        <svg className="icon icon-user">
                          <use xlinkHref="/static/img/symbol-defs.svg#icon-user" />
                        </svg>
                      </div>
                      <div>
                        <label className="card__form--user-label">
                          Password:
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          className="card__form-input"
                        />
                        <svg className="icon icon-lock">
                          <use xlinkHref="/static/img/symbol-defs.svg#icon-lock" />
                        </svg>
                      </div>
                    </div>
                    <Link href={{ pathname: '/dashboard', query: { type: this.state.inputVot } }}>
                      <button className="login__btn_inline">Log in</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="krnek u-center-text u-padding-bottom">
            <Link href="/">
              <a href="#" className="btn btn-full anim">
                Go back
              </a>
            </Link>
          </div>
        </section>
        </div>
    );
  }
}

export default Login;
