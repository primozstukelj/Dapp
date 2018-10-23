import React, { Component } from "react";
import Link from "next/link";
import "../scss/style.scss";
import $ from "jquery";
import { Button, Segment, Dimmer, Loader } from 'semantic-ui-react';
import Contract from "../ethereum/contract";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { Grid, Image, Table } from "semantic-ui-react";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      type: this.props.url.query.type
    };
  }

  state = {
    name: "",
    revenue: 0,
    balance: "",
    contracts: [],
    skills: "",
    projects: "",
    taskName: "",
    developerName: "",
    numberOfECTAPAY: 0,
    timeLimit: "",
    description: "",
  };

  changeTaskName = e => {
    e.preventDefault();

    this.setState({ taskName: e.target.value });
  }

  changeNumberOfECTAPAY = e => {
    e.preventDefault();

    this.setState({ numberOfECTAPAY: e.target.value });
  }

  changeTimeLimit = e => {
    e.preventDefault();

    this.setState({ timeLimit: e.target.value });
  }

  changeDescription = e => {
    e.preventDefault();

    this.setState({ description: e.target.value });
  }

  createNewTask = async e => {
    e.preventDefault();
    $("#createButton").addClass("loading");

    this.setState({
      projects: this.state.projects + 1,
      taskName: "Smart Contract for ECTA Platform",
      developerName: "developer",
      numberOfECTAPAY: 50,
      revenue: this.state.revenue - 50,
      timeLimit: 20,
      description: "Small Contract written in Solidity."
    });
    //var value = this.state.revenue - this.state.numberOfECTAPAY;
    //console.log(value);
    //console.log(this.state);

    try {
      const accounts = await web3.eth.getAccounts();
      //console.log(accounts);
      //console.log(this.state);
      let pay = this.state.numberOfECTAPAY / 1000;

      try {
        await factory.methods.createContracts("0xF0f0a942266C8750FbE518e227602beC331AC13a", "0x25E79cE502Bec3dC71Acdd10fae573e2aF52588C",
        "0xdbb3317aF6e9Ec8da1284D3cC79005f21eb5237d", this.state.timeLimit, this.state.taskName, this.state.description)
        .send({
          from: accounts[0],
          value: web3.utils.toWei(pay.toString(), "ether")
        });
      } catch(error) {
        console.log(error.message);
      }
      
      const address = await factory.methods.getLastContractAddress().call();
      console.log(address);
      //const contract = Contract(address);

      $("#createButton").removeClass("loading");
      this.setState({ contracts: [...this.state.contracts, address] });
      $.ajax({
        url: "http://localhost:3000/createContract",
        type: "POST",
        dataType: 'json',
        data: { "address": address, "revenue": this.state.revenue },
        success: data => {
          //console.log(data);
        }
      });
      $("#afterCreateTask").click();

    } catch (error) {
      console.log(error.message);//error have message property
    }
  }

  async loadDataFromSmartContract() {
    const campaign = Contract(this.state.contracts[this.state.contracts.length - 1]);
    const summary = await campaign.methods.getSummary().call();
    const accounts = await web3.eth.getAccounts();
    console.log(summary);

    $("#taskNameField").html(summary[0]);
    $("#timeLimitField").html(summary[1] + " days");
    $("#ectaPayField").html(web3.utils.fromWei((parseInt(summary[2]) * 1000).toString(), 'ether'));
    if ($("#ectaPayField").html() == "0") {
      $("#ectaPayField").html("50");
    }
    $("#descriptionField").html(summary[4]);

    switch (summary[3]) {
      case "0":
        if (this.state.type == "developer") { // prikaži še zraven gumb in ko klik gumb kaj se zgodi (daš v review), pošlješ stanje v pogodbo tudi seveda in prikažeš na UI
          $("#inProgressText").removeClass("hiddenButtonTable");
          $("#inProgressText a").attr("href", "#");
          $("#inProgressText a").click(function() {
            //console.log("lcicked");
            
            //console.log(accounts);
            campaign.methods.sendToReview("0xF0f0a942266C8750FbE518e227602beC331AC13a").send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
              if (error) {
                console.log(error);
              } else {
                console.log(txHash);
                $("#inProgressText").addClass("hiddenButtonTable");
                $("#inReviewText").removeClass("hiddenButtonTable");
              }
            });
          });

        } else { // prikaži samo in progress
          $("#inProgressText").removeClass("hiddenButtonTable");
        }
        break;
      case "1":
        if (this.state.type == "developer") { // tukaj prikažeš samo in review
          $("#inReviewText").removeClass("hiddenButtonTable");
        }
        else if (this.state.type == "company") {
          if (summary[5]) {
            // tukaj daš samo in progress, ker je že glasoval
            $("#inReviewText").removeClass("hiddenButtonTable");
          } else {
            $("#yesOrNoText").removeClass("hiddenButtonTable");
            $("#yesOrNoText a.yes").attr("href", "#");
            $("#yesOrNoText a.yes").click(function() {
              //console.log("lcicked");
              
              //console.log(accounts);
              campaign.methods.isProductOk(accounts[0], true).send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
                if (error) {
                  console.log(error);
                } else {
                  console.log(txHash);
                  $("#yesOrNoText").addClass("hiddenButtonTable");
                  $("#completedText").removeClass("hiddenButtonTable");
                }
              });
            });

            $("#yesOrNoText a.no").attr("href", "#");
            $("#yesOrNoText a.no").click(function() {
              //console.log("lcicked");
              
              //console.log(accounts);
              campaign.methods.isProductOk(accounts[0], false).send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
                if (error) {
                  console.log(error);
                } else {
                  console.log(txHash);
                  $("#yesOrNoText").addClass("hiddenButtonTable");
                  $("#declineText").removeClass("hiddenButtonTable");
                }
              });
            });
            // prikažeš gumbe za glasovanje, narediš dva click eventa (če za potem completed, če ne potem pustiš in review), pošlješ na pogodbo, če je yes potem lahko zaključiš vse 
          }
        }
        else if (this.state.type == "voter1") {
          // prvo je potrebno preveriti, če je že company glasoval
          if (!summary[5]) {
            // tukaj daš samo in progress, ker še company ni glasoval
            $("#inReviewText").removeClass("hiddenButtonTable");
          }
          else if (summary[6]) {
            // tukaj daš samo in progress, ker je že glasoval
          } else {
            // prikažeš gumbe za glasovanje, narediš dva click eventa (če za potem completed, če ne potem pustiš in review), pošlješ na pogodbo, če je yes potem lahko zaključiš vse,
            // potrebno je tudi preveriti, če je že drugi glasoval (ker če je zadnji glasovalec)
          }
        }
        else {
          // prvo je potrebno preveriti, če je že company glasoval
          if (!summary[5]) {
            // tukaj daš samo in progress, ker še company ni glasoval
            $("#inReviewText").removeClass("hiddenButtonTable");
          }
          else if (summary[6]) {
            // tukaj daš samo in progress, ker je že glasoval
          } else {
            // prikažeš gumbe za glasovanje, narediš dva click eventa (če za potem completed, če ne potem pustiš in review), pošlješ na pogodbo, če je yes potem lahko zaključiš vse,
            // potrebno je tudi preveriti, če je že drugi glasoval (ker če je zadnji glasovalec)
          }
        }
        break;
      case "2":
        $("#completedText").removeClass("hiddenButtonTable");
        // prikaži completed samo
        // poberi denar - developer
        if (this.state.type == "developer") {
          $("#completedText a").attr("href", "#");
          $("#completedText a").click(() => {
            campaign.methods.transferMoneyToDeveloper().send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
              if (error) {
                console.log(error);
              } else {
                console.log(txHash);
                $("#completedText a").removeAttr("href", "#");

                this.setState({revenue: this.state.revenue + parseInt(web3.utils.fromWei((parseInt(summary[2]) * 1000).toString(), 'ether')), skills: parseInt(this.state.skills) + 25});

                $.ajax({
                  url: "http://localhost:3000/finish",
                  type: "POST",
                  dataType: 'json',
                  data: { "status": "success", "revenue": web3.utils.fromWei((parseInt(summary[2]) * 1000).toString(), 'ether') },
                  success: data => {
                    //console.log(data);
                  }
                });
              }
            });
          });
        }
        break;
      case "3":
        // prikaži declined samo
        $("#declineText").removeClass("hiddenButtonTable");
        
        if (this.state.type == "voter1" && !summary[6]) {
          $("#declineText").addClass("hiddenButtonTable");
            $("#yesOrNoText").removeClass("hiddenButtonTable");
            $("#yesOrNoText a.yes").attr("href", "#");
            $("#yesOrNoText a.yes").click(function() {
              //console.log("lcicked");
              
              //console.log(accounts);
              campaign.methods.vote("0x25E79cE502Bec3dC71Acdd10fae573e2aF52588C", true).send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
                if (error) {
                  console.log(error);
                } else {
                  console.log(txHash);
                  $("#yesOrNoText").addClass("hiddenButtonTable");
                  $("#inReviewText").removeClass("hiddenButtonTable");
                }
              });
            });

            $("#yesOrNoText a.no").attr("href", "#");
            $("#yesOrNoText a.no").click(function() {
              //console.log("lcicked");
              
              //console.log(accounts);
              campaign.methods.vote("0x25E79cE502Bec3dC71Acdd10fae573e2aF52588C", false).send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
                if (error) {
                  console.log(error);
                } else {
                  console.log(txHash);
                  $("#yesOrNoText").addClass("hiddenButtonTable");
                  $("#inReviewText").removeClass("hiddenButtonTable");
                }
              });
            });
        }

        if (this.state.type == "voter2" && !summary[7]) {
          $("#declineText").addClass("hiddenButtonTable");
            $("#yesOrNoText").removeClass("hiddenButtonTable");
            $("#yesOrNoText a.yes").attr("href", "#");
            $("#yesOrNoText a.yes").click(function() {
              //console.log("lcicked");
              
              //console.log(accounts);
              campaign.methods.vote("0xdbb3317aF6e9Ec8da1284D3cC79005f21eb5237d", true).send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
                if (error) {
                  console.log(error);
                } else {
                  console.log(txHash);
                  $("#yesOrNoText").addClass("hiddenButtonTable");
                  $("#inReviewText").removeClass("hiddenButtonTable");
                }
              });
            });

            $("#yesOrNoText a.no").attr("href", "#");
            $("#yesOrNoText a.no").click(function() {
              //console.log("lcicked");
              
              //console.log(accounts);
              campaign.methods.vote("0xdbb3317aF6e9Ec8da1284D3cC79005f21eb5237d", false).send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
                if (error) {
                  console.log(error);
                } else {
                  console.log(txHash);
                  $("#yesOrNoText").addClass("hiddenButtonTable");
                  $("#inReviewText").removeClass("hiddenButtonTable");
                }
              });
            });
        }

        if (this.state.type == "company" && summary[6] && summary[7]) {
          $("#declineText a").attr("href", "#");
          $("#declineText a").click(() => {
            campaign.methods.getMoneyBack().send({from: accounts[0]}, (error, txHash) => { // fallback ali promise
              if (error) {
                console.log(error);
              } else {
                console.log(txHash);
                $("#declineText a").removeAttr("href", "#");

                this.setState({revenue: this.state.revenue + parseInt(web3.utils.fromWei((parseInt(summary[2]) * 1000).toString(), 'ether'))});

                $.ajax({
                  url: "http://localhost:3000/finish",
                  type: "POST",
                  dataType: 'json',
                  data: { "status": "error", "revenue": web3.utils.fromWei((parseInt(summary[2]) * 1000).toString(), 'ether') },
                  success: data => {
                    //console.log(data);
                  }
                });
              }
            });
          });
        } 
        break;
    }

    $("#tabelica").removeClass("hiddenButtonTable");
    $("#loaderTasks").hide();
  }

  componentDidMount() {
    if (
      this.state.type != "company" &&
      this.state.type != "developer" &&
      this.state.type != "voter1" &&
      this.state.type != "voter2"
    ) {
      $("#redirect")[0].click();
    }

    $.ajax({
      url: "http://localhost:3000/getData",
      type: "POST",
      success: data => {
        //console.log(data);
        this.setState({
          name: data[this.state.type]["name"],
          revenue: parseInt(data[this.state.type]["revenue"]),
          balance: data[this.state.type]["balance"],
          contracts: data[this.state.type]["contracts"],
          skills: data[this.state.type]["skills"],
          projects: data[this.state.type]["projects"]
        });
        //console.log(this.state);
        $("#loadingSpinner").delay(5000).hide();
      }
    });

    Chart.defaults.global.legend.display = false;
    var ctx = document.getElementById("myChart1").getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [
          "09-03",
          "09-06",
          "09-09",
          "09-12",
          "09-15",
          "09-18",
          "09-21",
          "09-24",
          "09-27",
          "09-30",
          "10-02",
          "10-05",
          "10-08"
        ],
        datasets: [
          {
            label: "Ethereum value",
            borderColor: "rgb(0, 0, 0)",
            lineTension: 0,
            data: [
              222.56,
              218.12,
              221.34,
              224.56,
              227.12,
              232.12,
              230.12,
              220.56,
              226.21,
              225.67,
              217.54,
              222.56,
              228.11
            ]
          }
        ]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: true, //this will remove all the x-axis grid lines
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: true, //this will remove all the x-axis grid lines
              ticks: {
                suggestedMin: 210, // minimum will be 0, unless there is a lower value.
                suggestedMax: 235
              }
            }
          ]
        }
      }
    });

    Chart.defaults.global.legend.display = false;
    var ctx = document.getElementById("myChart2").getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [
          "09-03",
          "09-06",
          "09-09",
          "09-12",
          "09-15",
          "09-18",
          "09-21",
          "09-24",
          "09-27",
          "09-30",
          "10-02",
          "10-05",
          "10-08"
        ],
        datasets: [
          {
            label: "ECTA PAY value",
            borderColor: "rgb(0, 64, 122)",
            lineTension: 0,
            data: [
              10.9,
              11.7,
              12.3,
              11.8,
              10.55,
              10.43,
              11.12,
              12.12,
              11.8,
              13.11,
              13.7,
              13.2,
              13.7
            ]
          }
        ]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: true, //this will remove all the x-axis grid lines
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: true, //this will remove all the x-axis grid lines
              ticks: {
                suggestedMin: 10, // minimum will be 0, unless there is a lower value.
                suggestedMax: 14
              }
            }
          ]
        }
      }
    });

    Chart.defaults.global.legend.display = false;
    var ctx = document.getElementById("myChart3").getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October"
        ],
        datasets: [
          {
            label: "ECTA SKILLS",
            borderColor: "rgb(248, 182, 76)",
            lineTension: 0,
            data: [2, 3, 5, 5, 8, 9, 12, 13, 14, 17]
          }
        ]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: true, //this will remove all the x-axis grid lines
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: true, //this will remove all the x-axis grid lines
              ticks: {
                suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                suggestedMax: 15
              }
            }
          ]
        }
      }
    });
  }

  render() {
    return (
      <div>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
        <div className="loading" id="loadingSpinner">
          Loading&#8230;
        </div>
        <div className="container">
          <div className="dash__logo">
            <span className="dash__logo-span">
              <a href="/login" id="redirect">
                <img
                  src="/static/img/ecta-second-blue.png"
                  className="dash__logo-img"
                />
              </a>
            </span>
          </div>
          <div className="search">
            <input className="search__input" placeholder="Search" type="text" />
            <div className="div-wraper">
              <button className="search__button">
                <svg className="search__icon">
                  <use xlinkHref="/static/img/dashboard.svg#icon-magnifying-glass" />
                </svg>
              </button>
            </div>
          </div>

          <div className="user-nav">
            <div className="user-nav__box user-nav__box-first">
              <svg className="dash-icon dash-icon-bookmark">
                <use xlinkHref="/static/img/symbol-defs.svg#icon-bookmark" />
              </svg>
              <span className="user-nav__box-notification user-nav__box-notification--1">
                4
              </span>
            </div>
            <div className="user-nav__box user-nav__box-second">
              <svg className="dash-icon dash-icon-mail">
                <use xlinkHref="/static/img/symbol-defs.svg#icon-mail" />
              </svg>
              <span className="user-nav__box-notification">5</span>
            </div>
            <div className="user-nav__box user-nav__box-status">
              <svg className="dash-icon dash-icon-rank">
                <use xlinkHref="/static/img/ranks.svg#rank-1" />
              </svg>
              <img src="static/img/user-1.png" className="img-user" />
              <span className="user-nav__user-name">{this.state.name}</span>
            </div>
          </div>

          <div className="side-bar">
            <ul className="side-nav">
              <li
                id="afterCreateTask"
                className="side-nav__item side-nav__item--active"
                onClick={event => {
                  const activeLink = $(".side-nav__item--active");
                  const displayedDiv = $(".show");
                  const nameOfTab = activeLink[0].innerText.toLowerCase();

                  if ("dashboard" !== nameOfTab) {
                    activeLink.removeClass("side-nav__item--active");
                    displayedDiv.removeClass("show");
                    event.target.parentNode.classList.add(
                      "side-nav__item--active"
                    );
                    $(".dashboard").addClass("show");
                  } else {
                    console.log("Ta link ze ima class side-nav__item--active");
                  }
                }}
              >
                <a href="#" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-gauge" />
                  </svg>
                  <span>Dashboard</span>
                </a>
              </li>
              <li
                className="side-nav__item"
                onClick={event => {
                  const activeLink = $(".side-nav__item--active");
                  const displayedDiv = $(".show");
                  const nameOfTab = activeLink[0].innerText.toLowerCase();

                  if ("news" !== nameOfTab) {
                    activeLink.removeClass("side-nav__item--active");
                    displayedDiv.removeClass("show");
                    event.target.parentNode.classList.add(
                      "side-nav__item--active"
                    );
                    $("#news").addClass("show");
                  } else {
                    console.log("Ta link ze ima class side-nav__item--active");
                  }
                }}
              >
                <a href="#" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-globe" />
                  </svg>
                  <span>News</span>
                </a>
              </li>
              <li
                className="side-nav__item"
                onClick={event => {
                  const activeLink = $(".side-nav__item--active");
                  const displayedDiv = $(".show");
                  const nameOfTab = activeLink[0].innerText.toLowerCase();

                  if ("user-profile" !== nameOfTab) {
                    activeLink.removeClass("side-nav__item--active");
                    displayedDiv.removeClass("show");
                    event.target.parentNode.classList.add(
                      "side-nav__item--active"
                    );
                    $("#user-profile").addClass("show");
                  } else {
                    console.log("Ta link ze ima class side-nav__item--active");
                  }
                }}
              >
                <a href="#" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-user" />
                  </svg>
                  <span>User Profile</span>
                </a>
              </li>
              <li
                className="side-nav__item"
                onClick={event => {
                  const activeLink = $(".side-nav__item--active");
                  const displayedDiv = $(".show");
                  const nameOfTab = activeLink[0].innerText.toLowerCase();

                  if ("inbox" !== nameOfTab) {
                    activeLink.removeClass("side-nav__item--active");
                    displayedDiv.removeClass("show");
                    event.target.parentNode.classList.add(
                      "side-nav__item--active"
                    );
                    $("#inbox").addClass("show");
                  } else {
                    console.log("Ta link ze ima class side-nav__item--active");
                  }
                }}
              >
                <a href="#" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-archive" />
                  </svg>
                  <span>Inbox</span>
                </a>
              </li>
              <li
                style={this.state.type === "company" ? {} : { display: "none" }}
                className="side-nav__item"
                onClick={event => {
                  const activeLink = $(".side-nav__item--active");
                  const displayedDiv = $(".show");
                  const nameOfTab = activeLink[0].innerText.toLowerCase();

                  if ("tasks" !== nameOfTab) {
                    activeLink.removeClass("side-nav__item--active");
                    displayedDiv.removeClass("show");
                    event.target.parentNode.classList.add(
                      "side-nav__item--active"
                    );
                    $("#tasks").addClass("show");
                  } else {
                    console.log("Ta link ze ima class side-nav__item--active");
                  }
                }}
              >
                <a href="#" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-tasks" />
                  </svg>
                  <span>New Task</span>
                </a>
              </li>
              <li
                className="side-nav__item"
                onClick={event => {
                  this.loadDataFromSmartContract();
                  const activeLink = $(".side-nav__item--active");
                  const displayedDiv = $(".show");
                  const nameOfTab = activeLink[0].innerText.toLowerCase();

                  if ("jobs" !== nameOfTab) {
                    activeLink.removeClass("side-nav__item--active");
                    displayedDiv.removeClass("show");
                    event.target.parentNode.classList.add(
                      "side-nav__item--active"
                    );
                    $("#jobs").addClass("show");
                  } else {
                    console.log("Ta link ze ima class side-nav__item--active");
                  }
                }}
              >
                <a href="#" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-suitcase" />
                  </svg>
                  <span>Tasks</span>
                </a>
              </li>
              <li
                className="side-nav__item"
                onClick={event => {
                  const activeLink = $(".side-nav__item--active");
                  const displayedDiv = $(".show");
                  const nameOfTab = activeLink[0].innerText.toLowerCase();

                  if ("settings" !== nameOfTab) {
                    activeLink.removeClass("side-nav__item--active");
                    displayedDiv.removeClass("show");
                    event.target.parentNode.classList.add(
                      "side-nav__item--active"
                    );
                    $("#settings").addClass("show");
                  } else {
                    console.log("Ta link ze ima class side-nav__item--active");
                  }
                }}
              >
                <a href="#" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-cog" />
                  </svg>
                  <span>Settings</span>
                </a>
              </li>
              <li className="side-nav__item">
                <a href="/login" className="side-nav__link">
                  <svg className="side-nav__icon">
                    <use xlinkHref="/static/img/dashboard.svg#icon-log-out" />
                  </svg>
                  <span>Sign out</span>
                </a>
              </li>
            </ul>

            <div className="legal">
              &copy; 2018 by ECTA. All rights reserved.
            </div>
          </div>
          <div className="dashboard show">
            <div className="boxes">
              <div className="boxes__box boxes__box--balance">
                <div className="box__wraper">
                  <div className="box__content">
                    <svg className="box__content--image">
                      <use xlinkHref="/static/img/dashboard.svg#icon-database" />
                    </svg>
                    <div className="box__description">
                      <div className="box__title">Balance</div>
                      <div className="box__prize">${this.state.balance}</div>
                    </div>
                  </div>
                  <div className="box__footer">
                    <svg className="reload-icon">
                      <use xlinkHref="/static/img/dashboard.svg#icon-loop2" />
                    </svg>
                    Updated now
                  </div>
                </div>
              </div>
              <div className="boxes__box boxes__box--revenue">
                <div className="box__wraper">
                  <div className="box__content">
                    <svg className="box__content--image">
                      <use
                        xlinkHref="/static/img/dashboard.svg#icon-wallet"
                        style={{ fill: "#00407a" }}
                      />
                    </svg>
                    <div className="box__description">
                      <div className="box__title">ECTA TOKENS</div>
                      <div
                        className="box__prize"
                        style={{ justifySelf: "end" }}
                      >
                        {this.state.revenue}
                      </div>
                    </div>
                  </div>
                  <div className="box__footer">
                    <svg className="reload-icon">
                      <use xlinkHref="/static/img/dashboard.svg#icon-calendar" />
                    </svg>
                    Last day
                  </div>
                </div>
              </div>
              <div className="boxes__box boxes__box--skills">
                <div className="box__wraper">
                  <div className="box__content">
                    <svg className="box__content--image">
                      <use
                        xlinkHref="/static/img/ranks.svg#token"
                        style={{ fill: "#f8b64c" }}
                      />
                    </svg>
                    <div className="box__description">
                      <div className="box__title">ECTA SKILLS</div>
                      <div
                        className="box__prize"
                        style={{ justifySelf: "end" }}
                      >
                        {this.state.skills}
                      </div>
                    </div>
                  </div>
                  <div className="box__footer">
                    <svg className="reload-icon">
                      <use xlinkHref="/static/img/dashboard.svg#icon-clock" />
                    </svg>
                    Updated now
                  </div>
                </div>
              </div>
              <div className="boxes__box boxes__box--projects">
                <div className="box__wraper">
                  <div className="box__content">
                    <svg className="box__content--image">
                      <use
                        xlinkHref="/static/img/dashboard.svg#icon-copy"
                        style={{ fill: "#1dc7ea" }}
                      />
                    </svg>
                    <div className="box__description">
                      <div className="box__title">Projects</div>
                      <div
                        className="box__prize"
                        style={{ justifySelf: "end" }}
                      >
                        {this.state.projects}
                      </div>
                    </div>
                  </div>
                  <div className="box__footer">
                    <svg className="reload-icon">
                      <use xlinkHref="/static/img/dashboard.svg#icon-loop2" />
                    </svg>
                    Updated now
                  </div>
                </div>
              </div>
            </div>
            <div className="chart">
              <div className="chart__eth">
                <div
                  style={{ height: 28, width: 510, marginTop: 25 }}
                >
                  <img
                    src="/static/img/etherpic.png"
                    style={{
                      width: 110 + "px",
                      height: 75 + "px",
                      verticalAlign: "middle",
                      marginRight: 0
                    }}
                  />
                  <span className="text1">ETHEREUM (ETH)</span>
                  <span className="money1">$ 228.72</span>
                  <div
                    className="chart-container1"
                    style={{
                      position: "relative",
                      height: 250,
                      width: 475,
                      "margin-top": 55 + "px",
                      "margin-left": 15 + "px"
                    }}
                  >
                    <canvas id="myChart1" />
                  </div>
                </div>
              </div>
              <div className="chart__ecta-pay">
                <div
                  style={{ height: 28, width: 510, marginTop: 25 }}
                >
                  <img
                    src="/static/img/ectapaypic.png"
                    style={{
                      width: 110 + "px",
                      height: 65 + "px",
                      "vertical-align": "middle",
                      "margin-right": 0 + "px",
                      "margin-top": 10 + "px"
                    }}
                  />
                  <span className="text2">ECTA PAY</span>
                  <span className="money2">$ 12.50</span>
                  <div
                    className="chart-container2"
                    style={{
                      position: "relative",
                      height: 250,
                      width: 475,
                      "margin-top": 60 + "px",
                      "margin-left": 15 + "px"
                    }}
                  >
                    <canvas id="myChart2" />
                  </div>
                </div>
              </div>
              <div className="chart__ecta-skills">
                <div
                  style={{ height: 28, width: 510, marginTop: 25 }}
                >
                  <img
                    src="/static/img/ectaskillpic.png"
                    style={{
                      width: 80 + "px",
                      height: 65 + "px",
                      "vertical-align": "middle",
                      "margin-right": 15 + "px",
                      "margin-left": 20 + "px",
                      "margin-top": 5 + "px"
                    }}
                  />
                  <span className="text3">ECTA SKILLS</span>
                  <span className="money3">{this.state.skills}</span>
                  <div
                    className="chart-container3"
                    style={{
                      position: "relative",
                      height: 285,
                      width: 475,
                      "margin-top": 60 + "px",
                      "margin-left": 15 + "px"
                    }}
                  >
                    <canvas id="myChart3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="news">news</div>
          <div id="user-profile">user-profile</div>
          <div id="inbox">inbox</div>
          <div id="tasks">
            <div style={{ padding: 64 }}>
              <form className='ui large form'>
                <div className='inline field'>
                  <label style={{ fontSize: 18, marginRight: 134 }}>Task Name</label>
                  <div className='ui input'>
                    <input type='text' placeholder='Task Name' defaultValue="Smart Contract for ECTA Platform" style={{ width: 600 }} onChange={this.changeTaskName} />
                  </div>
                </div>
                <div className='inline field' style={{ marginTop: 32 }}>
                  <label style={{ fontSize: 18, marginRight: 80 }}>ECTA PAY tokens</label>
                  <div className='ui input'>
                    <input type='number' placeholder='Tokens' defaultValue="50" style={{ width: 100 }} onChange={this.changeNumberOfECTAPAY} />
                  </div>
                </div>
                <div className='inline field' style={{ marginTop: 32 }}>
                  <label style={{ fontSize: 18, marginRight: 140 }}>Time Limit</label>
                  <div className='ui input'>
                    <input type='number' placeholder='Days' defaultValue="20" style={{ width: 100 }} onChange={this.changeTimeLimit} />
                  </div>
                </div>
                <div className='field' style={{ marginTop: 32 }}>
                  <label style={{ fontSize: 18, marginRight: 135, marginBottom: 24 }}>Description</label>
                  <textarea placeholder='Tell us more about this task...' rows='10' style={{ "resize": '', marginTop: 8, marginBottom: 8 }} defaultValue="Small Contract written in Solidity." onChange={this.changeDescription} />
                </div>
                <div className='inline field' style={{ marginTop: 32 }}>
                  <input type="checkbox" name="checkbox" value="check" id="agree" style={{ marginBottom: 2 }} defaultChecked /><label>I have read and agree to the Terms and Conditions and Privacy Policy.</label>
                </div>
                <div className='field' style={{ marginTop: 32 }}>
                  <Button id="createButton" className='ui primary button' style={{ width: 100, height: 40 }} type="button" onClick={this.createNewTask}>
                    Create
                </Button>
                </div>
              </form>
            </div>
          </div>
          <div id="jobs" className="u-padding">
            <Segment id="loaderTasks">
              <Dimmer style={{backgroundColor: "rgba(204, 204, 204, 0.8)"}} active>
                <Loader size="massive"/>
              </Dimmer>
            </Segment>
            <Table id="tabelica" className="u-table hiddenButtonTable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Task name</Table.HeaderCell>
                  <Table.HeaderCell>ECTA tokens</Table.HeaderCell>
                  <Table.HeaderCell>Created</Table.HeaderCell>
                  <Table.HeaderCell>Time limit</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Company</Table.HeaderCell>
                  <Table.HeaderCell>Developer</Table.HeaderCell>
                  <Table.HeaderCell>Voter 1</Table.HeaderCell>
                  <Table.HeaderCell>Voter 2</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
              <Table.Row>
                  <Table.Cell >Senior Software Engineer</Table.Cell>
                  <Table.Cell >20</Table.Cell>
                  <Table.Cell >
                    05.10.2018
                  </Table.Cell>
                  <Table.Cell >
                    5 days
                  </Table.Cell>
                  <Table.Cell>
                    Senior engineer needed for a full-time, <br/>remote option position requiring troubleshooting skills.
                  </Table.Cell>
                  <Table.Cell>Andy K.</Table.Cell>
                  <Table.Cell>Sam S.</Table.Cell>
                  <Table.Cell >
                  Jack R.
                  </Table.Cell>
                  <Table.Cell>
                  Michael J.
                  </Table.Cell>
                  <Table.Cell selectable positive>
                  <a>Completed</a>
                 
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Technical SEO Manager</Table.Cell>
                  <Table.Cell>15</Table.Cell>
                  <Table.Cell >
                    07.10.2018
                  </Table.Cell>
                  <Table.Cell >
                    6 days
                  </Table.Cell>
                  <Table.Cell >
                  Seeking candidate with technical SEO expertise for position <br/> uncovering subtle siteissues, communicating technical recommendations and <br/> implementation requirements.
                  </Table.Cell>
                  <Table.Cell>Andy K.</Table.Cell>
                  <Table.Cell>Sam S.</Table.Cell>
                  <Table.Cell >
                  Jack R.
                  </Table.Cell>
                  <Table.Cell>
                  Michael J.
                  </Table.Cell>
                  <Table.Cell selectable positive>
                  <a>Completed</a>
                 
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>RESTful web applications job</Table.Cell>
                  <Table.Cell>23</Table.Cell>
                  <Table.Cell >
                    07.10.2018
                  </Table.Cell>
                  <Table.Cell >
                    30 days
                  </Table.Cell>
                  <Table.Cell >
                  Maintain program code according to project methodologies.<br/> Must have a bachelor's degree and 15 years of related work experience. 
                  </Table.Cell>
                  <Table.Cell>Andy K.</Table.Cell>
                  <Table.Cell>Sam S.</Table.Cell>
                  <Table.Cell >
                  Jack R.
                  </Table.Cell>
                  <Table.Cell>
                  Michael J.
                  </Table.Cell>
                  <Table.Cell selectable negative>
                  <a>Declined</a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Web Development Instructor job</Table.Cell>
                  <Table.Cell>15</Table.Cell>
                  <Table.Cell >
                    08.10.2018
                  </Table.Cell>
                  <Table.Cell >
                    30 days
                  </Table.Cell>
                  <Table.Cell >
                  Teach university-level courses on web development. <br/>Provide adequate student consultation and feedback.
                  </Table.Cell>
                  <Table.Cell>Andy K.</Table.Cell>
                  <Table.Cell>Sam S.</Table.Cell>
                  <Table.Cell >
                  Jack R.
                  </Table.Cell>
                  <Table.Cell>
                  Michael J.
                  </Table.Cell>
                  
                  <Table.Cell selectable positive>
                  <a>Completed</a>
                 
                  </Table.Cell>
                </Table.Row>
                
                <Table.Row style={{ height: "61px;" }}>
                  <Table.Cell id="taskNameField">Test</Table.Cell>
                  <Table.Cell id="ectaPayField">Test</Table.Cell>
                  <Table.Cell>12.10.2018</Table.Cell>
                  <Table.Cell id="timeLimitField">Test</Table.Cell>
                  <Table.Cell id="descriptionField">Test</Table.Cell>
                  <Table.Cell>Andy K.</Table.Cell>
                  <Table.Cell>Sam S.</Table.Cell>
                  <Table.Cell>Jack R.</Table.Cell>
                  <Table.Cell>Michael J.</Table.Cell>

                  <Table.Cell id="inProgressText" className="hiddenButtonTable" selectable warning>
                  <a>In progress</a>
                  </Table.Cell>
                  <Table.Cell id="inReviewText" className="a-status hiddenButtonTable">
                  <a>In review</a>
                  </Table.Cell>
                  <Table.Cell id="completedText" className="hiddenButtonTable" selectable positive >
                  <a>Completed</a>
                  </Table.Cell>
                  <Table.Cell id="declineText" className="hiddenButtonTable" selectable negative >
                  <a>Declined</a>
                  </Table.Cell>

                  <Table.Cell id="yesOrNoText" className="hiddenButtonTable cell-grid"  style={{ padding: 0 }}>
                    <div className="div-cell div-cell-yes">
                      <a className="yes">Yes</a>
                      </div>
                      <div className="div-cell div-cell-no">
                    <a className="no">No</a></div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
          <div id="settings">settings</div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
