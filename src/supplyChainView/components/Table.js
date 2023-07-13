import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

// ----- initial state --- 
export const initialState = {
    header: [],
    rowData: [],
    cnList: []
};

// ---- type ----- 

export const types = {
    INIT_TABLE_UPDATED: "INIT_TABLE_UPDATED",
    TABLE_UPDATED: "TABLE_UPDATED"
};



// ---- action ----- 

export const actions = {
}



// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.INIT_TABLE_UPDATED:
            return { ...state, header: payload.header, rowData: payload.rowData , cnList: payload.cnList}
        case types.TABLE_UPDATED:
            return { ...state, header: payload.header, rowData: payload.rowData}
        default:
            return state
    }
}




// ---- Component ----

//テーブル
export let gridApi
const Table = (props) => {
    // let columnD = props.header.map(value => {
    //     return {
    //         "header": value, "field": value ,"width": 120, filter: true
    //     }
    // })

    let columnD = [
        { "header": "取引種別", "field": "取引種別" ,"width": 120, filter: true , cellStyle: {'border-right': "solid 1px #DDDDDD"}},
        { "header": props.header[3], "field": "0_ティッカー" ,"width": 120, filter: true },
        { "header": props.header[7], "field":"0_名称" ,"width": 120, filter: true },
        { "header": props.header[9], "field": "0_国名/地域名" ,"width": 120, filter: true },
        { "header": props.header[17], "field": "0_業種1" ,"width": 120, filter: true },
        { "header": props.header[19], "field": "0_業種2" ,"width": 120, filter: true },
        { "header": props.header[21], "field": "0_組織" ,"width": 120, filter: true , cellStyle: {'border-right': "solid 1px #DDDDDD"}},
        { "header": props.header[25], "field": "1_QUICKコード" ,"width": 120, filter: true },
        { "header": props.header[31], "field": "1_名称" ,"width": 120, filter: true },
        { "header": props.header[33], "field": "1_国名/地域名" ,"width": 120, filter: true },
        { "header": props.header[41], "field": "1_業種1" ,"width": 120, filter: true },
        { "header": props.header[43], "field": "1_業種2" ,"width": 120, filter: true },
        { "header": props.header[45], "field": "1_組織" ,"width": 120, filter: true },
        { "header": props.header[53], "field": "1_収入割合" ,"width": 120, filter: true , cellStyle: {'border-right': "solid 1px #DDDDDD"}},
        { "header": props.header[57], "field": "2_QUICKコード" ,"width": 120, filter: true },
        { "header": props.header[63], "field": "2_名称" ,"width": 120, filter: true },
        { "header": props.header[65], "field": "2_国名/地域名" ,"width": 120, filter: true },
        { "header": props.header[73], "field": "2_業種1" ,"width": 120, filter: true },
        { "header": props.header[75], "field": "2_業種2" ,"width": 120, filter: true },
        { "header": props.header[77], "field": "2_組織" ,"width": 120, filter: true },
        { "header": props.header[85], "field": "2_収入割合" ,"width": 120, filter: true },
    ]
    
    let rowD = props.rowData.map((value,i) => {
        return {
        "id": i,
        "取引種別": value[0],
        // "I": value[0],
        // "0_QCD": value[1],
        // "0_QCD_S": value[2],
        "0_ティッカー": value[1],
        // "0_Ticker_S": value[4],
        // "0_EntityID": value[5],
        // "0_EntityID_S": value[6],
        "0_名称": value[2],
        // "0_Name_S": value[8],
        "0_国名/地域名": props.cnList[value[3]],
        // "0_Country_S": value[10],
        // "0_Country_N": value[11],
        // "0_Country_N_S": value[12],
        // "0_MetroArea": value[13],
        // "0_MetroArea_S": value[14],
        // "0_RBICS": value[15],
        // "0_RBICS_S": value[16],
        "0_業種1": value[4],
        // "0_RBICS_N1_S": value[18],
        "0_業種2": value[5],
        // "0_RBICS_N2_S": value[20],
        "0_組織": value[6],
        // "0_EntityType_S": value[22],
        // "0_ParentID": value[23],
        // "0_ParentID_S": value[24],
        "1_QUICKコード": value[7],
        // "1_QCD_S": value[26],
        // "1_Ticker": value[27],
        // "1_Ticker_S": value[28],
        // "1_EntityID": value[29],
        // "1_EntityID_S": value[30],
        "1_名称": value[8],
        // "1_Name_S": value[32],
        "1_国名/地域名": props.cnList[value[9]],
        // "1_Country_S": value[34],
        //"1_Country_N": value[35],
        // "1_Country_N_S": value[36],
        // "1_MetroArea": value[37],
        // "1_MetroArea_S": value[38],
        // "1_RBICS": value[39],
        // "1_RBICS_S": value[40],
        "1_業種1": value[10],
        // "1_RBICS_N1_S": value[42],
        "1_業種2": value[11],
        // "1_RBICS_N2_S": value[44],
        "1_組織": value[12],
        // "1_EntityType_S": value[46],
        // "1_ParentID": value[47],
        // "1_ParentID_S": value[48],
        // "1_Grade": value[49],
        // "1_Grade_S": value[50],
        // "1_Ranking": value[51],
        // "1_Ranking_S": value[52],
        "1_収入割合": value[13],
        // "1_RevenuePct_S": value[54],
        // "1_Overlap": value[55],
        // "1_Overlap_S": value[56],
        "2_QUICKコード": value[14],
        // "2_QCD_S": value[58],
        // "2_Ticker": value[59],
        // "2_Ticker_S": value[60],
        // "2_EntityID": value[61],
        // "2_EntityID_S": value[62],
        "2_名称": value[15],
        // "2_Name_S": value[64],
        "2_国名/地域名": props.cnList[value[16]],
        // "2_Country_S": value[66],
        //"2_Country_N": value[67],
        // "2_Country_N_S": value[68],
        // "2_MetroArea": value[69],
        // "2_MetroArea_S": value[70],
        // "2_RBICS": value[71],
        // "2_RBICS_S": value[72],
        "2_業種1": value[17],
        // "2_RBICS_N1_S": value[74],
        "2_業種2": value[18],
        // "2_RBICS_N2_S": value[76],
        "2_組織": value[19],
        // "2_EntityType_S": value[78],
        // "2_ParentID": value[79],
        // "2_ParentID_S": value[80],
        // "2_Grade": value[81],
        // "2_Grade_S": value[82],
        // "2_Ranking": value[83],
        // "2_Ranking_S": value[84],
        "2_収入割合": value[20],
        // "2_RevenuePct_S": value[86],
        // "2_Overlap": value[87],
        // "2_Overlap_S": value[88],
        }
    })

    
    const gridApiRef = useRef(null);
    return (
        <div
            style={{
                fontSize: '12px',
                margin: 0,
                padding: 0,
                height: 'calc(100vh - 106px)',
                minHeight: '600px',
            }} className="ag-theme-balham">

            <style jsx global>{`
                body{
                    width: 100%;
                    height: 100%;
                }
                .ag-header-cell-text{
                    margin-left: auto !important;
                    margin-right: auto !important;
                    font-weight: normal;
                    font-family:${props.fontFamily} !important;

                }
                .ag-row {
                    border-bottom: none !important;
                    border-top: none !important;
                    
                }
                .ag-cell{
                    line-height: 14px !important;
                    font-family:${props.fontFamily} !important;
                }
                .last-coulmn{
                    border-right: solid 1px black;
                }
                
                `}</style>
    
            <AgGridReact 
                columnDefs={columnD}
                rowData={rowD}
                onGridReady={params => {
                    gridApi = params.api
                    gridApiRef.current = params.api
                    }
                }
                rowHeight={14}
                headerHeight={20}
                getRowNodeId={props.getRowNodeId}
                rowSelection={"multiple"}
                deltaRowDataMode={true}
                suppressPropertyNamesCheck={true}
              ></AgGridReact>
        </div>
    )
}



const mapStateToProps = (state) => ({
    header: state.Table.header,
    rowData: state.Table.rowData,
    cnList: state.Table.cnList,
    fontFamily: state.Header.fontFamily,
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    getRowNodeId: (data) => data.id

})

const view = connect(mapStateToProps, mapDispatchToProps)(Table)
export { view }



