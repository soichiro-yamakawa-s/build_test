const express = require("express")
const next = require('next')
const bodyParser = require('body-parser')
const request = require('request')
// const { parse } = require('url')
const basicAuth = require('basic-auth-connect');

const dev = process.env.NODE_ENV !== 'production'
const port = 3000

const app = next({ dev })
const handle = app.getRequestHandler()

const fs = require("fs")

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

        // ラウンド+本番用 /home/member/qrlab/supplyChainView/api/supplyChainData.do
        // 実装者環境　/home/dev44auth/bondweb/api/getData.do
        server.all('/api/supplyChainData.do', async(req, res) => {
            try {
                // let content = fs.readFileSync(`./newtestC.txt`, 'utf8');
                request.post({
                    url: `http://11.255.97.33/home/dev07auth/qrlab/supplyChainView/api/supplyChainData.do`,
                    proxy: "",
                    charset: 'UTF-8',
                    headers: {
                        'Authorization': req.header('Authorization')
                    },
                    form: {
                        SC: req.query.SC,
                        code: req.query.code,
                        entity: req.query.entity,
                        rbics: req.query.rbics,
                        country: req.query.country,
                        num1: req.query.num1,
                        num2: req.query.num2    
                    }
                }, function (err, response, bodydata) {
                    res.json(JSON.parse(bodydata))
                })

                // res.json(JSON.parse(content))
            } catch(err) {
                console.log(err)
                throw err
            } 
        })

        server.all('/api/companyInfo.do', async(req, res) => {
            try {
                request.post({
                    url: `http://11.255.97.33/home/dev07auth/qrlab/supplyChainView/api/companyInfo.do`,
                    proxy: "",
                    charset: 'UTF-8',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': req.header('Authorization')
                    },
                    form: {
                        code: req.query.code
                    }
                }, function (err, response, bodydata) {
                    res.json(JSON.parse(bodydata))
                })
            } catch(err) {
                console.log(err)
                throw err
            } 
        })

        server.all('/api/revenue.do', async(req, res) => {
            try {
                request.post({
                    url: `http://11.255.97.33/home/dev07auth/qrlab/supplyChainView/api/revenue.do`,
                    proxy: "",
                    charset: 'UTF-8',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': req.header('Authorization')
                    },
                    form: {
                        code: req.query.code
                    }
                }, function (err, response, bodydata) {
                    res.json(JSON.parse(bodydata))
                })
            } catch(err) {
                console.log(err)
                throw err
            } 
        })

        server.all('/api/employees.do', async(req, res) => {
            try {
                request.post({
                    url: `http://11.255.97.33/home/dev07auth/qrlab/supplyChainView/api/employees.do`,
                    proxy: "",
                    charset: 'UTF-8',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': req.header('Authorization')
                    },
                    form: {
                        code: req.query.code
                    }
                }, function (err, response, bodydata) {
                    res.json(JSON.parse(bodydata))
                })
            } catch(err) {
                console.log(err)
                throw err
            } 
        })

        server.all('/api/countryList.do', async(req, res) => {
            try {
                request.post({
                    url: `http://11.255.97.33/home/dev07auth/qrlab/supplyChainView/api/countryList.do`,
                    proxy: "",
                    charset: 'UTF-8',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': req.header('Authorization')
                    }
                }, function (err, response, bodydata) {
                    res.json(JSON.parse(bodydata))
                })
            } catch(err) {
                console.log(err)
                throw err
            } 
        })

        server.all('/api/rbicsList.do', async(req, res) => {
            try {
                request.post({
                    url: `http://11.255.97.33/home/dev07auth/qrlab/supplyChainView/api/rbicsList.do`,
                    proxy: "",
                    charset: 'UTF-8',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': req.header('Authorization')
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
