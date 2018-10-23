const express = require("express");
const next = require("next");
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    const showRoutes = require("./routes/index.js");

    var bodyParser = require('body-parser');
    server.use(bodyParser.json()); // support json encoded bodies
    server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    server.use("/api", showRoutes);
    server.get("/api/shows", (req, res) => {
      return res.end("we made it!");
    });
    server.get("*", (req, res) => {
      return handle(req, res);
    });
    /*server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query = {} } = parsedUrl;
      const route = routes[pathname];
      if (route) {
        return app.render(req, res, route.page, query);
      }
      return handle(req, res);
    });*/



    //NE SPREMINJAJ TEGA !!!
    server.post('/getData', (req, res) => {
      var obj;
      fs.readFile('./back-end/users.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        res.send(obj);
        res.end();
      });
    });

    server.post('/createContract', (req, res) => {
      let add = req.body.address;
      let compNewRevenu = req.body.revenue;

      var obj;
      fs.readFile('./back-end/users.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        obj.company.contracts.push(add);
        obj.company.projects++;
        obj.company.revenue = compNewRevenu;
        obj.developer.contracts.push(add);
        obj.developer.projects++;
        obj.voter1.contracts.push(add);
        obj.voter1.projects++;
        obj.voter2.contracts.push(add);
        obj.voter2.projects++;

        fs.writeFile("./back-end/users.json", JSON.stringify(obj), err => {
          if (err) return console.log(err);
          //console.log(JSON.stringify(obj));
          //console.log('writing to ' + "./back-end/users.json");

          res.send({ "succes": "yes" });
          res.end();
        });
      });
    });

    server.post('/finish', (req, res) => {
      // noter moramo dati revenue, spremenljivko ki pove če je bilo uspešno ali zavrnjeno, developer dobi 25 skill tokenov, voterja pa po vsak 3
      let prize = parseInt(req.body.revenue);
      let status = req.body.status;
      
      var obj;
      fs.readFile('./back-end/users.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        obj.voter1.skills = parseInt(obj.voter1.skills) + 3;
        obj.voter2.skills = parseInt(obj.voter2.skills) + 3;

        if (status === "success") {
          obj.developer.skills = parseInt(obj.developer.skills) + 25;
          obj.developer.revenue = parseInt(obj.developer.revenue) + prize;
        } else {
          obj.developer.skills = parseInt(obj.developer.skills) - 5;
          obj.company.revenue = parseInt(obj.company.revenue) + prize;
        }

        fs.writeFile("./back-end/users.json", JSON.stringify(obj), err => {
          if (err) return console.log(err);
          //console.log(JSON.stringify(obj));
          //console.log('writing to ' + "./back-end/users.json");

          res.send({ "succes": "yes" });
          res.end();
        });
      });
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
