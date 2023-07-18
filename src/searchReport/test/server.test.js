const fetch = require('isomorphic-unfetch');

async function viaServlet() {
    const jsonText = JSON.stringify({
        "URL": "/home/member/TF/astram/root/astget.cgi?ACT=301&MODE=0,1,2,3,4&VJCODE=NN,RR,KK",
        "ACT": "301",
        "provider": "ＱＵＩＣＫ,ＱＵＩＣＫ,ＱＵＩＣＫ"
    });
    const res = await fetch('http://localhost:4000/report/init/', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic UUlLQTEwMDU0ODpRSUtBMTAwNTQ4',
            "Content-Type": "application/json"
        },
        body: jsonText
    })
    const json = await res.json()
    console.log(json);
}

async function direct() {
    const url = `http://11.255.97.33/home/member/TF/astram/root/astget.cgi?ACT=301&MODE=0,1,2,3,4&VJCODE=NN,RR,KK&CO=&CO=${encodeURIComponent('ＱＵＩＣＫＱＵＩＣＫＱＵＩＣＫ')}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic UUlLQTEwMDU0ODpRSUtBMTAwNTQ4',
        }
    })
    const json = await res.text()
    console.log(json);
}

viaServlet();
// direct();