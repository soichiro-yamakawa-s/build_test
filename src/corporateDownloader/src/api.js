import { GridColumns } from './GridColumns';
// ユニバース1回のRequest取得データ量
const COUNT = 3000;

// 4桁銘柄コードをDB用検索コードに変更するRequest用json
const GET_CODE_JSON = {
    "AB0001": {
        "D": "CodeConversion",
        "ADF": false,
        "Q": [
            {
                "BQC": "",
                "BCK": "B",
                "ACK": [
                    "C1"
                ]
            }
        ]
    }
}

// データRequest用json
const QUERY_JSON = {
    "AB0001": {
        "D": "DBExtension",
        "OCF": false,
        "ECI": {
            "DEF": "0",
            "DCI": "00",
            "ICI": "00"
        },
        "KEY": [
            {
                "KYA": "41",
                "PRK": [
                    "N0001353"
                ]
            }
        ],
        "TRM": {
            "RNG": "2",
            "STP": "20210101",
            "ENP": "20220606",
            "RQN": "0"
        },
        "NMB": {
            "RQN": "10000",
            "STP": "0",
            "MRT": "0"
        },
        "EXP": {
            "EFF": false,
            "UDT": true
        }
    }
}

// 役員詳細Request用json
const OFFICER_DETAILS = [
    {
        "TBN": "NKCPOTL",
        "ACM": "TS",
        "KYJ": false,
        "SCK": [
            "D004",
            "%%*",
            "%%*",
            "%%*",
            "%%*",
            "%%*"
        ],
        "ELC": [
            "D004D02",
            "D004D06",
            "D004D08",
            "D004D09",
            "D004D24",
            "D004D39",
            "D004D41",
            "D004D43",
            "D004D44",
            "D004D45",
            "D004D46",
            "D004D47",
            "D004D48",
            "D004D49",
            "D004D50",
            "D004D63",
            "D004D64",
            "D004D65",
            "D004D67",
            "D004D68",
            "D004D70",
            "D004D71",
            "D004D72",
            "D004D73",
            "D004D74",
            "D004D75",
            "D004D76",
            "D004D77",
            "D004D78",
            "D004D51"
        ]
    }
]

// 役員報酬Request用json
const OFFICER_COMPENSATION = 
[
    {
        "TBN": "NKCPOTL",
        "ACM": "TS",
        "KYJ": false,
        "SCK": [
            "D072",
            "%%*",
            "%%*",
            "%%*",
            "%%*",
            "%%*"
        ],
        "ELC": [
            "D072D02",
            "D072D06",
            "D072D08",
            "D072D09",
            "D072D24",
            "D072D39",
            "D072D41",
            "D072D43",
            "D072D44",
            "D072D45",
            "D072D46",
            "D072D47",
            "D072D48",
            "D072D49",
            "D072D50",
            "D072D51",
            "D072D52"
        ]
    }
]

// 関係会社の状況Request用json
const AFFILIATED_COMPANIES = 
[
    {
        "TBN": "NKCPOTL",
        "ACM": "TS",
        "KYJ": false,
        "SCK": [
            "B050",
            "%%*",
            "%%*",
            "%%*",
            "%%*",
            "%%*"
        ],
        "ELC": [
            "B050D02",
            "B050D06",
            "B050D08",
            "B050D09",
            "B050D24",
            "B050D39",
            "B050D40",
            "B050D41",
            "B050D42",
            "B050D43",
            "B050D46",
            "B050D48",
            "B050D49",
            "B050D51",
            "B050D52",
            "B050D56",
            "B050D57",
            "B050D58",
            "B050D59",
            "B050D60"
        ]
    }
]

// 公認会計士の監査意見Request用json
const AUDIT_OPINION = 
[
    {
        "TBN": "NKCPOTL",
        "ACM": "TS",
        "KYJ": false,
        "SCK": [
            "B036",
            "%%*",
            "%%*",
            "%%*",
            "%%*",
            "%%*"
        ],
        "ELC": [
            "B036D02",
            "B036D06",
            "B036D08",
            "B036D09",
            "B036D24",
            "B036D39",
            "B036D40",
            "B036D41",
            "B036D42",
            "B036D45",
            "B036D47",
            "B036D49",
            "B036D51",
            "B036D53",
            "B036D43",
            "B036D44"
        ]
    }
]

// サジェストrequest用json
const CODE_NAME_REQ={
    "200000":{
        "D":"MultiDataList",
        "PDC":"QR1",
        "OCF":true,
        "SPM":{
                "SN":"ReqLstSgt",
                "KW":"",
                "LM":"50",
                "QCS":["1"],
                "SHC":"QIKA",
                "SOT":"1",
            }
        }
}

// ユニバースRequest用json
const NEW = {
    "AB0001": {
        "D": "DBExtension",
        "OCF": true,
        "ECI": {
            "DEF": "0",
            "DCI": "00",
            "ICI": "00"
        },
        "KEY": [
            {
                "KYA": "41",
                "PRK": [
                    "%%*"
                ]
            }
        ],
        "TBL": [
            {
                "TBN": "NKCPOTL",
                "ACM": "TS",
                "KYJ": false,
                "SCK": [
                    "B050","%%*","%%*","%%*","%%*","%%*"
                ],
                "ELC": [
                    "K000","K01","K02","K03","K04","K05","K06","K07","K08","K01","K02","K03","K04","K05","K06","K07","K08","B050D02","B050D06","B050D08","B050D09","B050D14","B050D15","B050D24","B050D39","B050D40","B050D41","B050D42","B050D43","B050D46","B050D48","B050D49","B050D51","B050D52","B050D53","B050D54","B050D55","B050D56","B050D57","B050D58","B050D59","B050D60"
                ]
            }
        ],
        "TRM": {
            "RNG": "1",
            "STP": "00000000",
            "ENP": "00000000",
            "RQN": "1"
        },
        "NMB": {
            "RQN": `${COUNT}`,
            "STP": "0",
            "MRT": "0"
        },
        "SER": {
            "SRO": "0",
            "SRC": "0",
            "SGO": "A1",
            "SCG": {
                "A1": {
                    "SCO": "KEY",
                    "SEK": "ALL",
                    "SCN": {
                        "A1": {
                            "SLC": "TBL",
                            "CMC": " ",
                            "CMV": "UNVSTKNK"
                        },
                        "B1": {
                            "SLC": "ACS",
                            "CMC": " ",
                            "CMV": "CS"
                        },
                        "C1": {
                            "SLC": "KEY",
                            "CMC": " ",
                            "CMV": "%%*"
                        },
                        "D1": {
                            "SLC": "DATE",
                            "CMC": " ",
                            "CMV": "%%+||DESC1"
                        },
                        "E1": {
                            "SLC": "S1KEY",
                            "CMC": " ",
                            "CMV": "B10001"
                        }
                    }
                }
            }
        },
        "EXP": {
            "EFF": false,
            "UDT": true
        }
    }
}

/**
 * 4桁銘柄コードをDB用検索コードに変更する
 * @param {*} code 銘柄コード
 * @returns 
 */
export const fetchAPICommon = async (code) => {
    GET_CODE_JSON.AB0001.Q[0].BQC = code
    const result = []
    // 実装者環境とラウンド環境用API
    const getdata = await getRequest("./api/data.do", "POST", GET_CODE_JSON)
    // local環境用API
    // const getdata = await getRequest("/common/QRDSP_free.do", "POST", GET_CODE_JSON)
    result.push(getdata.D.B.AB0001.Q[0].ATQ[0].AQC)
    return result;
};
/**
 * 会社情報データ取得
 * @param {*} inputCode 銘柄コード
 * @param {*} from From
 * @param {*} to To
 * @param {*} type 項目選択
 * @returns 
 */
export const fetchAPICompany = async (inputCode, from, to, type) => {
    const code = await fetchAPICommon(inputCode);
    QUERY_JSON.AB0001.KEY[0].PRK = code
    QUERY_JSON.AB0001.TRM.STP = from
    QUERY_JSON.AB0001.TRM.ENP = to
    switch (type) {
        case '1':
            QUERY_JSON.AB0001.TBL = OFFICER_DETAILS
            break;
        case '2':
            QUERY_JSON.AB0001.TBL = OFFICER_COMPENSATION
            break;
        case '3':
            QUERY_JSON.AB0001.TBL = AFFILIATED_COMPANIES
            break;
        case '4':
            QUERY_JSON.AB0001.TBL = AUDIT_OPINION
            break;
        default:
            break;
    }

    const result = []
    const dataList = []
    // 実装者環境とラウンド環境用API
    const data = await getRequest("./api/data.do", "POST", QUERY_JSON)
    // local環境用API
    // const data = await getRequest("/common/QRDSP_free.do", "POST", QUERY_JSON)
    if (data.D.B.AB0001.TBI && data.D.B.AB0001.TBI[0].DTA) {
        data.D.B.AB0001.TBI[0].DTA.map(item => result.push(item.E)) 
    }
    //年齢計算
    // if (type === 1) {
    //     result.map(item => item.splice(17, 0, {ELD: Number(item[0].ELD.split("/")[0]) - Number(item[16].ELD.split("/")[0])} ))
    // }
    if (type === "4") {
        // 公認会計士の監査意見の初期ソート(仕様調整40番目)
        result.sort((a, b) => a[0].ELD.localeCompare(b[0].ELD))
    }
    const title = GridColumns.parent[type].member;
    for (let index_data = 0; index_data < result.length; index_data++) {
        const Obj = {}
        const item = []
        for (let index_obj = 0; index_obj < title.length; index_obj++) {
          Obj[title[index_obj]] = formatData(title[index_obj], result[index_data][index_obj].ELD);
          item.push(result[index_data][index_obj].ELD);
        }
        dataList.push(Obj)
      }
    return dataList;
};

/**
 * サジェストデータを取得
 * @param {*} param 入力内容
 * @returns 
 */
export const fetchAPICodeName = async (param) => {
    if (param === "") return []
    const result = []
    CODE_NAME_REQ[200000].SPM.KW = param
    // 実装者環境とラウンド環境用API
    const data = await getRequest("./api/data.do", "POST", CODE_NAME_REQ)
    // local環境用API
    // const data = await getRequest("/common/QRDSP_free.do", "POST", CODE_NAME_REQ) 
    if (data.D.B["200000"].SRD) {
        // data.D.B["200000"].SRD.SG.sort((a, b) => a.QCD - b.QCD)
        data.D.B["200000"].SRD.SG.map(item => result.push({id: item.QCD, name: item.DTN, label: `${item.QCD}　　　${item.DTN}`}))
    }
    return result
}

/**
 * ユニバースデータを取得
 * @returns 
 */
export const fetchAPIUniverse = async () => {
    const res = []
    const resList =[]
    NEW.AB0001.NMB.STP = "0";
    var nextTime = true;
    while (nextTime) {
        // 実装者環境とラウンド環境用API
        // const result = await getRequest("./api/data.do", "POST", NEW)
        // local環境用API
        const result = await getRequest("/common/QRDSP_free.do", "POST", NEW)
        if (result.D.B.AB0001.TBI[0].DTA) {
            res.push.apply(res, result.D.B.AB0001.TBI[0].DTA);
            NEW.AB0001.NMB.STP = (Number(NEW.AB0001.NMB.STP) + COUNT).toString();
        } else {
            nextTime = false
        }
    }
    res.map(item => resList.push(item.E))
    return resList
}

/**
 * 汎用Request
 * @param {*} url 
 * @param {*} method 
 * @param {*} param 
 * @returns 
 */
async function getRequest(url, method, param) {
    const newRequest = new Request(url, {
        method: method,
        body: `P=${encodeURIComponent(JSON.stringify(param))}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
    })
    const result = await fetch(newRequest);
    return result.json();
}

/**
 * フラグ項目の日本語化
 * @param {*} key 列のキー
 * @param {*} value 変更前のデータ
 * @returns 
 */
function formatData(key, value) {
    if (!key || !value) {
        return ""
    } else {
        return dataToJapanese(key, value)
    }
}

/**
 * フラグ項目の日本語化ルール
 * @param {*} key1 列のキー
 * @param {*} key2 変更前のデータ
 * @returns 
 */
function dataToJapanese (key1, key2) {
    const obj = {
        109: {
            "1": "単独",
            "2": "連結"
        },
        143: {
            "1": "有",
            "0": "無"
        },
        144: {
            "1": "社外役員",
            "0": ""
        },
        145: {
            "1": "取締役",
            "2": "監査役、常勤監査役",
            "3": "補欠監査役",
            "0": "",
        },
        146: {
            "1": "執行役員",
            "0": ""
        },
        147: {
            "1": "代表執行役",
            "2": "執行役",
            "0": "",
        },
        148: {
            "1": "指名委員会に所属 ",
            "0": ""
        },
        149: {
            "1": "監査委員会に所属 ",
            "0": ""
        },
        150: {
            "1": "報酬委員会に所属 ",
            "0": ""
        },
        151: {
            "1": "監査等委員会への所属 ",
            "0": ""
        },
        178: {
            "01": "株",
            "04": "千株",
            "99": "その他",
            "00": "",
        },
        341: {
            "1": "親会社",
            "2": "子会社",
            "3": "関連会社",
            "4": "その他関連会社",
            "0": "",
        },
        348: {
            "1": "有報提出 ",
            "0": ""
        },
        439: {
            "1": "有",
            "0": "無"
        },
        440: {
            "1": "適正（無限定）",
            "2": "適正（追記有）",
            "3": "適正（限定付）",
            "4": "不適正",
            "5": "意見不表明",
            "0": "",
        }
    }
    if (obj[key1]) {
        return obj[key1][key2]
    } else {
        return key2
    } 
}
