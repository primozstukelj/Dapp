import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="icon" type="image/png" href="/static/img/icon.png" />
          <title>ECTA Platform</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <link rel="stylesheet" href="/_next/static/style.css" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js" />
          <style jsx global>{`
        .text1 {
          font-weight: 800;
          font-size: 140%;
          font-family: Tahoma, Geneva, sans-serif;
          line-height: 75px;
      }

      hideNotCompany { display: none; } 

      button { cursor:pointer; }

      .money1 {
          font-weight: 800;
          font-size: 200%;
          font-family: Tahoma, Geneva, sans-serif;
      }

      .money1 {
          float: right;
          margin: 20px
      }

      .text2 {
        font-weight: 800;
        font-size: 140%;
        color: #00407a;
        font-family: Tahoma, Geneva, sans-serif;
        line-height: 65px;
    }

    .money2 {
        font-weight: 800;
        font-size: 200%;
        color: #00407a;
        font-family: Tahoma, Geneva, sans-serif;
    }

    .money2 {
        float: right;
        margin: 20px
    }

    .text3 {
      font-weight: 600;
      font-size: 140%;
      color: #f8b64c;
      font-family: Tahoma, Geneva, sans-serif;
      line-height: 65px;
  }

  .money3 {
      font-weight: 800;
      font-size: 200%;
      color: #f8b64c;
      font-family: Tahoma, Geneva, sans-serif;
  }

  .money3 {
      float: right;
      margin: 20px
  }

  /* Absolute Center Spinner */
.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

/* Transparent Overlay */
.loading:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
    background: radial-gradient(rgba(235, 231, 231, 1), rgba(235, 231, 231, 1));

  background: -webkit-radial-gradient(rgba(235, 231, 231, 1), rgba(235, 231, 231, 1));
}

/* :not(:required) hides these rules from IE9 and below */
.loading:not(:required) {
  /* hide "loading..." text */
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.loading:not(:required):after {
  content: '';
  display: block;
  font-size: 20px;
  width: 1em;
  height: 1em;
  margin-top: -0.5em;
  -webkit-animation: spinner 1500ms infinite linear;
  -moz-animation: spinner 1500ms infinite linear;
  -ms-animation: spinner 1500ms infinite linear;
  -o-animation: spinner 1500ms infinite linear;
  animation: spinner 1500ms infinite linear;
  border-radius: 0.5em;
  -webkit-box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;
box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;
}

/* Animation */

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-o-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.hiddenButtonTable {
  display:none !important;
  visibility: hidden;
}
  
      `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
