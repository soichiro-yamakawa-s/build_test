import {
  Button,
  Grid,
  Divider,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem
} from '@material-ui/core';

import { isValid } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import {
  useCallback,
} from 'react';
import {
  useDispatch,
  useMappedState
} from 'redux-react-hook';

import analystModule from '../modules/analystModule';
import useStyles from '../useStyles';

const CheckListLabels = props => {
  const mapState = useCallback(state => ({
    params: state.analyst.currentFilterDialogState.params[props.mode] || []
  }))
  const { params } = useMappedState(mapState);

  const labels = [];
  params.forEach(param => {
    if (param.checked) {
      labels.push(param.label);
    }
  });
  return (
    labels.length === 0 ? <div>全て</div> : <div>{labels.join(', ')}</div>
  )
}
const Checklist = props => {
  const mapState = useCallback(state => ({
    dialog: state.analyst.dialog[props.category],
    params: state.analyst.currentFilterDialogState.params[props.mode] || []
  }), []);
  const { dialog, params } = useMappedState(mapState);

  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <FormControl>
      <Button onClick={() => {dispatch(analystModule.actions.toggleDialog({key: props.category, value: true}))}}>
        {props.title} ▾
      </Button>
      
      <Dialog open={dialog} onClose={() => {dispatch(analystModule.actions.toggleDialog({key: props.category, value: false}))}}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <Button 
            variant='contained' 
            className={classes.margin} 
            size='medium' 
            color='primary' 
            onClick={() => {dispatch(analystModule.actions.clearChecklistChecked({mode: props.mode}))}}
          >
            全件解除
          </Button>
          <Divider />
          {params.map(param => {
            return (
              <div key={param.id} style={{whiteSpace: 'nowrap'}}>
                <Checkbox 
                  id={param.id}
                  checked={param.checked} 
                  color='primary' 
                  value={param.id}
                  onChange={e => {
                    dispatch(analystModule.actions.toggleChecklistChecked({id: e.target.id, checked: e.target.checked, mode: param.mode}))
                  }}
                />
                <label htmlFor={param.id}>{param.label}</label>
              </div>
            )
          })}
          </DialogContent>
        <DialogActions>
          <Button
             color='primary' 
             onClick={() => {dispatch(analystModule.actions.toggleDialog({key: props.category, value: false}))}}
          >
            Cancel
          </Button>
          <Button
             color='primary' 
             onClick={() => {
               dispatch(analystModule.actions.toggleDialog({key: props.category, value: false}));
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </FormControl>
  )
}

export default function Filter(props) {
  const mapState = useCallback(state => ({
    lang: state.analyst.currentFilterDialogState.ui.language,
    kikan: state.analyst.currentFilterDialogState.ui.kikan,
    term: state.analyst.currentFilterDialogState.ui.term,
    rangeType: state.analyst.currentFilterDialogState.ui.rangeType,
    startDate: state.analyst.currentFilterDialogState.ui.startDate,
    endDate: state.analyst.currentFilterDialogState.ui.endDate
  }), []);
  const { lang, kikan, term, rangeType, startDate, endDate } = useMappedState(mapState);

  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Checklist mode={3} category='repo' title='レポートジャンル' />
        </Grid>
        <Grid item xs={8} style={{paddingTop: '10px'}}>
            <CheckListLabels mode={3}></CheckListLabels>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4}>
          <Checklist mode={4} category='industory' title='業種' />
        </Grid>
        <Grid item xs={8} style={{paddingTop: '10px'}}>
          <CheckListLabels mode={4}></CheckListLabels>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4}>
          <Checklist mode={6} category='fromco' title='発信元' />
        </Grid>
        <Grid item xs={8} style={{paddingTop: '10px'}}>
          <CheckListLabels mode={6}></CheckListLabels>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4} style={{paddingLeft: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          言語
        </Grid>
        <Grid item xs={8}>
        <FormControl>
          <Select
            labelId='analyst-language-select-label'
            id='analyst-language-select'
            value={lang}
            className={classes.select}
            onChange={(e)=>{ 
              dispatch(analystModule.actions.handleDialogOnChange({key: 'language', value: e.target.value}));
              // dispatch({type:'RECORD/FETCH', payload: {page: 0, type: 'new'}});
            }}
            MenuProps={{
              anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
              transformOrigin: {vertical: 'top', horizontal: 'left'},
              getContentAnchorEl: null
          }}>
            <MenuItem value={2}>和文/英文</MenuItem>
            <MenuItem value={0}>和文レポート</MenuItem>
            <MenuItem value={1}>英文レポート</MenuItem>
          </Select>
        </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4} style={{paddingLeft: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          日付種別
        </Grid>
        <Grid item xs={8}>
        <FormControl>
          <Select
            labelId='analyst-kikan-select-label'
            id='analyst-kikan-select'
            value={kikan}
            className={classes.select}
            onChange={(e)=>{
              dispatch(analystModule.actions.handleDialogOnChange({key: 'kikan', value: e.target.value}));
              // dispatch({type:'RECORD/FETCH', payload: {page: 0, type: 'new'}});
            }}
            MenuProps={{
              anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
              transformOrigin: {vertical: 'top', horizontal: 'left'},
              getContentAnchorEl: null
          }}>
            <MenuItem value={1}>配信日</MenuItem>
            <MenuItem value={2}>発行日</MenuItem>
          </Select>
        </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4} style={{paddingLeft: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          日付選択方法
        </Grid>
        <Grid item xs={8}>
        <FormControl>
          <Select
            labelId='analyst-rangeType-select-label'
            id='analyst-rangeType-select'
            value={rangeType}
            className={classes.select}
            onChange={(e)=>{
              dispatch(analystModule.actions.handleDialogOnChange({key: 'rangeType', value: e.target.value}));
              // dispatch({type:'RECORD/FETCH', payload: {page: 0, type: 'new'}});
            }}
            MenuProps={{
              anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
              transformOrigin: {vertical: 'top', horizontal: 'left'},
              getContentAnchorEl: null
          }}>
            <MenuItem value={1}>過去分</MenuItem>
            <MenuItem value={2}>範囲</MenuItem>
          </Select>
        </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
        {rangeType === 1 ?
          <FormControl>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={term}
              className={classes.select}
              onChange={(e)=>{ 
                dispatch(analystModule.actions.handleDialogOnChange({key: 'term', value: e.target.value}));
                // dispatch({type:'RECORD/FETCH', payload: {page: 0, type: 'new'}});
              }}
              MenuProps={{anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
                transformOrigin: {vertical: 'top', horizontal: 'left'},
                getContentAnchorEl: null
            }}>
              <MenuItem value={4}>全期間</MenuItem>
              <MenuItem value={1}>本日</MenuItem>
              <MenuItem value={2}>1週間</MenuItem>
              <MenuItem value={3}>1か月</MenuItem>
              <MenuItem value={5}>3か月</MenuItem>
            </Select>
          </FormControl>
          :
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy/MM/dd"
              margin="dense"
              size="small"
              id="date-picker-inline-start"
              label="startdate"
              autoOk={true}
              value={startDate}
              onChange={(date) => {
                if (isValid(date)) {
                  dispatch(analystModule.actions.handleDialogOnChange({key: 'startDate', value: date}));
                  // dispatch({type:'RECORD/FETCH', payload: {page: 0, type: 'new'}});
                };
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy/MM/dd"
              margin="dense"
              size="small"
              id="date-picker-inline-end"
              label="enddate"
              autoOk={true}
              value={endDate}
              onChange={(date) => {
                if (isValid(date)) {
                  dispatch(analystModule.actions.handleDialogOnChange({key: 'endDate', value: date}));
                  // dispatch({type:'RECORD/FETCH', payload: {page: 0, type: 'new'}});
                }
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          }
        </Grid>
      </Grid>
  </div>)
}