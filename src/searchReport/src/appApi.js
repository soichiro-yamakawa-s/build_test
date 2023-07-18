const parser = require('fast-xml-parser');
const encoding = require('encoding-japanese');
const textEncoding = require('text-encoding'); 

const Api = {
  fetchTicket: async () => {
    const URL = '/home/member/auth/fcgi-bin/ticket.cgi?OPTIONCODE=512&SERVICE=DT&TICKET=3';
    try {
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        return {
          tabsInfo: {
            1: false,
            2: false
          },
          userId: null
        }
      }
      const responseBody = await response.text();
      const newsContent = await parser.parse(responseBody);
      return {
        tabsInfo: {
          1: newsContent.SERVICETICKETVIEW.FUNCOP.FUNC.indexOf('AM_ANALYSTREPO') >= 0,
          2: true
        },
        userId: newsContent.SERVICETICKETVIEW.USERID
      }
    } catch (error) {
      console.log(error);
      return {
        tabsInfo: {
          1: false,
          2: false
        },
        userId: null
      }
    }
  },
  fetchCo: async (userId) => {
    try {
      const response = await fetch('/home/member/TF/astram/root/QSearch.exe?F=atesaki/section&ID=' + userId);
      if (!response.ok) {
        return;
      }
      const res = await response.arrayBuffer()
      const TextDecoder = textEncoding.TextDecoder;
      const responseBody = new TextDecoder("Shift_JIS").decode(res)
      const bodydata = responseBody.split("\t").join(",")
      const sjisArray = encoding.convert(bodydata, {
          to: 'SJIS',
          from: 'UNICODE'
        });
      return encoding.urlEncode(sjisArray);
    } catch (error) {
      console.log(error);
    }
  }
}

export default Api;