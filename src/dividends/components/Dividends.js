import {Component, useState, useEffect, useRef } from 'react';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {AgGridReact} from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';



// ----- initial state --- 

export const initialState =  {
    rowData: []
};




// ---- type ----- 

export const types = {
    CHANGE_UNIVERSE: 'CHANGE_UNIVERSE',
    FETCH_DIVIDENDS: 'FETCH_DIVIDENDS',
    DATA_UPDATED: 'DATA_UPDATED',
    ROW_DATA_CHANGED: 'ROW_DATA_CHANGED',
    DATA_INITIALIZE: 'DATA_INITIALIZE'
};



// ---- action ----- 

export const actions = {
    fetch(data) {
        return { type: types.FETCH_DIVIDENDS, payload: data}
    }
}



// ---- reducer ----- 

export function reducer(state = [], action) {
    const payload = action.payload;
    
    switch (action.type) {
        case types.DATA_INITIALIZE:
            return { ...state, rowData: payload }
        case types.DATA_UPDATED:
            return { ...state, rowData: state.rowData.concat(convertData(payload)) }
        default:
            return state
    }
}



// ---- Cell Model ----
function Dividend(dividends /* 通期でグループ化された配列 */) {
    this.data = dividends
    var hasEmpty = dividends.filter(item => item.D003 === "Y" && item.D020 === "");
    if (!dividends[0].D009 || hasEmpty.length > 0) {
        this.value = ""
        this.value_adj = ""
        this.period = ""
    } else {    
        this.value = dividends.reduce((a, c) => {return a + Number(c.D015) }, 0)
        this.value_adj = dividends.reduce((a, c) => {return a + Number(c.D020) }, 0)
        this.period = dividends[0].D009
    }
}



// ---- Cell Renderer ----

const DividendsCellRenderer = (params) => {
    if (params.term_no >= params.data.value.length) {
        return (<div></div>)
    }
    let dividend = new Dividend(params.data.value[params.data.value.length - params.term_no - 1])
    if (!dividend.period) {
        return (<div></div>)
    }
    return (
        <div>
            <style jsx>{`
            div { 
                margin: 0px;
                padding: 0px;
                height: 32px;
            }
            .period {
                color: #939393;
                line-height: 1;
                position: absolute;
                top: 1px;
                left: 1px;
                font-size: 10px;
            }
            .dividends {
                line-height: 1;
                position: absolute;
                top: 14px;
                right: 24px;
                font-size: 12px;
            }
            `}</style>
            <span className="period">{ dividend.period }</span>
            <span className="dividends">{ dividend.value_adj.toFixed(2) }</span>
        </div>)
}




// ---- converter ----

const convertData = (data) => {
    const dataArray = data.rowdata
    const codeArray = data.brandData
    let keyValue = dataArray.map(i => { 
        return { 
            "D001": i[0],  "D003": i[1], "D009": i[2],  "D010": i[3],  "D020": i[4]
        }
    })

    
    // 1. 通期決算期 空データ
    let kv = keyValue.filter(d => d.D009)
    
    let byD001 = kv.reduce((acc, crr) => {
        let key = crr.D001;
        if (!(key in acc))  Object.assign(acc, { [key] : [] })
        acc[key].push(crr)
        return acc
    }, {})
    const groupByPeriod = Object.entries(byD001).reduce((a, entry) => {
        const key = entry[0]
        const vals = entry[1]
        // 通期決算期が同じものをグループ化。
        let group = []
        let count = 0
        for (let i=0; i<vals.length; i++) {
            let val = vals[i];
            if (group.length > 0 && group[0].D009 != val.D009) {
                for (let unit of group) {
                    if (unit.D003 === "Y") {
                        count++
                        break
                    }
                }
                if (count > 2) {
                    break
                }
                a[key] ? a[key].push(group) : a[key] = [group]
                group = [val]
            } else {
                group.push(val)
            }
        }
        //最後のグループをpush
        if((group.length === 1 && group[0].D009 === group[0].D010 || group.length > 1) && count < 2) {
            a[key] ? a[key].push(group) : a[key] = [group]
        }  
        a[key] = checkDate(a[key]);
        return a;
    },{})
    //2023年4月修正 空データの場合の処理
    const b = keyValue.filter(d => !d.D003 && !d.D009 && !d.D010 && !d.D020).map(b => ({id: b.D001, value: [], name: codeArray[b.D001] }));
    return Object.keys(groupByPeriod).map(i => ({id: i, value: groupByPeriod[i], name: codeArray[i] })).concat(b);
}

function checkDate(arr) {
    for (let index = 1; index < 3; index++) {
        let checkFlag = true;
        if (arr[arr.length - index]) {
            for (let unit of arr[arr.length - index]) {
                if (unit.D003 === "Y") {
                    checkFlag = false;
                    break;
                }
            }
        }
        if (checkFlag) {
            arr.push([{ D001: "", D003: "", D009: "", D010: "", D020: "" }, { D001: "", D003: "", D009: "", D010: "", D020: "" }]);
        }
    }
    return arr;
}




// ---- Component ----
export let gridApi,columnDefs
const DividendsGrid = ({rowData, actions, modelUpdated, getRowNodeId, universe}) => {
    // hooks
    const [myOptions, setMyOptions] = useState(null);
    [columnDefs] = useState([
            {
                headerName: "銘柄名",
                field: "id",
                width: 120,
                filter: true,
                sortable: true,
                cellRenderer: (params) => {
                    return `<a href='quickws://?StartWindow=${params.data.id}*YHTZ;29' style="text-decoration: none;">${params.data.id}</a>
                            <span>　${params.data.name}<span>`
                },
                valueGetter: function getter(params) {
                    return params.data.id + " " + params.data.name;
                }
            }
        ])
    let columnDef = (key) => {
            let headerNames = ["来期予想", "今期予想", "前期(実績)", "前々期"].concat( Array(8).fill().map((v,i)=>`${i+3}期前`) )
            return {
                headerName: headerNames[key],
                width: 80,
                cellRendererFramework: DividendsCellRenderer,
                cellRendererParams: { term_no:  key },
                valueGetter: function getter(params) {
                    let idx = params.colDef.cellRendererParams.term_no
                    let values = params.data.value
                    if (idx >= values.length) {
                        return ""
                    }
                    let dividend = new Dividend(values[values.length - idx - 1])
                    if (dividend.period === "") {
                        return ""
                    } else {
                        return { period: dividend.period , value_adj: dividend.value_adj.toFixed(2)}
                    } 
                }
            }
        }
    for (let i=0; i<11; i++) { columnDefs.push(columnDef(i)) }
    
    columnDefs.push(
            {
                headerName:"　　",　// dummy pad.
                headerComponentParams : {
                    template:`
                  <div class="ag-cell-label-container" role="presentation">
                    <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                    <div ref="eLabel" class="ag-header-cell-label" role="presentation">
                        <div style="position: absolute; line-height: 11px; top: 4px;" >連続<br/>増配</div>
                        <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span ref="eFilter" style="position: absolute; left: 30px;" class="ag-header-icon ag-filter-icon"></span>
                        <span ref="eSortOrder" style="position: absolute; left: 30px;" class="ag-header-icon ag-sort-order" ></span>
                        <span ref="eSortAsc" style="position: absolute; left: 30px;" class="ag-header-icon ag-sort-ascending-icon" ></span>
                        <span ref="eSortDesc" style="position: absolute; left: 30px;" class="ag-header-icon ag-sort-descending-icon" ></span>
                        <span ref="eSortNone" style="position: absolute; left: 30px;" class="ag-header-icon ag-sort-none-icon" ></span>
                    </div>
                </div>
                  `  
                },
                width: 60,
                sortable: true,
                valueGetter: (params) => {
                    const vals = params.data.value
                    if(vals.length == 0) return ""
                    let res = vals.reduce((a, c) => {
                        let v = new Dividend(c).value_adj
                        if (v !== "") {
                            a.counter =  (a.previous < v) ? a.counter + 1 : 0
                            a.previous = v
                        }
                        return a
                    }, {counter: 0, previous: 10000000 })

                    return res.counter
                }
            })
    
        
    const [frameworkComponents] = useState(frameworkComponents);
    const gridApiRef = useRef(null);
    
    useEffect(() => {
        actions.fetch(universe)
    }, [])
    return (
        <div 
            className="ag-theme-balham"
            style={{ 
            fontSize: '0.7em',
            margin: 0,
            padding: 0,
            height: 'calc(100vh - 76px)', 
            width: '1080px' }} >

            <style jsx global>{`
                body{
                    width: 1080px;
                    height: 100%;
                }
                .ag-header { 
                    font-size: 0.8em !important;
                }
                .ag-icon{
                    line-height: 0px !important;
                }
                `}</style>
    
            <AgGridReact 
                columnDefs={columnDefs}
                rowData={rowData}
                onGridReady={params => {
                    gridApi = params.api
                    gridApiRef.current = params.api
                    }
                }
                rowHeight={32}
                headerHeight={32}
                suppressMovableColumns={true}
                onRowDataChanged={params => params.api.resetRowHeights()}
                onModelUpdated={() => modelUpdated()}
                getRowNodeId={getRowNodeId}
                rowSelection={"multiple"}
                deltaRowDataMode={true}
                localeText= {{noRowsToShow: 'Loading...'}}
                onCellClicked ={()=>document.activeElement.blur()}
                onCellContextMenu = {(e)=> e.node.isSelected() ? e.node.setSelected(true) : e.node.setSelected(true, true)}
              ></AgGridReact>
        </div>
    )
}


const mapStateToProps = (state) => ({
    rowData: state.dividends.rowData,
    universe: state.header.universe
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    modelUpdated: () => dispatch({ type: types.ROW_DATA_CHANGED }),
    getRowNodeId: (data) => data.id
})

const view = connect(mapStateToProps, mapDispatchToProps)(DividendsGrid)
export { view }

