import React, { useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

import { configureStore } from 'redux-starter-kit';
import { StoreContext, useDispatch, useMappedState } from 'redux-react-hook';

import createSagaMiddleware from 'redux-saga';

import { CssBaseline, CircularProgress, Box,　Button, Checkbox, Paper, Grid, Tabs, Tab, InputBase, Link } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { blue, yellow } from '@material-ui/core/colors';

import rootReducer from '../rootReducer';
import rootSaga from '../rootSaga';
import useStyles from '../useStyles';
import appModule from '../modules/appModule';
import analystModule from '../modules/analystModule';
import publicInfoModule from '../modules/publicInfoModule';
import TabSwitch from '../components/TabSwitch';

// --------------
// saga
// --------------
const sagaMiddleware = createSagaMiddleware()

// --------------
// store
// --------------
const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
});

// --------------
// saga run
// --------------
sagaMiddleware.run(rootSaga);

// --------------
// Main View 
// --------------
const subwindows = [];

function isQRContainer() {
  var undefined;
  if (external === undefined || external.QUICKApplicationName === undefined) {
    return false;
  } else {
    return external.QUICKApplicationName.indexOf("QRContainer.exe") != -1;
  }
};

const App = () => {

  const mapState = useCallback(state => ({
    loading: state.app.loading,
    tabsInfo: state.app.tabsInfo,
    keyword: state.app.keyword,
    brand: state.app.brand,
    type: state.app.type,
    textDispChecked: state.app.textDispChecked,
    pdfSubWindows: state.app.pdfSubWindows,
    anaParamsLoaded: state.analyst.pageParamsLoaded,
    pubParamsLoaded: state.publicInfo.pageParamsLoaded,
    brandDisabled: state.app.brandDisabled,
    keywordDisabled: state.app.keywordDisabled,
    resetDisabled: state.app.resetDisabled,
    changeDispDisabled: state.app.changeDispDisabled
  }), []);
  const { loading, tabsInfo, keyword, brand, type, textDispChecked, pdfSubWindows, anaParamsLoaded, pubParamsLoaded, brandDisabled, keywordDisabled, resetDisabled, changeDispDisabled } = useMappedState(mapState);
  const recordType = {
    1: 'RECORD/FETCH',
    2: 'PUB/RECORD/FETCH'
  }
  const paramsType = {
    1: 'PARAM/FETCH',
    2: 'PUB/PARAM/FETCH'
  }
  const paramsLoaded = {
    1: anaParamsLoaded,
    2: pubParamsLoaded
  }

  const classes = useStyles();
  const dispatch = useDispatch();
  const textInput = useRef(null);
  const router = useRouter();

  useEffect(() => {
    dispatch({type: 'TABS/FETCH'});
  },[]);

  useEffect(() => {
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    const enabled = isQRContainer() ? external.notify("?closeAllChildren", "") : false;
    const len = pdfSubWindows.length;
    if (len > 0) {
      const pdfSubWindow = pdfSubWindows[len - 1];
      if (isIE) {
        subwindows[len - 1] = window.open(`pdf.html?link=${encodeURIComponent(pdfSubWindow)}`, pdfSubWindow);
      } else {
        subwindows[len - 1] = window.open(pdfSubWindow);
      }
    }

    const onbeforeunloadfn = () => {
      for(let ele of subwindows) {
        try {
          // インタフェース存在確認
          if (enabled) {
            // 子ウィンドウを閉じる
            external.notify('closeAllChildren', "");
          } else {
            ele.close();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    window.addEventListener('beforeunload', onbeforeunloadfn);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunloadfn)
    }
  },[pdfSubWindows]);

  useEffect(() => {
    textInput.current.focus();
  },[type]);

  useEffect(() => {
    let code = router.query.code || '';
    if (code != brand) {
      dispatch(appModule.actions.handleOnChange({key: 'brand', value: code}));
      if (loading === false) {
        paramsLoaded[type] === true
          ? dispatch({type: recordType[type], payload: {page: 0, type: 'new'}})
          : dispatch({type: paramsType[type]});
        dispatch(appModule.actions.setSearchInit({ type: type }));
      }
    }
  }, [router.query.code]);
  
  return (
    <Box display='flex'  flexDirection='column' style={{height: '100vh', padding: 8}}>
    
      <Grid container spacing={1} alignItems="center">
        <Grid item style={{ width: '200px' }}>
          <Paper style={{ padding: 8 }}>
            <InputBase
              placeholder='コード'
              style={{ width: "100%" }}
              type="search"
              onChange={(e) => {
                dispatch(appModule.actions.handleOnChange({key: 'brand', value: e.target.value}));
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  let query = {};
                  if (brand.length > 0) query['code'] = brand;
                  router.push({
                    pathname: '/',
                    query: query
                  }, {
                    pathname: location.pathname,
                    query: query
                  }, {
                    shallow: true
                  })
                  dispatch({type: recordType[type], payload: {page: 0, type: 'new'}});
                  dispatch(appModule.actions.setSearchInit({ type: type }));
                  e.preventDefault();
                }
              }}
              value={brand}
              disabled={brandDisabled}
            />
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper style={{ padding: 8 }}>
            <InputBase
              placeholder='キーワード'
              style={{ minWidth: '180px', width: "100%" }}
              type="search"
              inputRef={textInput}
              onChange={(e) => {dispatch(appModule.actions.handleOnChange({key: 'keyword', value: e.target.value}))}}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  dispatch({type: recordType[type], payload: {page: 0, type: 'new'}});
                  dispatch(appModule.actions.setSearchInit({ type: type }));
                  e.preventDefault();
                }
              }}
              value={keyword}
              disabled={keywordDisabled}
            />
          </Paper>
        </Grid>
        <Grid item xs={'auto'}>
          <Checkbox
            id='change_display'
            checked={textDispChecked}
            color='primary' 
            onClick={() => {
              if(textDispChecked){
                dispatch(appModule.actions.handleDisplay({ display: {display: 'none'}, checked: false }));
              }else{
                dispatch(appModule.actions.handleDisplay({ display: {display: 'block'}, checked: true }));
              }
            }}
            disabled={changeDispDisabled}
          />
          <label style={{ marginRight: '8px' }} htmlFor='change_display'>本文表示</label>
        </Grid>
        <Grid item style={{ width: '100px' }}>
          <Button
            className={classes.button}
            color='primary'
            variant="contained"
            onClick={() => {
              router.push({
                pathname: '/',
              }, {
                pathname: location.pathname,
              }, {
                shallow: true
              })
              dispatch(appModule.actions.reset());
              dispatch(analystModule.actions.reset());
              dispatch(publicInfoModule.actions.reset());
              dispatch({type: recordType[type], payload: {page: 0, type: 'new'}});
              dispatch(appModule.actions.setSearchInit({ type: type }));
            }}
            disabled={resetDisabled}
          >
            リセット
          </Button>
        </Grid>
        <Grid item>
          <Box my={1} style={{ width: '4rem' }}>
            <Link
              onClick={() => {
                dispatch(appModule.actions.addPdfSubWindows({value: `help.pdf`}));
              }}
              href={'#'}
              color='secondary'>ヘルプ</Link>
          </Box>
        </Grid>
      </Grid>

      {loading != false ?
        <div className={classes.loading}>
          <CircularProgress color='primary' />
          <div>
            Now Loading...
          </div>
        </div>
        :
        <React.Fragment>
          <Tabs
            value={type}
            onChange={(event, newValue) => {
              dispatch(appModule.actions.handleOnChange({key: 'type', value: newValue}));
            }}
            aria-label="simple tabs example"
          >
            { tabsInfo[1] ? <Tab label="アナリストレポート" value={1} /> : null }
            { tabsInfo[2] ? <Tab label="企業公開情報" value={2} /> : null }
          </Tabs>

          <TabSwitch 
            type={type}
            tabsInfo={tabsInfo}
          />
        </React.Fragment>
      }

    </Box>
  )
}


const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
    primary: blue,
    secondary: yellow,
  },
  typography: {
    fontFamily: 'Arial',
  }
});


export default () =>
  <ThemeProvider theme={theme}>
    <StoreContext.Provider value={store}>
      <CssBaseline />
      <App />
    </StoreContext.Provider>
  </ThemeProvider>
