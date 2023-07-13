import { call, put, takeLatest, takeEvery, select, all } from 'redux-saga/effects'
import { gridApi,columnDefs } from './components/Dividends'
import * as DividendsComponent from './components/Dividends'
import * as HeaderComponent from './components/Header'
import * as ContextMenuComponent from './components/ContextMenu'
import * as ShowMessageComponent from './components/ShowMessage'
import { fetchGetUniverse, Arrydata, fetchAPI } from './api.js'
import * as agGrid from 'ag-grid-community'

function* fetchDividends(action) {
   try {
      yield put({type: HeaderComponent.types.DATA_LOADING, payload: true});
      yield put({type: DividendsComponent.types.DATA_INITIALIZE, payload: []});
      const universe = action.payload
      const brandData = yield call(fetchGetUniverse,universe);
      const rowdata = yield call(fetchAPI, universe)
      
      yield put({ type: DividendsComponent.types.DATA_UPDATED, payload: {rowdata:rowdata,brandData:brandData} });
      yield put({type: HeaderComponent.types.DATA_LOADING, payload: false});
   } catch (e) {
      //console.log(e)
      yield put({type: ShowMessageComponent.types.USER_FETCH_FAILED, payload: { message: "データの取得に失敗しました。",isOpen: true }});
      yield put({type: HeaderComponent.types.DATA_LOADING, payload: false});
   }
}

function* rowDataChanged(){
  if (gridApi) yield put({ type: HeaderComponent.types.COLUMN_COUNT, payload: gridApi.getDisplayedRowCount() })
}

function* download(){
  const header = columnDefs.map(c => c.headerName)
  header[12] = "連続増配"
  header.splice(13)
  let colData = []
  for (let index = 0; index < header.length; index++) {
    if (index === 0) {
      colData.push({ headerName: '銘柄コード',field: `${index}`}, { headerName: header[index],field: `${header.length + index + 1}`})
    } else if (index === header.length - 1){
      colData.push({ headerName: header[index],field: `${index}`})
    } else {
      colData.push({ headerName: header[index],field: `${index}`}, { headerName: "", field: `${header.length + index + 1}`})
    }
  }
  const rowperiod = gridApi.getDataAsCsv(
    {
      skipHeader: true,
      processCellCallback: ((cell) => cell.value.period ? cell.value.period : cell.value )
    }
  ).split(/\r\n|\r|\n/)
  const rowvalue = gridApi.getDataAsCsv(
    {
      skipHeader: true,
      processCellCallback: ((cell) => cell.value.value_adj ? cell.value.value_adj : "")
    }
  ).split(/\r\n|\r|\n/)
  let rowData = []
  for (let index = 0; index < rowvalue.length; index++){
    let dates = rowperiod[index].replace(/"/g, "").split(",")
    let values = rowvalue[index].replace(/"/g, "").split(",")
    let valueObj = {}
    for (let index = 0; index < dates.length + 1; index++) {
      if (index === 0) {
        let params = dates[index].split(" ")
        valueObj[index] = params[0]
        valueObj[header.length + index + 1] = params[1]
      } else {
        valueObj[index] = dates[index]
        valueObj[header.length + index + 1] = values[index]
      }
    }
    rowData.push(valueObj);
  }
  let gridOptions = {
    columnDefs: colData,
    rowData: rowData
  };
  let eGridDiv = document.createElement('div');
  let newGrid = new agGrid.Grid(eGridDiv, gridOptions);
  newGrid.gridOptions.api.exportDataAsCsv({
    skipHeader: false,
    processCellCallback: ((cell) => cell.value ? cell.value : "") 
  })
}
function* copy(){
  let text= "";
  const header = columnDefs.map(c => c.headerName)
  header[12] = "連続増配"
  header.splice(13)

  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.left = '-100%'
  const textarea = document.createElement('textarea')

  const rowperiod = gridApi.getDataAsCsv(
    {
      skipHeader: true,
      onlySelected: true,
      processCellCallback: ((cell) => cell.value.period ? cell.value.period : cell.value )
    }
  )
  const rowvalue = gridApi.getDataAsCsv(
    {
      skipHeader: true,
      onlySelected: true,
      processCellCallback: ((cell) => cell.value.value_adj ? cell.value.value_adj : "")
    }
  )
  
  let arry1 = rowperiod.split(/\r\n|\r|\n/);
  let arry2 = rowvalue.split(/\r\n|\r|\n/);

  for(let i = 0; i < arry1.length; i++){
    text = text + arry1[i] + "\n"+ arry2[i]+ "\n"
  }
  textarea.value = header + "\n" + text

  div.appendChild(textarea)
  document.body.appendChild(div)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(div)
}

function* selectAll(){
  gridApi.deselectAll()
  gridApi.selectAllFiltered()
}

function* DividendsSaga() {
  yield takeLatest(DividendsComponent.types.FETCH_DIVIDENDS, fetchDividends)
  yield takeLatest(HeaderComponent.types.CHANGE_UNIVERSE, fetchDividends)
  yield takeEvery(DividendsComponent.types.ROW_DATA_CHANGED, rowDataChanged)
  yield takeEvery(HeaderComponent.types.DOWNLOAD_LINK, download)
  yield takeEvery(ContextMenuComponent.types.DOWNLOAD, download)
  yield takeEvery(ContextMenuComponent.types.COPY_SELECTED_ROWS, copy)
  yield takeEvery(ContextMenuComponent.types.SELECT_ALL, selectAll)
}

export default DividendsSaga;