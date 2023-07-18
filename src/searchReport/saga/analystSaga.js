import { takeLatest, takeEvery, put, select, call } from 'redux-saga/effects';
import Api from '../src/analystApi'

import analystModule from '../modules/analystModule'
import appModule from '../modules/appModule'

export function* paramSaga() {
  yield takeLatest('PARAM/FETCH', function* getParam() {
    yield put({
      ...analystModule.actions.toggleLoading(),
      payload: true
    });
    const co = yield select(state => state.app.co);
    const {
      astKey,
      settings
    } = yield call(Api.fetchParams, co);
    if (!astKey) {
      yield put({
        ...analystModule.actions.toggleLoading(),
        payload: false
      });
      yield put({
        ...appModule.actions.setTabsInfo(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setBrandDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setKeywordDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setChangeDispDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setResetDisabled(),
        payload: {}
      });
      alert('本画面は表示されません')
      return;
    }
    yield put({
      ...analystModule.actions.setKeys(),
      payload: astKey
    });
    yield put({
      ...analystModule.actions.setParams(),
      payload: settings
    });
    yield put({
      ...analystModule.actions.setParamsLoaded(),
      payload: true
    });
    yield put({
      type: 'RECORD/FETCH',
      payload: {
        page: 0,
        type: 'new'
      }
    });
  })
}

export function* fetchSaga() {
  yield takeLatest('RECORD/FETCH', function* fetchFunc(p) {
    yield put({
      ...analystModule.actions.toggleLoading(),
      payload: true
    });
    const keyword = yield select(state => state.app.keyword);
    const brand = yield select(state => state.app.brand);
    const astKey = yield select(state => state.analyst.astKey);
    const lang = yield select(state => state.analyst.ui.language);
    const kikan = yield select(state => state.analyst.ui.kikan);
    const rangeType = yield select(state => state.analyst.ui.rangeType);
    const startDate = yield select(state => state.analyst.ui.startDate);
    const endDate = yield select(state => state.analyst.ui.endDate);
    const term = yield select(state => state.analyst.ui.term);
    const params = yield select(state => state.analyst.params);
    const record = yield select(state => state.analyst.record);
    const page = p.payload.page;
    const type = p.payload.type;
    const currentLastExactData = type === "new" ? '' : yield select(state => state.analyst.nextFetchParams.lastExactData);
    const currentNewsIDList = type === "new" ? '' : yield select(state => state.analyst.nextFetchParams.newsIDList);

    let dnoArray = [];
    let dnoText = [];
    let industoryArray = [];
    let industoryText = [];
    let fromco = [];
    let fromcoText = [];

    for (let param in params) {
      params[param].map(obj => {
        if (obj.mode === 3 && obj.checked === true) {
          dnoArray.push(obj.id);
          dnoText.push(obj.label)
        } else if (obj.mode === 4 && obj.checked === true) {
          industoryArray.push(obj.id);
          industoryText.push(obj.label)
        } else if (obj.mode === 6 && obj.checked === true) {
          fromco.push(obj.id)
          fromcoText.push(obj.label)
        }
      })
    }

    const start = [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()]
    const end = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()]
  
    // スペース(半角スペース、全角スペースどちらも)を*に変換する
    let convertedKeyword = keyword.trim();
    convertedKeyword = encodeURIComponent(convertedKeyword.replace(/([\u3000]|\s)+/g, '*'));

    const json = {
      'lang': lang,
      'kikan': kikan,
      'rangeType': rangeType, 
      'dno': dnoArray,
      'industory': industoryArray,
      'fromco': fromco,
      'astKey': astKey,
      'currentLastExactData': currentLastExactData,
      'currentNewsIDList': currentNewsIDList,
      'keyword': convertedKeyword,
      'brand': brand
    }

    const displayTextArray = [
      {'3': dnoText},
      {'4': industoryText},
      {'6': fromcoText}
    ]

    if (rangeType === 1 ) {
      json['term'] = term;
    } else {
      json['startDate'] = start;
      json['endDate'] = end;
    }

    yield put({
      ...analystModule.actions.setFilterTextDisplay({ value: displayTextArray })
    })

    if (type === "new" || !record[page]) {
      const {
        responseRecords,
        nextData,
        lastExactData,
        newsIDList
      } = yield call(Api.fetchRecords, json);
      if (!responseRecords) {
        yield put({
          ...analystModule.actions.toggleLoading(),
          payload: false
        });
        yield put({
          ...appModule.actions.setTabsInfo(),
          payload: {}
        });
        yield put({
          ...appModule.actions.setBrandDisabled(),
          payload: {}
        });
        yield put({
          ...appModule.actions.setKeywordDisabled(),
          payload: {}
        });
        yield put({
          ...appModule.actions.setChangeDispDisabled(),
          payload: {}
        });
        yield put({
          ...appModule.actions.setResetDisabled(),
          payload: {}
        });
        alert('本画面は表示されません')
        return;
      }

      yield put({
        ...analystModule.actions.setRecord(),
        payload: {
          type: type,
          record: responseRecords,
          page: page,
          nextFetchParams: {
            lastExactData: lastExactData,
            newsIDList: newsIDList,
            nextData: nextData
          }
        }
      });
    } else {
      yield put({
        ...analystModule.actions.setRecord(),
        payload: {
          page: page
        }
      })
    };
    yield put({
      ...analystModule.actions.toggleLoading(),
      payload: false
    });
  })
}

export function* loadDetail() {
  yield takeEvery("DETAIL/FETCH", function* myf(action) {
    const page = action.payload.page;
    const index = action.payload.index;

    yield put({
      ...analystModule.actions.detailStatus(),
      payload: { page: page, index: index, loading: "started" },
    });
    const astKey = yield select((state) => state.analyst.astKey);
    const detailRecord = yield call(
      Api.fetchDetails,
      action.payload.url,
      astKey
    );
    yield put({
      ...analystModule.actions.detail(),
      payload: { page: page, index: index, body: detailRecord },
    });
    yield put({
      ...analystModule.actions.detailStatus(),
      payload: { page: page, index: index, loading: "loaded" },
    });
  });
}
