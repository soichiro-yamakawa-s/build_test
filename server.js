const express = require("express")
const next = require('next')
const bodyParser = require('body-parser')
const request = require('request')
const { parse } = require('url')
const basicAuth = require('basic-auth-connect');

const dev = process.env.NODE_ENV !== 'production'
const port = 3000

const app = next({ dev })
const handle = app.getRequestHandler()

const fs = require('fs');

let stocksData;

app
    .prepare()
    .then(() => {
        const server = express();
        server.use(bodyParser.urlencoded({extended: true}))

        server.all('/*', basicAuth(function(username, password, fn) {
            request.post({
              url: `http://11.255.97.43/home/dev07auth/bondweb/controller/auth.do`,
              proxy: "",
              charset: 'UTF-8',
              headers: {
                'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
              }
            }, function (err, response, bodydata) {
              if (response.statusCode == '401') {
                fn(true, username)
              } else {
                fn(false, username)
              }
            });
          }));


        server.all('/api/dividendsRead.do', async(req, res) => {
            try {
                request.post({
                    url: `http://11.255.97.33/home/dev07auth/qrlab/dividends/api/dividendsRead.do`,
                    proxy: "",
                    charset: 'UTF-8',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': req.header('Authorization')
                    },
                    form: {
                        F: req.query.F
                    }
                }, function (err, response, bodydata) {
                    res.json(JSON.parse(bodydata))
                })
            } catch(err) {
                console.log(err)
                throw err
            } 
        })

        server.get('*', (req, res) => {
            return handle(req, res)
        })


        server.listen(port, (err) => {
            if (err) {
                throw err;
            }
            console.log(`> Ready on http://localhost:${port}`)
        })
    }).catch(e => {
        console.log(e)
        process.exit(1)
    })
