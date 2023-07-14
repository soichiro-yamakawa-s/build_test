// フィルタパラメータ設定
const customFilterParams = {
  // containsのみで表示
  filterOptions: ['contains'],
  // AND OR 非表示
  suppressAndOrCondition: 'true',

}

// grid Columnを定義する
export const GridColumns = {
  parent: {
    0: {
      title: "",
      member: []
    },
    1: {
      title: "役員詳細",
      member: [102, 106, 108, 109, 124, 139, 141, 143, 144, 145, 146, 147, 148, 149, 150,
        163, 164, 165, 167, 168, 170, 171, 172, 173, 174, 175, 176, 177, 178, 151]
    },
    2: {
      title: "役員報酬",
      member: [102, 106, 108, 109, 124, 139, 141, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252]
    },
    3: {
      title: "関係会社の状況",
      member: [102, 106, 108, 109, 124, 339, 340, 341, 342, 343, 346, 348, 349, 351, 352,
       356, 357, 358, 359, 360]
    },
    4: {
      title: "公認会計士の監査意見",
      member: [102, 106, 108, 109, 124, 439, 440, 441, 442, 445, 447, 449, 451, 453, 443, 444]
    }
  },
  chiled: {
    102: {
      field: "102",
      headerName: "決算年月",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
    },
    106: {
      field: "106",
      headerName: "株式コード",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      comparator: dataCompatar,
      
    },
    108: {
      field: "108",
      headerName: "決算月数",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    109: {
      field: "109",
      headerName: "連結・単独",
      hide: false,
      filter: true,
      comparator: stringCompatar,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
    },
    124: {
      field: "124",
      headerName: "データ作成日",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
    },
    139: {
      field: "139",
      headerName: "役員氏名",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    141: {
      field: "141",
      headerName: "役職名",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    143: {
      field: "143",
      headerName: "代表権",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    144: {
      field: "144",
      headerName: "社外役員",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    145: {
      field: "145",
      headerName: "取締役（詳細）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    146: {
      field: "146",
      headerName: "執行役員",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    147: {
      field: "147",
      headerName: "委員会機関での執行役",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    148: {
      field: "148",
      headerName: "指名委員会への所属",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    149: {
      field: "149",
      headerName: "監査委員会への所属",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    150: {
      field: "150",
      headerName: "報酬委員会への所属",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    151: {
      field: "151",
      headerName: "監査等委員会への所属",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    163: {
      field: "163",
      headerName: "入社年月日",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    164: {
      field: "164",
      headerName: "生年月日",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    165: {
      field: "165",
      headerName: "現在職名・担当部門",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    167: {
      field: "167",
      headerName: "就任年月日",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },

    168: {
      field: "168",
      headerName: "現職就任年月日",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    170: {
      field: "170",
      headerName: "学歴",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    171: {
      field: "171",
      headerName: "社外歴1",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    172: {
      field: "172",
      headerName: "社外歴2",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    173: {
      field: "173",
      headerName: "社外歴3",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    174: {
      field: "174",
      headerName: "社外歴4",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    175: {
      field: "175",
      headerName: "社外歴5",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    176: {
      field: "176",
      headerName: "保有株式数（株）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    177: {
      field: "177",
      headerName: "保有株式数",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    178: {
      field: "178",
      headerName: "保有株式数単位",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    243: {
      field: "243",
      headerName: "基本報酬",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    244: {
      field: "244",
      headerName: "基本報酬（うち提出会社以外）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    245: {
      field: "245",
      headerName: "ストックオプション",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    246: {
      field: "246",
      headerName: "ストックオプション（うち提出会社以外）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    247: {
      field: "247",
      headerName: "賞与",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    248: {
      field: "248",
      headerName: "賞与（うち提出会社以外）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    249: {
      field: "249",
      headerName: "退職慰労金",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    250: {
      field: "250",
      headerName: "退職慰労金（うち提出会社以外）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    251: {
      field: "251",
      headerName: "報酬総額",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    252: {
      field: "252",
      headerName: "報酬総額（うち提出会社以外）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    339: {
      field: "339",
      headerName: "連結対象子会社数",
      hide: false,
      filter: true,
      comparator: numberCompatar,
      filterParams: customFilterParams,
      cellClass: "grid-cell-right",
      
    },
    340: {
      field: "340",
      headerName: "持分法適用関連会社数",
      hide: false,
      filter: true,
      comparator: numberCompatar,
      filterParams: customFilterParams,
      cellClass: "grid-cell-right",
      
    },
    341: {
      field: "341",
      headerName: "関係種別",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    342: {
      field: "342",
      headerName: "関係会社（日経会社コード）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    343: {
      field: "343",
      headerName: "関係会社（名称）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    346: {
      field: "346",
      headerName: "関係会社（住所）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    348: {
      field: "348",
      headerName: "関係会社（有報提出）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    349: {
      field: "349",
      headerName: "関係会社（主要事業内容）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    351: {
      field: "351",
      headerName: "関係会社（関係内容）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    352: {
      field: "352",
      headerName: "資本金・出資金（百万円）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    // 353: {
    //   field: "353",
    //   headerName: "資本金・出資金",
    //   hide: false,
    //   filterParams: customFilterParams,
    // },
    // 354: {
    //   field: "354",
    //   headerName: "資本金・出資金単位",
    //   hide: false,
    //   filterParams: customFilterParams,
    // },
    // 355: {
    //   field: "355",
    //   headerName: "資本金・出資金単位（文字列）議決権所有割合",
    //   hide: false,
    //   filterParams: customFilterParams,
    // },
    356: {
      field: "356",
      headerName: "議決権所有割合",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    357: {
      field: "357",
      headerName: "議決権所有割合（うち間接所有割合）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    358: {
      field: "358",
      headerName: "協力的な株主の所有割合",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    359: {
      field: "359",
      headerName: "提出会社の被所有割合",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    360: {
      field: "360",
      headerName: "債務超過額",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      valueFormatter: formatNumber,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    439: {
      field: "439",
      headerName: "監査の有無",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    441: {
      field: "441",
      headerName: "監査事務所コード",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-centered",
      
      comparator: stringCompatar,
    },
    442: {
      field: "442",
      headerName: "監査事務所名",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    445: {
      field: "445",
      headerName: "公認会計士名１",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    447: {
      field: "447",
      headerName: "公認会計士名２",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    449: {
      field: "449",
      headerName: "公認会計士名３",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    451: {
      field: "451",
      headerName: "公認会計士名４",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    453: {
      field: "453",
      headerName: "公認会計士名５",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    443: {
      field: "443",
      headerName: "継続監査期間",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
    444: {
      field: "444",
      headerName: "継続監査期間（年数）",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      comparator: numberCompatar,
      cellClass: "grid-cell-right",
      
    },
    // 498: {
    //   field: "498",
    //   headerName: "年齢",
    //   hide: false,
      filter: true,
    //   filterParams: customFilterParams,
    // },
    440: {
      field: "440",
      headerName: "監査意見",
      hide: false,
      filter: true,
      filterParams: customFilterParams,
      cellClass: "grid-cell-left",
      
      comparator: stringCompatar,
    },
  },
};

// this puts commas into the number eg 1000 goes to 1,000,
function formatNumber(params) {
  if (params.value === "") {
    return ""
  } else {
    return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}

// カスタマイズ　ソート
function dataCompatar (data1, data2) {
    const sortData1 = formatData(data1)
    const sortData2 = formatData(data2)
    
    if (sortData1.isNumber && sortData2.isNumber) {
        // All numbers
        return parseInt(sortData1.value) - parseInt(sortData2.value)
    } else if (!sortData1.isNumber && !sortData2.isNumber) {
        // All strings
        return 0
    } else if (sortData1.isNumber && !sortData2.isNumber){
        // First is number and second is string
        return -1
    } else if (!sortData1.isNumber && sortData2.isNumber) {
        // First is string and second is number
        return 1
    }
}

// カスタマイズ　数字ソート
function numberCompatar (data1, data2) {
  if (data1 === "" && data2 === "") {
    return 0
  } else if (data1 !== "" && data2 === "") {
    return -1
  } else if (data1 === "" && data2 !== "") {
    return 1
  } else {
    return parseFloat(data1) - parseFloat(data2)
  }
  
}

// カスタマイズ　stringソート
function stringCompatar (data1, data2) {
  if (data1 === "" && data2 === "") {
    return 0
  } else if (data1 !== "" && data2 === "") {
    return -1
  } else if (data1 === "" && data2 !== "") {
    return 1
  } else {
    return data1.localeCompare(data2)
  }
}

// Format the sorted data
function formatData (data) {
    const regPos = /^\d+(\.\d+)?$/
    return {value: data, isNumber: regPos.test(data)}
}
