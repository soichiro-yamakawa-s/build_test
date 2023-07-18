const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const basicAuth = require('basic-auth-connect');
const request = require('request');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
})
const handle = app.getRequestHandler();
const port = '4000'

app.prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.urlencoded({
      extended: true
    }));
    server.use(bodyParser.json());

    /************************basic認証***************************/
    server.all('/*', basicAuth(function(username, password, fn) {
      request.post({
        url: `http://11.255.97.43/home/dev44auth/bondweb/controller/auth.do`,
        proxy: "",
        charset: 'UTF-8',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        }
      }, function (err, response, bodydata) {
        if (response && response.statusCode == '401') {
          fn(true, username)
        } else {
          fn(false, username)
        }
      });
    }));

    server.get('/home/member/*', proxy('11.255.97.33'));

    server.get('*', (req, res) => {
      return handle(req, res);
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`);
    })
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  })