import fetch from 'isomorphic-unfetch'
import "@babel/polyfill"

import React, { useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { combineReducers, createStore, applyMiddleware, compose } from 'redux'

import createSagaMiddleware from 'redux-saga'
import { takeLatest, takeEvery, put, select, call, all } from 'redux-saga/effects'


import * as HeaderComponent from '../components/Header'
import * as TabComponent from '../components/Tab'
import * as TableComponent from '../components/Table'
import * as ForceComponent from '../components/Force'
import * as FilterComponent from '../components/Filter'
import * as InfoComponent from '../components/Info'
import * as HierarchyComponent from '../components/Hierarchy'
import * as OutputButtonComponent from '../components/OutputButton'
import * as MessageComponent from '../components/Message'

// 定数
const URL_API = "api/"

// --------------
// reducer
// --------------

const initialState = {
  Header: HeaderComponent.initialState,
  Tab: TabComponent.initialState,
  Table: TableComponent.initialState,
  Force: ForceComponent.initialState,
  Filter: FilterComponent.initialState,
  Hierarchy: HierarchyComponent.initialState,
  Message: MessageComponent.initialState,
  Info: InfoComponent.initialState,
}
const rootReducer = combineReducers({
  Header: HeaderComponent.reducer,
  Tab: TabComponent.reducer,
  Table: TableComponent.reducer,
  Force: ForceComponent.reducer,
  Filter: FilterComponent.reducer,
  Hierarchy: HierarchyComponent.reducer,
  Message: MessageComponent.reducer,
  Info: InfoComponent.reducer,
})

// --------------
// saga
// --------------
const sagaMiddleware = createSagaMiddleware()


// --------------
// store
// --------------
const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(sagaMiddleware)))

// --------------
// saga run
// --------------
//
// パラメータ切替用
//
function getUrlQueries() {
  let queryStr = location.search.slice(1);
  let queries = {};
  if (!queryStr) {
    return queries;
  }
  queryStr.split('&').forEach(function (queryStr) {
    let queryArr = queryStr.split('=');
    queries[queryArr[0]] = queryArr[1];
  });
  return queries;
}


function* forceSaga(fetchData, unique, sc, cs, check, second, third, rbics, country, filterType, tabState, hisState) {
  const data = yield select()
  const historyCount = data.Header.historyCount
  const history = data.Force.history
  const cnList = data.Table.cnList
  const name = data.Force.name
  const entity = data.Force.entity

  let tableArr = []
  let tableHeader = []
  fetchData = fetchData.length != 0 ? fetchData : { "edit": { "code": "", "name": name, "country": "", "industry": "", "entity": entity, "children": [], "count": 0 }, "arrForce": { "res": [], "res1": [], "res2": [], "name": name, "code": "", "country": "", "entity": entity, "industry": "" } }

  if (sc == "S") {
    yield put({ type: ForceComponent.types.GET_FORCE_DATA, payload: { "data": fetchData.arrForce } });
    yield put({ type: ForceComponent.types.GET_DATA, payload: { "data": fetchData.edit } });
    const filterForceData = yield call(filterForceAPI, fetchData.arrForce, second, third, rbics, country, filterType, cnList)
    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE, payload: { "data": filterForceData } })
    yield put({ type: ForceComponent.types.GET_FORCE_DATA2, payload: { "data": [] } });
    yield put({ type: ForceComponent.types.GET_DATA2, payload: { "data": [] } });
    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE2, payload: { "data": [] } })
  } else {
    yield put({ type: ForceComponent.types.GET_FORCE_DATA2, payload: { "data": fetchData.arrForce } });
    yield put({ type: ForceComponent.types.GET_DATA2, payload: { "data": fetchData.edit } });
    const filterForceData = yield call(filterForceAPI, fetchData.arrForce, second, third, rbics, country, filterType, cnList)
    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE2, payload: { "data": filterForceData } })
    yield put({ type: ForceComponent.types.GET_FORCE_DATA, payload: { "data": [] } });
    yield put({ type: ForceComponent.types.GET_DATA, payload: { "data": [] } });
    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE, payload: { "data": [] } })
  }

  yield put({ type: ForceComponent.types.COMPANY_DATA, payload: { "code": fetchData.edit.code, "name": fetchData.edit.name, "country": fetchData.edit.country, "industry": fetchData.edit.industry, "entity": fetchData.edit.entity } })

  if (!hisState) {
    const historyData = { "quote": fetchData.edit.code, "entity": fetchData.edit.entity, "name": fetchData.edit.name, "sc": sc, "filterType": filterType, "country": country, "rbics": rbics, "hierarchy": second, "tabState": tabState }
    if (history.legnth - 1 === historyCount || historyCount === "") {
      yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
    } else {
      history.splice(historyCount + 1)
      yield put({ type: ForceComponent.types.HISTORY_UPDATE, payload: history });
      yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
      yield put({ type: HeaderComponent.types.COUNT_RESET });
    }
  }

  yield put({ type: HeaderComponent.types.CHANGE_TEXT, payload: fetchData.edit.code })

  let fetchData2 = yield call(fetchAPI, unique, cs, check);
  fetchData2 = fetchData2.length != 0 ? fetchData2 : { "edit": { "code": "", "name": name, "country": "", "industry": "", "entity": entity, "children": [], "count": 0 }, "arrForce": { "res": [], "res1": [], "res2": [], "name": name, "code": "", "country": "", "entity": entity, "industry": "" } }

  const filterForceData2 = yield call(filterForceAPI, fetchData2.arrForce, second, third, rbics, country, filterType, cnList)
  const filterTreeData = yield call(filterTreeAPI, fetchData.edit, second, third, rbics, country, filterType, cnList)
  const filterTreeData2 = yield call(filterTreeAPI, fetchData2.edit, second, third, rbics, country, filterType, cnList)
  if (sc == "S") {
    yield put({ type: ForceComponent.types.GET_FORCE_DATA2, payload: { "data": fetchData2.arrForce } });
    yield put({ type: ForceComponent.types.GET_DATA2, payload: { "data": fetchData2.edit } });
    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE2, payload: { "data": filterForceData2 } })
    yield put({ type: ForceComponent.types.DATA_UPDATED, payload: { "data": filterTreeData, "code": fetchData.edit.code, "name": fetchData.edit.name, "country": fetchData.edit.country, "industry": fetchData.edit.industry, "entity": fetchData.edit.entity, "count": fetchData.edit.count } });
    yield put({ type: ForceComponent.types.DATA_UPDATED2, payload: { "data": filterTreeData2, "code": fetchData2.edit.code, "name": "", "country": fetchData2.edit.country, "industry": fetchData2.edit.industry, "entity": fetchData2.edit.entity, "count": fetchData2.edit.count } });

    if (fetchData.rowData !== undefined && fetchData2.rowData !== undefined) {
      tableArr = fetchData.rowData.concat(fetchData2.rowData)
      tableHeader = fetchData.header
    } else if (fetchData.rowData === undefined) {
      tableArr = fetchData2.rowData
      tableHeader = fetchData2.header
    } else {
      tableArr = fetchData.rowData
      tableHeader = fetchData.header
    }

    yield put({ type: TableComponent.types.TABLE_UPDATED, payload: { "header": tableHeader, "rowData": tableArr } });
  } else {
    yield put({ type: ForceComponent.types.GET_FORCE_DATA, payload: { "data": fetchData2.arrForce } });
    yield put({ type: ForceComponent.types.GET_DATA, payload: { "data": fetchData2.edit } });
    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE, payload: { "data": filterForceData2 } })
    yield put({ type: ForceComponent.types.DATA_UPDATED, payload: { "data": filterTreeData2, "code": fetchData2.edit.code, "name": "", "country": fetchData2.edit.country, "industry": fetchData2.edit.industry, "entity": fetchData2.edit.entity, "count": fetchData2.edit.count } });
    yield put({ type: ForceComponent.types.DATA_UPDATED2, payload: { "data": filterTreeData, "code": fetchData.edit.code, "name": fetchData.edit.name, "country": fetchData.edit.country, "industry": fetchData.edit.industry, "entity": fetchData.edit.entity, "count": fetchData.edit.count } });

    if (fetchData.rowData !== undefined && fetchData2.rowData !== undefined) {
      tableArr = fetchData.rowData.concat(fetchData2.rowData)
      tableHeader = fetchData.header
    } else if (fetchData.rowData === undefined) {
      tableArr = fetchData2.rowData
      tableHeader = fetchData2.header
    } else {
      tableArr = fetchData.rowData
      tableHeader = fetchData.header
    }

    yield put({ type: TableComponent.types.TABLE_UPDATED, payload: { "header": tableHeader, "rowData": tableArr } });
  }

}

function* treeSaga(fetchData, fetchData2, sc, second, third, rbics, country, filterType, tabState, hisState) {
  const data = yield select()
  const historyCount = data.Header.historyCount
  const history = data.Force.history
  const cnList = data.Table.cnList
  const name = data.Force.name
  const entity = data.Force.entity

  let tableArr = []
  let tableHeader = []
  fetchData = fetchData.length != 0 ? fetchData : { "edit": { "code": "", "name": "", "country": "", "industry": "", "entity": entity, "children": [], "count": 0 }, "arrForce": { "res": [], "res1": [], "res2": [], "name": name, "code": "", "country": "", "entity": entity, "industry": "" } }
  fetchData2 = fetchData2.length != 0 ? fetchData2 : { "edit": { "code": "", "name": "", "country": "", "industry": "", "entity": entity, "children": [], "count": 0 }, "arrForce": { "res": [], "res1": [], "res2": [], "name": name, "code": "", "country": "", "entity": entity, "industry": "" } }
  yield put({ type: ForceComponent.types.GET_FORCE_DATA, payload: { "data": fetchData.arrForce } });
  yield put({ type: ForceComponent.types.GET_FORCE_DATA2, payload: { "data": fetchData2.arrForce } });
  yield put({ type: ForceComponent.types.GET_DATA, payload: { "data": fetchData.edit } });
  yield put({ type: ForceComponent.types.GET_DATA2, payload: { "data": fetchData2.edit } });

  const filterTreeData = yield call(filterTreeAPI, fetchData.edit, second, third, rbics, country, filterType, cnList)
  const filterTreeData2 = yield call(filterTreeAPI, fetchData2.edit, second, third, rbics, country, filterType, cnList)

  yield put({ type: ForceComponent.types.DATA_UPDATED, payload: { "data": filterTreeData, "code": fetchData.edit.code, "name": fetchData.edit.name, "country": fetchData.edit.country, "industry": fetchData.edit.industry, "entity": fetchData.edit.entity, "count": fetchData.edit.count } });
  yield put({ type: ForceComponent.types.COMPANY_DATA, payload: { "code": fetchData.edit.code, "name": fetchData.edit.name, "country": fetchData.edit.country, "industry": fetchData.edit.industry, "entity": fetchData.edit.entity } })

  yield put({ type: ForceComponent.types.DATA_UPDATED2, payload: { "data": filterTreeData2, "code": fetchData2.edit.code, "name": fetchData.edit.name == "" ? fetchData2.edit.name : "", "country": fetchData2.edit.country, "industry": fetchData2.edit.industry, "entity": fetchData2.edit.entity, "count": fetchData2.edit.count } });

  if (!hisState) {
    const historyData = { "quote": fetchData.edit.code, "entity": fetchData.edit.entity, "name": fetchData.edit.name, "sc": sc, "filterType": filterType, "country": country, "rbics": rbics, "hierarchy": second, "tabState": tabState }
    if (history.legnth - 1 === historyCount || historyCount === "") {
      yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
    } else {
      history.splice(historyCount + 1)
      yield put({ type: ForceComponent.types.HISTORY_UPDATE, payload: history });
      yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
      yield put({ type: HeaderComponent.types.COUNT_RESET });
    }
  }
  yield put({ type: HeaderComponent.types.CHANGE_TEXT, payload: fetchData.edit.code })

  const filterForceData = yield call(filterForceAPI, fetchData.arrForce, second, third, rbics, country, filterType, cnList)
  const filterForceData2 = yield call(filterForceAPI, fetchData2.arrForce, second, third, rbics, country, filterType, cnList)
  yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE, payload: { "data": filterForceData } });
  yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE2, payload: { "data": filterForceData2 } });
  if (fetchData.rowData !== undefined && fetchData2.rowData !== undefined) {
    tableArr = fetchData.rowData.concat(fetchData2.rowData)
    tableHeader = fetchData.header
  } else if (fetchData.rowData === undefined) {
    tableArr = fetchData2.rowData
    tableHeader = fetchData2.header
  } else {
    tableArr = fetchData.rowData
    tableHeader = fetchData.header
  }
  yield put({ type: TableComponent.types.TABLE_UPDATED, payload: { "header": tableHeader, "rowData": tableArr } });
}

function* initDataSetup(action) {
  try {
    const data = yield select()

    const quote = data.Header.quote
    const sc = data.Tab.sc
    const cs = sc == "S" ? "C" : "S"

    const hierarchy = data.Hierarchy.hierarchy
    const rbics = data.Filter.rbics
    const country = data.Filter.country
    const filterType = data.Filter.filterType
    const tabState = data.Tab.tabState

    // // パラメータ取得部 ***************************************************************//
    const query = getUrlQueries();
    const power = !query.power ? "0.05" : query.power
    yield put({ type: HeaderComponent.types.SELECT_POWER, payload: power });
    // // *****************************************************************************************//

    const fetchData = yield call(fetchAPI, quote, sc, "quote");
    const cnList = yield call(countryAPI)
    let countryList = Object.values(cnList).sort()
    const rbicsList = yield call(rbicsAPI)


    yield put({ type: ForceComponent.types.GET_FORCE_DATA, payload: { "data": fetchData.arrForce } });
    yield put({ type: ForceComponent.types.GET_DATA, payload: { "data": fetchData.edit } });

    const filterForceData = yield call(filterForceAPI, fetchData.arrForce, hierarchy, hierarchy, rbics, country, filterType, cnList)
    const filterTreeData = yield call(filterTreeAPI, fetchData.edit, hierarchy, hierarchy, rbics, country, filterType, cnList)

    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE, payload: { "data": filterForceData } });
    yield put({ type: ForceComponent.types.DATA_UPDATED, payload: { "data": filterTreeData, "code": fetchData.edit.code, "name": fetchData.edit.name, "country": fetchData.edit.country, "industry": fetchData.edit.industry, "entity": fetchData.edit.entity, "count": fetchData.edit.count } });

    yield put({ type: FilterComponent.types.UPDATE_LIST, payload: { "countryList": countryList, "rbicsList": rbicsList } })

    const historyData = { "quote": fetchData.edit.code, "entity": fetchData.edit.entity, "name": fetchData.edit.name, "sc": sc, "tabState": tabState, "filterType": filterType, "country": country, "rbics": rbics, "hierarchy": hierarchy, "tabState": tabState }
    yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });

    yield put({ type: ForceComponent.types.CHANGE_ENTITY, payload: fetchData.edit.entity });

    let fetchData2 = yield call(fetchAPI, quote, cs, "quote");
    yield put({ type: ForceComponent.types.GET_FORCE_DATA2, payload: { "data": fetchData2.arrForce } });
    yield put({ type: ForceComponent.types.GET_DATA2, payload: { "data": fetchData2.edit } });

    const filterForceData2 = yield call(filterForceAPI, fetchData2.arrForce, hierarchy, hierarchy, rbics, country, filterType, cnList)
    let filterTreeData2 = yield call(filterTreeAPI, fetchData2.edit, hierarchy, hierarchy, rbics, country, filterType, cnList)

    yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE2, payload: { "data": filterForceData2 } });
    yield put({ type: ForceComponent.types.DATA_UPDATED2, payload: { "data": filterTreeData2, "code": fetchData2.edit.code, "name": "", "country": fetchData2.edit.country, "industry": fetchData2.edit.industry, "entity": fetchData2.edit.entity, "count": fetchData2.edit.count } });

    let tableArr = fetchData.rowData.concat(fetchData2.rowData)
    yield put({ type: TableComponent.types.INIT_TABLE_UPDATED, payload: { "header": fetchData.header, "rowData": tableArr, "cnList": cnList } });
    yield put({ type: ForceComponent.types.COMPANY_DATA, payload: { "code": fetchData.edit.code, "name": fetchData.edit.name, "country": fetchData.edit.country, "industry": fetchData.edit.industry, "entity": fetchData.edit.entity } })

  } catch (e) {
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "アプリケーション起動時にエラーが発生しました。", isOpen: true } });
  }
}

function* fetchData() {
  try {
    const data = yield select()

    const quote = data.Header.quote
    const sc = data.Tab.sc
    const cs = sc == "S" ? "C" : "S"
    const hierarchy = data.Hierarchy.hierarchy
    const rbics = data.Filter.rbics
    const country = data.Filter.country
    const filterType = data.Filter.filterType
    const tabState = data.Tab.tabState

    const fetchData = yield call(fetchAPI, quote, sc, "quote");
    
    if (fetchData.length != 0) {
      yield put({ type: ForceComponent.types.CHANGE_ENTITY, payload: fetchData.edit.entity });
      yield call(forceSaga, fetchData, quote, sc, cs, "quote", hierarchy, hierarchy, rbics, country, filterType, tabState);
    } else {
      yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "入力内容を確認してください。データを表示できません。", isOpen: true } });
    }
  } catch (e) {
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "データの取得中にエラーが発生致しました。", isOpen: true } });
  }
}

function* fetchDataTree() {
  try {
    const data = yield select()

    const quote = data.Header.quote
    const sc = data.Tab.sc
    const hierarchy = data.Hierarchy.hierarchy
    const filterType = data.Filter.filterType
    const rbics = data.Filter.rbics
    const country = data.Filter.country
    const tabState = data.Tab.tabState

    const fetchData = yield call(fetchAPI, quote, "S", "quote");
    let fetchData2 = yield call(fetchAPI, quote, "C", "quote");
    
    if (fetchData.length != 0 || fetchData2.length != 0) {
      yield put({ type: ForceComponent.types.CHANGE_ENTITY, payload: fetchData.edit.entity });
      yield call(treeSaga, fetchData, fetchData2, sc, hierarchy, hierarchy, rbics, country, filterType, tabState);
    } else {
      yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "入力欄を確認してください。データを表示できません。", isOpen: true } });
    }
  } catch (e) {
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "データの取得中にエラーが発生致しました。", isOpen: true } });
  }
}

function* menuFetchData() {
  try {
    const data = yield select()

    const entityID = data.Force.entity
    const sc = data.Tab.sc

    const cs = sc == "S" ? "C" : "S"
    const hierarchy = data.Hierarchy.hierarchy
    const rbics = data.Filter.rbics
    const country = data.Filter.country
    const filterType = data.Filter.filterType
    const tabState = data.Tab.tabState

    const fetchData = yield call(fetchAPI, entityID, sc, "entity");

    yield call(forceSaga, fetchData, entityID, sc, cs, "entity", hierarchy, hierarchy, rbics, country, filterType, tabState);

  } catch (e) {
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "データの取得中にエラーが発生致しました。", isOpen: true } });
  }
}

function* changeHistory(actions) {
    const data = yield select()
    const historyCount = data.Header.historyCount
    const history = data.Force.history
    const sc = data.Tab.sc
    const tabState = data.Tab.tabState
    let supplyData = "" 

    if(tabState == 0 || tabState == 1){
      supplyData = sc == "S" ? data.Force.supplyForceAll : data.Force.supplyForceAll2
    } else {
      supplyData = data.Force.supplyAll 
    }

    const historyData = { "quote": supplyData.code, "entity": supplyData.entity, "name": supplyData.name, "sc": sc, "filterType": actions.payload.filterType, "country": actions.payload.country, "rbics": actions.payload.rbics, "hierarchy": actions.payload.hierarchy, "tabState": actions.payload.tabState }
    if (history.legnth - 1 === historyCount || historyCount === "") {
      yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
    } else {
      history.splice(historyCount + 1)
      yield put({ type: ForceComponent.types.HISTORY_UPDATE, payload: history });
      yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
      yield put({ type: HeaderComponent.types.COUNT_RESET });
    }

}

function* menuFetchDataTree() {
  try {
    const data = yield select()

    const entityID = data.Force.entity
    const sc = data.Tab.sc

    const cs = sc == "S" ? "C" : "S"
    const hierarchy = data.Hierarchy.hierarchy
    const rbics = data.Filter.rbics
    const country = data.Filter.country
    const tabState = data.Tab.tabState

    const filterType = data.Filter.filterType
    const fetchData = yield call(fetchAPI, entityID, "S", "entity");
    let fetchData2 = yield call(fetchAPI, entityID, "C", "entity");
    yield put({ type: ForceComponent.types.CHANGE_ENTITY, payload: entityID });
    yield call(treeSaga, fetchData, fetchData2, sc, hierarchy, hierarchy, rbics, country, filterType, tabState);

  } catch (e) {
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "データの取得中にエラーが発生致しました。", isOpen: true } });
  }
}

function* companyData() {
  try {
    const data = yield select()

    const code = data.Force.comParam.code
    const name = data.Force.comParam.name
    const country = data.Force.comParam.country
    const cnList = data.Table.cnList
    const industry = data.Force.comParam.industry
    const entity = data.Force.comParam.entity

    const [companyInfo, rev, employees] = yield all([
      call(companyAPI, code),
      call(revAPI, code),
      call(employeesAPI, code)
    ])

    const companyData = {
      "code": code,
      "name": name,
      "country": cnList[country],
      "industry": industry,
      "entity": entity,
      "data": companyInfo,
      "revInternal": rev.internal,
      "revForeign": rev.foreign,
      "revTotal": rev.total,
      "employees": employees
    };
    yield put({ type: ForceComponent.types.UPDATE_COMPANY, payload: companyData });
  } catch {
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "データの取得中にエラーが発生致しました。", isOpen: true } });
  }
}

function* backData() {
  try {
    const data = yield select()

    const historyCount = data.Header.historyCount
    const history = data.Force.history
    const tabState = history[historyCount].tabState
    const entityID = history[historyCount].entity
    const sc = history[historyCount].sc
    const cs = sc == "S" ? "C" : "S"
    const entity = data.Force.entity

    let hierarchy = data.Hierarchy.hierarchy
    let rbics = data.Filter.rbics
    let country = data.Filter.country
    let filterType = data.Filter.filterType
    if (entityID == entity) {
      if (history[historyCount].filterType !== "" && history[historyCount].filterType !== filterType) yield put({ type: FilterComponent.types.CHANGE_RADIO, payload: history[historyCount].filterType, backCheck: true });
      if (history[historyCount].country !== "" && history[historyCount].country !== country) yield put({ type: filterType == "highlight" ? FilterComponent.types.CHANGE_COUNTRY_ONLY : FilterComponent.types.CHANGE_COUNTRY , payload: history[historyCount].country, backCheck: true });
      if (history[historyCount].rbics !== "" && history[historyCount].rbics !== rbics) yield put({ type:  filterType == "highlight" ? FilterComponent.types.CHANGE_RBICS_ONLY : FilterComponent.types.CHANGE_RBICS , payload: history[historyCount].rbics, backCheck: true });
      if (history[historyCount].hierarchy !== "" && history[historyCount].hierarchy !== hierarchy) yield put({ type: HierarchyComponent.types.CHANGE_HIERARCHY, payload: history[historyCount].hierarchy, backCheck: true });
      if (history[historyCount].tabState !== "" && history[historyCount].tabState !== data.Tab.tabState) yield put({ type: TabComponent.types.CHANGE_TAB, payload: history[historyCount].tabState });
    } else {
      if (history[historyCount].filterType !== "" && history[historyCount].filterType !== filterType) {
        filterType = history[historyCount].filterType
        yield put({ type: FilterComponent.types.CHANGE_RADIO_ONLY, payload: filterType });
      }
      if (history[historyCount].country !== "" && history[historyCount].country !== country) {
        country = history[historyCount].country
        yield put({ type: FilterComponent.types.CHANGE_COUNTRY_ONLY, payload: country });
      }
      if (history[historyCount].rbics !== "" && history[historyCount].rbics !== rbics) {
        rbics = history[historyCount].rbics
        yield put({ type: FilterComponent.types.CHANGE_RBICS_ONLY, payload: rbics });
      }
      if (history[historyCount].hierarchy !== "" && history[historyCount].hierarchy !== hierarchy) {
        hierarchy = history[historyCount].hierarchy
        yield put({ type: HierarchyComponent.types.CHANGE_HIERARCHY_ONLY, payload: hierarchy });
      }

      if (tabState == 0 || tabState == 1) {
        yield put({ type: TabComponent.types.CHANGE_TAB, payload: tabState });
        const fetchData = yield call(fetchAPI, entityID, sc, "entity");
        yield call(forceSaga, fetchData, entityID, sc, cs, "entity", hierarchy, hierarchy, rbics, country, filterType, tabState, true);
        yield put({ type: ForceComponent.types.CHANGE_ENTITY, payload: entityID });
      } else {
        const fetchData = yield call(fetchAPI, entityID, "S", "entity");
        let fetchData2 = yield call(fetchAPI, entityID, "C", "entity");
        yield call(treeSaga, fetchData, fetchData2, sc, hierarchy, hierarchy, rbics, country, filterType, tabState, true);
        yield put({ type: ForceComponent.types.CHANGE_ENTITY, payload: entityID });
      }
    }
  } catch{
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "データの取得中にエラーが発生致しました。", isOpen: true } });
  }
}

function* filterFunc(action) {
  try {
    const data = yield select()

    const supplyAll = data.Force.supplyAll
    const supplyAll2 = data.Force.supplyAll2
    const supplyForceAll = data.Force.supplyForceAll
    const supplyForceAll2 = data.Force.supplyForceAll2
    const tabState = data.Tab.tabState
    const hierarchy = data.Hierarchy.hierarchy
    const filterType = data.Filter.filterType
    const rbics = data.Filter.rbics
    const country = data.Filter.country
    const cnList = data.Table.cnList
    const historyCount = data.Header.historyCount
    const history = data.Force.history
    const sc = data.Tab.sc

    const hisType = action.type
    const hisValue = action.payload

    if (!action.backCheck) {
      let historyData = { "quote": supplyAll.code, "entity": supplyAll.entity, "name": supplyAll.name, "sc": sc, "filterType": "", "country": "", "rbics": "", "filterType": "", "hierarchy": "", "tabState": tabState }
      historyData.filterType = hisType == "CHANGE_RADIO" ? hisValue : filterType
      historyData.country = hisType == "CHANGE_COUNTRY" ? hisValue : country
      historyData.rbics = hisType == "CHANGE_RBICS" ? hisValue : rbics
      historyData.hierarchy = hisType == "CHANGE_HIERARCHY" ? hisValue : hierarchy

      if (history.legnth - 1 === historyCount || historyCount === "") {
        yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
      } else {
        history.splice(historyCount + 1)
        yield put({ type: ForceComponent.types.HISTORY_UPDATE, payload: history });
        yield put({ type: ForceComponent.types.HISTORY_DATA, payload: historyData });
        yield put({ type: HeaderComponent.types.COUNT_RESET });
      }
    }

    if (tabState == 0 || tabState == 1) {
      let filterForceData = yield call(filterForceAPI, supplyForceAll, hierarchy, hierarchy, rbics, country, filterType, cnList)
      let filterForceData2 = yield call(filterForceAPI, supplyForceAll2, hierarchy, hierarchy, rbics, country, filterType, cnList)
      yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE, payload: { "data": filterForceData } });
      yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE2, payload: { "data": filterForceData2 } });
      yield put({ type: ForceComponent.types.COMPANY_DATA, payload: { "code": supplyAll.code, "name": supplyAll.name, "country": supplyAll.country, "industry": supplyAll.industry, "entity": supplyAll.entity } })

      let filterTreeData = yield call(filterTreeAPI, supplyAll, hierarchy, hierarchy, rbics, country, filterType, cnList)
      let filterTreeData2 = yield call(filterTreeAPI, supplyAll2, hierarchy, hierarchy, rbics, country, filterType, cnList)
      yield put({ type: ForceComponent.types.DATA_UPDATED, payload: { "data": filterTreeData, "code": supplyAll.code, "name": supplyAll.name, "country": supplyAll.country, "industry": supplyAll.industry, "entity": supplyAll.entity, "count": supplyAll.count } });
      yield put({ type: ForceComponent.types.DATA_UPDATED2, payload: { "data": filterTreeData2, "code": supplyAll2.code, "name": "", "country": supplyAll2.country, "industry": supplyAll2.industry, "entity": supplyAll2.entity, "count": supplyAll2.count } });

    } else {
      let filterTreeData = yield call(filterTreeAPI, supplyAll, hierarchy, hierarchy, rbics, country, filterType, cnList)
      let filterTreeData2 = yield call(filterTreeAPI, supplyAll2, hierarchy, hierarchy, rbics, country, filterType, cnList)
      yield put({ type: ForceComponent.types.DATA_UPDATED, payload: { "data": filterTreeData, "code": supplyAll.code, "name": supplyAll.name, "country": supplyAll.country, "industry": supplyAll.industry, "entity": supplyAll.entity, "count": supplyAll.count } });
      yield put({ type: ForceComponent.types.COMPANY_DATA, payload: { "code": supplyAll.code, "name": supplyAll.name, "country": supplyAll.country, "industry": supplyAll.industry, "entity": supplyAll.entity } })

      yield put({ type: ForceComponent.types.DATA_UPDATED2, payload: { "data": filterTreeData2, "code": supplyAll2.code, "name": "", "country": supplyAll2.country, "industry": supplyAll2.industry, "entity": supplyAll2.entity, "count": supplyAll2.count } });

      let filterForceData = yield call(filterForceAPI, supplyForceAll, hierarchy, hierarchy, rbics, country, filterType, cnList)
      let filterForceData2 = yield call(filterForceAPI, supplyForceAll2, hierarchy, hierarchy, rbics, country, filterType, cnList)
      yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE, payload: { "data": filterForceData } });
      yield put({ type: ForceComponent.types.DATA_UPDATED_FORCE2, payload: { "data": filterForceData2 } });
    }
  } catch (e) {
    yield put({ type: MessageComponent.types.USER_FETCH_FAILED, payload: { message: "データ処理時にエラーが発生致しました。", isOpen: true } });
  }
}

function* download() {
  yield TableComponent.gridApi.exportDataAsCsv()
}
function* rootSaga() {
  yield takeLatest(HeaderComponent.types.FETCH_DATA, fetchData)
  yield takeLatest(HeaderComponent.types.FETCH_DATA_TREE, fetchDataTree)
  yield takeLatest(ForceComponent.types.CHANGE_FETCH_DATA, menuFetchData)
  yield takeLatest(TabComponent.types.CHNAGE_TAB_HISTORY, changeHistory)
  yield takeLatest(FilterComponent.types.CHANGE_COUNTRY_HIGHLIGHT, changeHistory)
  yield takeLatest(FilterComponent.types.CHANGE_RBICS_HIGHLIGHT, changeHistory)
  yield takeLatest(ForceComponent.types.CHANGE_FETCH_DATA_TREE, menuFetchDataTree)
  yield takeLatest(ForceComponent.types.COMPANY_DATA, companyData)
  yield takeLatest(HierarchyComponent.types.CHANGE_HIERARCHY, filterFunc)
  yield takeLatest(FilterComponent.types.CHANGE_RADIO, filterFunc)
  yield takeLatest(FilterComponent.types.CHANGE_RBICS, filterFunc)
  yield takeLatest(FilterComponent.types.CHANGE_COUNTRY, filterFunc)
  yield takeEvery(HeaderComponent.types.HISTORY, backData)
  yield takeEvery(OutputButtonComponent.types.CSV_DOWNLOAD, download)
  yield takeEvery(HeaderComponent.types.INIT_DATA_SETUP, initDataSetup)
}
sagaMiddleware.run(rootSaga)

// --------------
// api
// --------------

const companyAPI = async (value) => {
  if (value == "") return ""
  const code = encodeURIComponent(value)

  const getdata = await fetch(`${URL_API}companyInfo.do?code=${code}`)
  const response = await getdata.json()

  if (!response["B"]["AB0001"]["TBI"][0]["DTA"][0]["E"]) {
    return ""
  }

  const info = response["B"]["AB0001"]["TBI"][0]["DTA"][0]["E"][0]["ELD"]

  return info
}

const revAPI = async (value) => {
  if (value == "") return {"internal": "", "foreign": "", "total": ""}
  const code = encodeURIComponent(value)
 
  const getRev = await fetch(`${URL_API}revenue.do?code=${code}`)
  const resRev = await getRev.json()

  if (!resRev["B"]["AB0001"]["TBI"][0]["DTA"][0]["E"]) {
    return {"internal": "", "foreign": "", "total": ""}
  }
  const resRevlength = resRev["B"]["AB0001"]["TBI"][0]["DTA"].length - 1
  const revArr = resRev["B"]["AB0001"]["TBI"][0]["DTA"][resRevlength]["E"]
  let internal = 0
  let foreign = 0
  for(let i = 0; i < 10; i++){
    if(revArr[i]["ELD"] !== "") {
      revArr[i]["ELD"] == "Japan" ? internal = revArr[i+10]["ELD"] : foreign = foreign + Number(revArr[i+10]["ELD"])
    }
  }
  let total = Math.round(Number(internal) + Number(foreign)).toLocaleString()
  internal = internal !== 0 ? Math.round(internal).toLocaleString() : ""
  foreign = foreign !== 0 ? Math.round(foreign).toLocaleString() : ""
  return {"internal": internal, "foreign": foreign, "total": total}
}

const employeesAPI = async (value) => {
  if (value == "") return ""
  const code = encodeURIComponent(value)

  const getEmployees = await fetch(`${URL_API}employees.do?code=${code}`)
  const resEmployees = await getEmployees.json()

  if (!resEmployees["B"]["AB0001"]["TBI"][0]["DTA"][0]["E"]) {
    return ""
  }

  const employees = resEmployees["B"]["AB0001"]["TBI"][0]["DTA"][0]["E"][0]["ELD"] === "" ? "" : Number(resEmployees["B"]["AB0001"]["TBI"][0]["DTA"][0]["E"][0]["ELD"]).toLocaleString()

  return employees
}

const rbicsAPI = async () => {
  const getdata = await fetch(`${URL_API}rbicsList.do`)
  const response = await getdata.json()

  let list = [];
  const data = response["B"]["AB0001"]["TBI"][0]["DTA"]
  for (let i = 0; i < data.length; i++) {
    list.push(data[i]["E"][0]["ELD"])
  }
  return list
}

const countryAPI = async () => {
  const getdata = await fetch(`${URL_API}countryList.do`)
  const response = await getdata.json()
  let list = {};
  const data = response["B"]["AB0001"]["TBI"][0]["DTA"]
  for (let i = 0; i < data.length; i++) {
    list[data[i]["E"][0]["ELD"]] = data[i]["E"][1]["ELD"]
  }

  return list
}

const fetchAPI = async (param, sc, check) => {
  let quoteCode, getdata;
  if (check == "quote") {
    quoteCode = param.slice(0, 1) == "E" ? param.slice(1, 5) : param
    getdata = await fetch(`${URL_API}supplyChainData.do?SC=${sc}&code=${quoteCode}`)
  } else {
    getdata = await fetch(`${URL_API}supplyChainData.do?SC=${sc}&entity=${param}`)
  }

  const json = await getdata.json()

  //jsonの中身がcsv形式になってるので配列化
  const data = json["B"]["ABC11"]["RSD"]

  let tempArray = data.split("\n");
  let csvArray = new Array();
  for (let i = 0; i < tempArray.length; i++) {
    csvArray[i] = tempArray[i].split("	");
  }
  if (csvArray[0][1] != "A00") return []

  let header = csvArray[2]
  csvArray.shift();
  csvArray.shift();
  csvArray.shift();
  csvArray.pop();

  //force用のデータ変換
  let arrForce = await dataForce(csvArray)

  //得たデータを 0_Name 1_Name 2_Name　でつながるように整形
  let arr = await dataArr(csvArray)
  let edit = await dataEdit(arr.res, arr.name, arr.code, arr.entity, arr.country, arr.industry)

  let tableArr = []
  if (sc == "S") {
    arr.rowData.map((value) => {
      value.unshift("サプライヤー")
      tableArr.push(value)
    })
  } else {
    arr.rowData.map((value) => {
      value.unshift("カスタマー")
      tableArr.push(value)
    })
  }

  return { "edit": edit, "arrForce": arrForce, "rowData": tableArr, "header": header }
}

// 1_Name 2_Nameを取り出して配列に突っ込む 
const dataArr = async (csvArray) => {
  let res = [];
  let arr = [];
  let rowRes = [];
  let rowArr = []

  for (let count = 0; count < csvArray.length; count++) {
    arr.push(csvArray[count][31])
    arr.push(csvArray[count][63])
    arr.push(csvArray[count][25])
    arr.push(csvArray[count][57])
    arr.push(csvArray[count][29])
    arr.push(csvArray[count][61])
    arr.push(csvArray[count][33])
    arr.push(csvArray[count][65])
    arr.push(csvArray[count][43])
    arr.push(csvArray[count][75])
    arr.push(csvArray[count][47])
    arr.push(csvArray[count][79])
    res.push(arr)
    arr = []

    rowArr.push(csvArray[count][3])
    rowArr.push(csvArray[count][7])
    rowArr.push(csvArray[count][9])
    rowArr.push(csvArray[count][17])
    rowArr.push(csvArray[count][19])
    rowArr.push(csvArray[count][21])
    rowArr.push(csvArray[count][25])
    rowArr.push(csvArray[count][31])
    rowArr.push(csvArray[count][33])
    rowArr.push(csvArray[count][41])
    rowArr.push(csvArray[count][43])
    rowArr.push(csvArray[count][45])
    rowArr.push(csvArray[count][53])
    rowArr.push(csvArray[count][57])
    rowArr.push(csvArray[count][63])
    rowArr.push(csvArray[count][65])
    rowArr.push(csvArray[count][73])
    rowArr.push(csvArray[count][75])
    rowArr.push(csvArray[count][77])
    rowArr.push(csvArray[count][85])
    rowRes.push(rowArr)
    rowArr = []
  }
  return { "res": res, "rowData": rowRes, "name": csvArray[0][7], "code": csvArray[0][1], "entity": csvArray[0][5], "country": csvArray[0][9], "industry": csvArray[0][19] }
}

const dataEdit = (target, parent, parentCode, parentEntity, parentCountry, parentIndustry) => {
  if (target.length == 0) return { "name": parent, "code": parentCode, "entity": parentEntity, "country": parentCountry, "industry": parentIndustry, "children": "" }
  let child = {}
  let grandChild = {}
  let result = {}
  let childArr = []
  let grandChildArr = []
  let text = target[0][0]
  let code = target[0][2]
  let entity = target[0][4]
  let country = target[0][6]
  let industry = target[0][8]
  let i
  for (i = 0; i < target.length; i++) {
    if (target[i][0] == text) {
      if (target[i][1] !== "") {
        grandChild = {
          "name": target[i][1],
          "code": target[i][3],
          "entity": target[i][5],
          "country": target[i][7],
          "industry": target[i][9]
        }
        grandChildArr.push(grandChild)
      }
    } else {
      if (grandChildArr.length !== 0) {
        child = {
          "name": text,
          "code": code,
          "entity": entity,
          "country": country,
          "industry": industry,
          "children": grandChildArr
        }
      } else {
        child = {
          "name": text,
          "code": code,
          "entity": entity,
          "country": country,
          "industry": industry
        }
      }
      childArr.push(child)
      text = target[i][0]
      code = target[i][2]
      entity = target[i][4]
      country = target[i][6]
      industry = target[i][8]
      grandChildArr = []
      if (target[i][1] !== "") {
        grandChild = {
          "name": target[i][1],
          "code": target[i][3],
          "entity": target[i][5],
          "country": target[i][7],
          "industry": target[i][9],
        }
        grandChildArr.push(grandChild)
      }
    }
  }
  if (grandChildArr.length !== 0) {
    child = {
      "name": text,
      "code": code,
      "entity": entity,
      "country": country,
      "industry": industry,
      "children": grandChildArr
    }
  } else {
    child = {
      "name": text,
      "code": code,
      "entity": entity,
      "country": country,
      "industry": industry
    }
  }
  childArr.push(child)
  result = {
    "name": parent,
    "code": parentCode,
    "entity": parentEntity,
    "country": parentCountry,
    "industry": parentIndustry,
    "children": childArr,
    "count": i
  }
  return result
}

// Force用データ変換
const dataForce = async (csvArray) => {
  let res = [];
  let res1 = [];
  let res2 = [];
  let arr = [];
  let arr1 = {};
  let arr2 = {};

  for (let count = 0; count < csvArray.length; count++) {
    arr.push(csvArray[count][31])
    arr.push(csvArray[count][63])
    res.push(arr)

    arr1.name = csvArray[count][31]
    arr1.code = csvArray[count][25]
    arr1.country = csvArray[count][33]
    arr1.entity = csvArray[count][29]
    arr1.industry = csvArray[count][43]

    arr2.name = csvArray[count][63]
    arr2.code = csvArray[count][57]
    arr2.country = csvArray[count][65]
    arr2.entity = csvArray[count][61]
    arr2.industry = csvArray[count][75]

    res1.push(arr1)
    res2.push(arr2)
    arr = []
    arr1 = {}
    arr2 = {}
  }

  return { "res": res, "res1": res1, "res2": res2, "name": csvArray[0][7], "code": csvArray[0][1], "country": csvArray[0][9], "entity": csvArray[0][5], "industry": csvArray[0][19] }
}
// --------------
// Filter
// --------------

const filterTreeAPI = async (tree, second, third, rbics, country, filterType, cnList) => {
  if (tree === undefined || tree.entity === "") return []
  let data = JSON.parse(JSON.stringify(tree.children));
  let regex = new RegExp(/^[0-9]+$/);

  //　国フィルタ
  if (country != "" && country != "国" && filterType == "filter") {
    let filCn = data.filter(function (item, index) {
      if (cnList[item.country] == country) return true;
    });

    for (let i = 0; i < filCn.length; i++) {
      let childArr = "";
      if (filCn[i].children) {
        childArr = filCn[i].children.filter(function (item, index) {
          if (cnList[item.country] == country) return true;
        });
        filCn[i].children = childArr
      }
    };
    data = filCn
  }

  //　業種フィルタ
  if (rbics != "" && rbics != "業種" && filterType == "filter") {
    let filRb = data.filter(function (item) {
      if (item.industry == rbics) return true;
    });

    for (let i = 0; i < filRb.length; i++) {
      let childArr = "";
      if (filRb[i].children) {
        childArr = filRb[i].children.filter(function (item) {
          if (item.industry == rbics) return true;
        });
        filRb[i].children = childArr
      }
    };
    data = filRb
  }
  return data
}

const filterForceAPI = async (force, second, third, rbics, country, filterType, cnList) => {
  if (force === undefined || force.length === 0) return []
  let target = JSON.parse(JSON.stringify(force.res));
  let target1 = JSON.parse(JSON.stringify(force.res1));
  let target2 = JSON.parse(JSON.stringify(force.res2));
  let parent = force.name
  let regex = new RegExp(/^[0-9]+$/);

  let nodes = [{ "id": parent, "group": 0, "code": force.code, "country": force.country, "entity": force.entity, "industry": force.industry }];
  let links = [];

  // 1階層目重複削除
  let company_first = target1.filter(function (x, i, self) {
    return (self.findIndex(function (v) {
      return (x.name === v.name)
    }) === i);
  });

  // 2段階目重複削除
  let company_second = target2.filter(function (x, i, self) {
    return (self.findIndex(function (v) {
      return (x.name === v.name)
    }) === i);
  });



  // country フィルタ
  if (country != "" && country != "国" && filterType == "filter") {
    company_first = company_first.filter(function (item) {
      if (cnList[item.country] == country) return true;
    });

    company_second = company_second.filter(function (item) {
      if (cnList[item.country] == country) return true;
    });
  }
  // rbics フィルタ
  if (rbics != "" && rbics != "業種" && filterType == "filter") {
    company_first = company_first.filter(function (item) {
      if (item.industry == rbics) return true;
    });

    company_second = company_second.filter(function (item) {
      if (item.industry == rbics) return true;
    });
  }

  // 第1階層フィルタ
  if (second != "" && regex.test(second)) {
    company_first = company_first.slice(0, second)
  }

  // link 1段階 → 2段階の中で 1段階から削除された企業のlinkも削除
  if (company_first.length == 0) return { "nodes": nodes, "links": links }

  target = target.filter(function (val) {
    return (company_first.findIndex(function (v) {
      return (val[0] === v.name)
    }) !== -1);
  });

  target = target.filter(function (val) {
    return (company_second.findIndex(function (v) {
      return (val[1] === v.name)
    }) !== -1);
  });


  // 第2階層 数フィルタ
  if (target.length != 0) {
    let c = 0
    let fname = target[0][0]

    if (third === "0") {
      target = []
    } else if (third != "" && regex.test(third)) {
      target = target.filter(function (val) {
        if (fname == val[0]) {
          c++
          return c <= third ? true : false
        }
        fname = val[0]
        c = 1
        return true
      })
    }
  }


  // 第2階層 不要なnode削除
  company_second = company_second.filter(function (val) {
    return (target.findIndex(function (v) {
      return (val.name === v[1])
    }) !== -1);
  });

  // 2段階目で1段階目と重複のものを削除
  company_second = company_second.filter(function (val) {
    return (company_first.findIndex(function (v) {
      return (val.name === v.name)
    }) == -1);
  });


  //　idに会社名 groupに階層
  company_first.map((value) => {
    if (value.name != "" && value.name != parent) nodes.push({ "id": value.name, "group": 1, "code": value.code, "country": value.country, "entity": value.entity, "industry": value.industry })
  })
  company_second.map((value) => {
    if (value.name != "" && value.name != parent) nodes.push({ "id": value.name, "group": 2, "code": value.code, "country": value.country, "entity": value.entity, "industry": value.industry })
  })
  //　主企業から1階層目へのパス
  company_first.map((value) => {
    if (value.name != "") links.push({ "source": parent, "target": value.name })
  })

  // 1階層目から2階層目へのパス
  target.map((value) => {
    if (value[0] != "" && value[1] != "") links.push({ "source": value[0], "target": value[1] })
  })

  return { "nodes": nodes, "links": links }
}

export default () =>
  <div className="view">
    <style jsx global>{`
      body {
          margin: 0;
          user-select: none;
          min-width: 1100px;
          min-height: 600px;
      }
      .view{
        height: 100vh;
      }
      .ReactModal__Overlay {
        z-index: 2
      }
  `}</style>
    <Provider store={store}>
      <HeaderComponent.view />
      <TabComponent.view />
      <InfoComponent.view />
      <HierarchyComponent.view />
      <OutputButtonComponent.view />
      <MessageComponent.view />
    </Provider>
  </div>