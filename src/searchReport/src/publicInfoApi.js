const csv = require('csvtojson');
const parser = require('fast-xml-parser');
const textEncoding = require('text-encoding'); 
const encoding = require('encoding-japanese');

const TYPE3 = `&CKND=3&ALLCHK=0-3&ALLCHK=1-3&ALLCHK=2-3&ALLCHK=3-3`;
const BASEURL = `/home/member/TF/astram/root/`;
const TextDecoder = textEncoding.TextDecoder;

function formatDate(dateString) {
  // 日付の形式 'yyyy/MM/dd HH:mm'
  return dateString.slice(0, 4) + '/'
  + dateString.slice(4, 6) + '/'
  + dateString.slice(6, 8) + ' '
  + dateString.slice(8, 10) + ':'
  + dateString.slice(10, 12);
}

function extractParams(line, num1, num2, mode, type) {
  let dt = line.split(',');
  if (mode === 0) {
    let item = {};
    const regex = /ASTKEY.+/g;
    const keyString = dt[0].match(regex);
    if (keyString) {
      item['astKey'] = keyString[0];
      return item;
    } else return false;
  } else {
    if (type && dt[0] != type)
      return false;
    let item = {};
    item["id"] = dt[num1];
    item["label"] = dt[num2];
    item["checked"] = false;
    item["mode"] = mode;
    return item;
  }
}

function convertFetchURL(json) {
  const ASTKEY = json.astKey;
  let customURL = BASEURL + 'astget.cgi?ACT=302&REC_CNT=100&' + ASTKEY;
  let param = {
    lang: json.lang,
    kikan: json.kikan,
    term: json.term,
    startDate: json.startDate,
    endDate: json.endDate,
    rangeType: json.rangeType,
    jno: json.jno,
    industory: json.industory,
    currentLastExactData: json.currentLastExactData,
    currentNewsIDList: json.currentNewsIDList,
    brand: json.brand,
    keyword: json.keyword
  }
  customURL += TYPE3;
  if (param.currentLastExactData.length > 0) {
    customURL += "&LAST_EXACT_DATA=" + param.currentLastExactData
  }
  if (param.currentNewsIDList.length > 0) {
    customURL += "&NEWSID_LIST=" + param.currentNewsIDList
  }
  if (param.jno.length > 0) {
    param.jno.forEach(elements => {
      let element = elements.split(' ');
      element.forEach(ele => {
        customURL += "&JNO=3-" + ele
      })
    });
  }
  if (param.industory.length > 0) {
    param.industory.forEach(element => {
      customURL += "&GYOSYU=" + element;
    });
  }
  if (param.rangeType === 1) {
    if (param.kikan === 1) {
      customURL += "&KIKAN_TYPE=1&KIKAN_CODE=";
    } else {
      customURL += "&KIKAN_TYPE2=1&KIKAN_CODE2=";
    }
    customURL += param.term;
  } else {
    if (param.kikan === 1) {
      customURL += "&KIKAN_TYPE=2";
      customURL += "&FYY=" + param.startDate[0];
      customURL += "&FMM=" + param.startDate[1];
      customURL += "&FDD=" + param.startDate[2];
      customURL += "&FHH=0&FMI=0"
      customURL += "&TYY=" + param.endDate[0];
      customURL += "&TMM=" + param.endDate[1];
      customURL += "&TDD=" + param.endDate[2];
      customURL += "&THH=23&TMI=59"
    } else {
      customURL += "&KIKAN_TYPE2=2";
      customURL += "&FYY2=" + param.startDate[0];
      customURL += "&FMM2=" + param.startDate[1];
      customURL += "&FDD2=" + param.startDate[2];
      customURL += "&FHH2=0&FMI2=0"
      customURL += "&TYY2=" + param.endDate[0];
      customURL += "&TMM2=" + param.endDate[1];
      customURL += "&TDD2=" + param.endDate[2];
      customURL += "&THH2=23&TMI2=59"
    }
  }
  
  if (param.lang === 0) {
    customURL += "&EJ=" + param.lang;
  } else if (param.lang === 1) {
    customURL += "&EJ=" + param.lang;
  }
  if(param.keyword){
    const sjisArray = encoding.convert(decodeURIComponent(param.keyword), {
      to: 'SJIS', 
      from: 'UNICODE'
    });
    customURL += "&SYNONYM=OFF&KEYWORD=" + encoding.urlEncode(sjisArray);
  }
  if(param.brand){
    customURL += "&MEIGARA=" + param.brand;
  }
  return customURL;
}

function extractInit(bodydata) {
  let lines = bodydata.split('\n');
  let mode;
  let digit;
  let num1, num2;
  let newDict = {};
  for (let line of lines) {
    line = line.trim();
    if (!line)
      continue;
    if (line == '#MODE=0') {
      mode = 0;
      continue;
    }
    if (line == '#MODE=2') {
      mode = 2, num1 = 2, num2 = 3, digit = "3";
      continue;
    }
    if (line == '#MODE=4') {
      mode = 4, num1 = 0, num2 = 1, digit = null;
      continue;
    }

    let item = extractParams(line, num1, num2, mode, digit);

    if (!item)
      continue;
    if (!newDict[mode]) {
      newDict[mode] = [];
      newDict[mode].push(item);
    } else {
      newDict[mode].push(item);
    }
  }
  return newDict;
}

async function convertRecords(bodydata) {
  let nextData, lastExactData, newsIDList;
  let result = await csv({
      noheader: true,
      output: "csv"
    })
    .fromString(bodydata)
    .then((lines) => {
      let dict = [];
      if (lines[0][0] === 'ERROR') return [];
      let info = lines.slice(0, 2);
      lines = lines.slice(2, lines.length);
      for (let line of lines) {
        let item = {};
        item["date"] = formatDate(line[1]);
        item["pubDate"] = formatDate(line[6]);
        item["title"] = line[2];
        item["news"] = line[10];
        item["pdf"] = line[11];
        item["more"] = false;
        item["height"] = 70;
        item["load"] = null;
        dict.push(item);
      }
      nextData = info[0][2];
      lastExactData = info[0][3];
      newsIDList = info[1][0];
      return dict;
    })
    return {
      "responseRecords": result,
      "nextData": nextData,
      "lastExactData": lastExactData,
      "newsIDList": newsIDList
    };
}

function extractNews(str) {
  let lines = str.split("\n");
  let flag = false;
  let container = [];
  for (let line of lines) {
    const regex1 = /<NewsContents FontNumber="0">.*/g;
    const regex2 = /<\/NewsContents.*/g;
    if (regex1.test(line)) {
      flag = true;
      continue;
    }
    if (regex2.test(line)) break;
    if (flag) {
      if (line.trim()) {
        container.push(line);
      }
    }
  }
  let dict = {};
  const summary = container
    .join("\r\n")
    .slice(0, -4);

  const title = container.slice(0, container.length - 1).join(" ");
  const content = container.slice(container.length - 1, container.length).toString().slice(0, -4);

  dict["title"] = title;
  dict["content"] = content;
  dict["summary"] = summary;
  return dict;
}

const Api = {
  fetchParams: async (co) => {
    try {
      const URL = BASEURL + 'astget.cgi?ACT=301&MODE=0,2,4&VJCODE=KK&CO=' + co;
      const response = await fetch(URL);
      if (!response.ok) {
        return {"astKey": null, "settings": {}}
      }
      const res = await response.arrayBuffer()
      const td = new TextDecoder("Shift_JIS")
      const responseJSON = extractInit(td.decode(res));
      const astKey = responseJSON[0][0].astKey;
      delete responseJSON[0];
      return {"astKey": astKey, "settings": responseJSON};
    } catch {
      return {"astKey": null, "settings": {}}
    }
  },

  fetchRecords: async (json, keyword, brand) => {
    try {
      const URL = convertFetchURL(json);
      const response = await fetch(URL);
      if (!response.ok) {
        return {
          "responseRecords": null,
          "nextData": null,
          "lastExactData": null,
          "newsIDList": null
        }
      }
      const res = await response.arrayBuffer()
      const td = new TextDecoder("Shift_JIS")
      const {responseRecords, nextData, lastExactData, newsIDList} = await convertRecords(td.decode(res));
      return {
        "responseRecords": responseRecords,
        "nextData": nextData,
        "lastExactData": lastExactData,
        "newsIDList": newsIDList
      }
    } catch {
      return {
        "responseRecords": null,
        "nextData": null,
        "lastExactData": null,
        "newsIDList": null
      }
    }
  },

  fetchDetails: async (url, astkey) => {
    const URL = BASEURL + url + '&' + astkey;
    const response = await fetch(URL);
    const res = await response.arrayBuffer()
	  const td = new TextDecoder("Shift_JIS")
    const detailRecord = extractNews(td.decode(res));
    return detailRecord;
  },
  
}

export default Api;