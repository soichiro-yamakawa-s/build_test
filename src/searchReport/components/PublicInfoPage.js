import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Grid, Link } from '@material-ui/core';
import { VariableSizeList as List } from 'react-window';
import React, { useContext, useEffect, useCallback, useRef, useState } from 'react';
import { StoreContext, useDispatch, useMappedState } from 'redux-react-hook';
import AutoSizer from 'react-virtualized-auto-sizer';
import { format } from 'date-fns';

import appModule from '../modules/appModule';
import publicInfoModule from '../modules/publicInfoModule';
import PublicInfoFilter from './PublicInfoFilter';
import useStyles from '../useStyles';

const FilterTextDisplay = () => {
  const mapState = useCallback(state => ({
    displayText: state.publicInfo.displayText,
    lang: state.publicInfo.ui.language,
    kikan: state.publicInfo.ui.kikan,
    term: state.publicInfo.ui.term,
    rangeType: state.publicInfo.ui.rangeType,
    startDate: state.publicInfo.ui.startDate,
    endDate: state.publicInfo.ui.endDate
  }), []);
  const { displayText, lang, kikan, term, rangeType, startDate, endDate } = useMappedState(mapState);
  const classes = useStyles();
  
  const itemNaming = {
    checkList: {
      2: "公開情報種別",
      4: "業種"
    },
    language: {
      0: "和文",
      1: "英文",
      2: "和文/英文"
    },
    kikan: {
      1: "配信日",
      2: "発行日"
    },
    term: {
      4: "全期間",
      1: "本日",
      2: "1週間",
      3: "1か月",
      5: "3か月"
    },
    rangeType: {
      1: "過去分",
      2: "範囲"
    }
  }
  
  return (
    <p className={classes.TextTitleSpan}>
      {
        displayText.map(text => {
          const key = Object.keys(text);
          if (text[key].length === 0) return null;
          else if (text[key].length === 1) {
            return (
              <React.Fragment key={text[key]}>
                <span className={classes.TextTitle}>{itemNaming.checkList[key] + ": "}</span><span>{text[key][0]}&nbsp;</span>
              </React.Fragment>
            )
          } else {
            const minLengthWord = text[key].reduce((a, b) => {
              return a.length <= b.length ? a : b;
            });
            return (
              <React.Fragment key={text[key]}>
                <span className={classes.TextTitle}>{itemNaming.checkList[key] + ": "}</span><span>{minLengthWord}など&nbsp;</span>
              </React.Fragment>
            )
          }
        })
      }
      <span className={classes.TextTitle}>言語: </span><span>{itemNaming.language[lang]}&nbsp;</span>
      <span className={classes.TextTitle}>日付種別: </span><span>{itemNaming.kikan[kikan]}&nbsp;</span>
      <span className={classes.TextTitle}>日付: </span><span>{
          rangeType === 1 ? 
          itemNaming.rangeType[rangeType] + itemNaming.term[term] :
          format(new Date(startDate), "yyyy/MM/dd") + ' ~ ' + format(new Date(endDate), "yyyy/MM/dd")
      }
      </span>
    </p>
  )
}

const FilterDialog = props => {
  const mapState = useCallback(state => ({
    dialogState: state.publicInfo.filterDialog,
  }), []);

  const { dialogState } = useMappedState(mapState);
  const dispatch = useDispatch();

  return (
    <Dialog
      fullWidth={true}
      onClose={() => {
        dispatch(publicInfoModule.actions.toggleFilterDialog({value: false}));
      }}
      aria-labelledby="customized-dialog-title"
      open={dialogState}>
        <DialogTitle id="customized-dialog-title" onClose={() => dispatch(publicInfoModule.actions.toggleFilterDialog({value: false}))}>
          条件指定
        </DialogTitle>
        <DialogContent dividers>
          <PublicInfoFilter />
        </DialogContent>
        <DialogActions>
          <Button
            color='primary' 
            onClick={() => {
              dispatch(publicInfoModule.actions.toggleFilterDialog({value: false}));
            }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={() => {
              dispatch(publicInfoModule.actions.saveFilterDialogSettings({value: false}));
              dispatch(publicInfoModule.actions.toggleFilterDialog({value: false}));
              dispatch({ type:'PUB/RECORD/FETCH', payload: {page: 0, type: 'new'} });
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
  )
}

const Row = ({index, style, data}) => {
    const { app, publicInfo } = useContext(StoreContext).getState()
    const display = app.display;
    const textDispChecked = app.textDispChecked;
    const astKey = publicInfo.astKey;
    const page = publicInfo.page;
    const showMore = data[index].more;

    const [moreLink, setMoreLink] = useState(false);
    const [rowHeight, setRowHeight] = useState('');

    const dispatch = useDispatch();
    
    useEffect(() => {
      if (!data[index].detail) {
        if (data[index].load !== 'started' && data[index].load !== 'loaded') {
          dispatch({ type: 'PUB/DETAIL/FETCH', payload: {page: page, index: index, url: data[index].news }});
        }
      }
    }, [data[index]]);
    
      return (
        <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
        <div style={{fontSize: '12px'}}> {data[index].date}  </div>
        <div style={{fontSize: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: "pointer"}}>
          <Link 
            component="span"
            onClick={() => {
              dispatch(appModule.actions.addPdfSubWindows({value: `/home/member/TF/astram/root/${data[index].pdf}&${astKey}`}));
            }}
            color='secondary'>{data[index].title}</Link>
        </div>
        <div className='content'>
          {showMore !== true ?
            data[index].detail &&
            <>
              <div 
                style={display}
                ref={element => {
                  if (element && element.clientHeight !== 0) {
                    let height = element.clientHeight + 50; // タイトル + 本文
                    if (height !== data[index].height) {
                      dispatch(publicInfoModule.actions.setIndividualRowSize({ index: index, page: page, value: height }));
                    }
                  }
                }}
              >
              <div
                style={{
                  height: rowHeight,
                  overflow: 'hidden'
                }}
              >
                <span
                  ref={element => {
                    if (element && element.clientHeight !== 0) {
                      let spanHeight = element.clientHeight; // 本文
                      let rowCount = Math.ceil(spanHeight / 20);
                      if (rowCount > 2) {
                        setMoreLink(true);
                        setRowHeight('40px')
                      } else {
                        setMoreLink(false);
                        setRowHeight('')
                      }
                    }
                  }}
                  style={{display: 'block'}}>
                  {data[index].detail.title}
                  {data[index].detail.content.length === 0 
                    ? null
                    : <><br/>{data[index].detail.content}</>}
                  <span><br/>発行日: {data[index].pubDate.slice(0, 10)}</span>
                </span>
                </div>
                <Link
                  style={{display: moreLink && textDispChecked === true ? '' : 'none'}}
                  component="button"
                  onClick={() => {
                    dispatch(publicInfoModule.actions.toggleMore({ index: index, page: page, value: true }));
                  }}
                  color='secondary'>more...</Link>
                </div>
              </>
              :
              <div
                style={{...display, whiteSpace: 'pre-line'}}
                ref={element => {
                  if (element && element.clientHeight !== 0) {
                    let height = element.clientHeight + 50; // タイトル + 本文
                    if (height !== data[index].height) {
                      dispatch(publicInfoModule.actions.setIndividualRowSize({ index: index, page: page, value: height }));
                    }
                  }
                }}
              >
                {data[index].detail.summary}
                <p>発行日: {data[index].pubDate.slice(0, 10)}</p>
                <span>
                  <Link
                    component="button"
                    onClick={() => {
                      dispatch(publicInfoModule.actions.toggleMore({ index: index, page: page, value: false }));
                    }}
                    color='secondary'>less...</Link>
                </span>
              </div>
          }
        </div>
        </div>  
      )
  }

export default function publicInfoPage(props) {
  const mapState = useCallback(state => ({
    searchLoaded: state.app.searchLoaded[2],
    textDispChecked: state.app.textDispChecked,
    loading: state.publicInfo.loading,
    record: state.publicInfo.record,
    page: state.publicInfo.page,
    disabled: state.publicInfo.disabled,
    pageParamsLoaded: state.publicInfo.pageParamsLoaded,
    loaded: state.publicInfo.pageParamsLoaded
  }), []);
  const { searchLoaded, textDispChecked, loading, record, page, disabled, pageParamsLoaded, loaded } = useMappedState(mapState);
  const data = record[page] || [];
  const rowSizes = data.map(item => {
    return textDispChecked ? item.height : 50
  });

  const dispatch = useDispatch();
  const classes = useStyles();
  const listRef = useRef(null);

  useEffect(() => {
    if (!loaded) {
      dispatch({ type: 'PUB/PARAM/FETCH' });
    } else if (!searchLoaded) {
      dispatch({ type:'PUB/RECORD/FETCH', payload: { page: 0, type: "new" } });
    }
    dispatch(appModule.actions.setSearchLoaded({ type: 2 }));

    if (textDispChecked) {
      dispatch(publicInfoModule.actions.handleDisplay({checked: false}));
    } else {
      dispatch(publicInfoModule.actions.handleDisplay({checked: true}));
    }
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [rowSizes]);

  return (
    <React.Fragment>
      {
        pageParamsLoaded &&
        <React.Fragment>
          <Grid container spacing={1} alignItems="center" wrap='nowrap'>
            <Grid item>
              <Box my={1} style={{ width: '4rem' }}>
                <Link
                  onClick={() => {
                    dispatch(publicInfoModule.actions.toggleFilterDialog({value: true}));
                    dispatch(publicInfoModule.actions.setCurrentFilterDialogContent());
                  }}
                  href={'#'}
                  color='secondary'>条件指定</Link>
              </Box>
            </Grid>
            <Grid item xs={'auto'} style={{ overflow: 'hidden' }}>
              <Box my={1}>
                <FilterTextDisplay />
              </Box>
            </Grid>
          </Grid>

          <Box mb={1}>
            <Divider />
          </Box>

          <FilterDialog />
        </React.Fragment>
      }

      {loading != false ?
        <div className={classes.loading}>
          <CircularProgress color='primary' />
          <div>
            Now Loading...
          </div>
        </div>
        :
        data.length != 0 ?
        <React.Fragment>
          <Box style={{flex: 1, padding: 8}}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={listRef}
                  className='List'
                  height={height}
                  itemSize={index => rowSizes[index]}
                  width={width}
                  itemCount={data.length}
                  itemData={data}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          </Box>

          <div　align='center'>
            <Button 
              disabled={disabled.Back} 
              onClick={() => {dispatch({ type:'PUB/RECORD/FETCH', payload: { page: page-1, type: "page" }})}} 
            >
              ＜
            </Button>

            <span style={{paddingLeft: 16, paddingRight: 16}}>
              Page {page + 1}
            </span>

            <Button 
              disabled={disabled.Foward} 
              onClick={() => {dispatch({ type:'PUB/RECORD/FETCH', payload: { page: page+1, type: "page" }})}} 
            >
              ＞
            </Button>
          </div>
        </React.Fragment>
        : loaded && <div align='center' vertical='middle' >No Record</div>
      }
    </React.Fragment>
  )
}