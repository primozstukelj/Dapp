import React, { Component } from "react";
import Link from "next/link";
import "../scss/style.scss";

class Index extends Component {
  render() {
    return (
      <section className="section-landing-page">
        <nav>
          <div className="row">
            <Link href="https://ecta.io/">
              <a className="standart__anchor" target="_blank">
                <img
                  src="/static/img/ecta-white.png"
                  alt="ECTA logo"
                  className="logo"
                />
              </a>
            </Link>
            <ul className="main-nav">
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
        <div className="bg-video">
          <video className="bg-video__content" autoPlay={true} loop={true}>
            <source src="/static/img/video1.mp4" type="video/mp4" />
          </video>
          <div className="bg-image" />
        </div>
        <div className="hero-text-box">
          <h1 className="heading-primary heading-primary--main heading-primary--landing-page">
          The first blockchain-based
            <br />
            trust protocol for global
            <br />
            employability
          </h1>
          <Link href="/login">
          <a className="btn btn-full u-margin-left anim" href="#">
            Login
          </a>
          </Link>
          <Link href="https://ecta.io/" className="heading-primary--sub">
          <a className="btn btn-ghost anim" target="_blank">
            Show me more
          </a>
          </Link>
        </div>
      </section>
    );
  }
}

export default Index;