import {
  Button,
  Divider,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
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

import publicInfoModule from '../modules/publicInfoModule';
import useStyles from '../useStyles';

const CheckListLabels = props => {
  const mapState = useCallback(state => ({
    params: state.publicInfo.currentFilterDialogState.params[props.mode] || []
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
    dialog: state.publicInfo.dialog[props.category],
    params: state.publicInfo.currentFilterDialogState.params[props.mode] || []
  }), []);
  const { dialog, params } = useMappedState(mapState);

  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <FormControl>
      <Button onClick={() => {dispatch(publicInfoModule.actions.toggleDialog({key: props.category, value: true}))}}>
        {props.title} ▾
      </Button>
      
      <Dialog open={dialog} onClose={() => {dispatch(publicInfoModule.actions.toggleDialog({key: props.category, value: false}))}}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <Button 
            variant='contained' 
            className={classes.margin} 
            size='medium' 
            color='primary' 
            onClick={() => {dispatch(publicInfoModule.actions.clearChecklistChecked({mode: props.mode}))}}
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
                    dispatch(publicInfoModule.actions.toggleChecklistChecked({id: e.target.id, checked: e.target.checked, mode: param.mode}))
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
             onClick={() => {dispatch(publicInfoModule.actions.toggleDialog({key: props.category, value: false}))}}
          >
            Cancel
          </Button>
          < Button
            color='primary'
            onClick={() => {
              dispatch(publicInfoModule.actions.toggleDialog({ key: props.category, value: false }))
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
    lang: state.publicInfo.currentFilterDialogState.ui.language,
    kikan: state.publicInfo.currentFilterDialogState.ui.kikan,
    term: state.publicInfo.currentFilterDialogState.ui.term,
    rangeType: state.publicInfo.currentFilterDialogState.ui.rangeType,
    startDate: state.publicInfo.currentFilterDialogState.ui.startDate,
    endDate: state.publicInfo.currentFilterDialogState.ui.endDate
  }), []);
  const { lang, kikan, term, rangeType, startDate, endDate } = useMappedState(mapState);
  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Checklist mode={2} category='repo' title='公開情報種別' />
        </Grid>
        <Grid item xs={8} style={{paddingTop: '10px'}}>
            <CheckListLabels mode={2}></CheckListLabels>
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
        <Grid item xs={4} style={{paddingLeft: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          言語
        </Grid>
        <Grid item xs={8}>
        <FormControl>
          <Select
            labelId='pub-language-select-label'
            id='pub-language-select'
            value={lang}
            className={classes.select}
            onChange={(e)=>{ 
              dispatch(publicInfoModule.actions.handleDialogOnChange({key: 'language', value: e.target.value}));
              // dispatch({type:'PUB/RECORD/FETCH', payload: {page: 0, type: 'new'}});
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
            labelId='pub-kikan-select-label'
            id='pub-kikan-select'
            value={kikan}
            className={classes.select}
            onChange={(e)=>{
              dispatch(publicInfoModule.actions.handleDialogOnChange({key: 'kikan', value: e.target.value}));
              // dispatch({type:'PUB/RECORD/FETCH', payload: {page: 0, type: 'new'}});
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
            labelId='pub-rangeType-select-label'
            id='pub-rangeType-select'
            value={rangeType}
            className={classes.select}
            onChange={(e)=>{
              dispatch(publicInfoModule.actions.handleDialogOnChange({key: 'rangeType', value: e.target.value}));
              // dispatch({type:'PUB/RECORD/FETCH', payload: {page: 0, type: 'new'}});
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
                dispatch(publicInfoModule.actions.handleDialogOnChange({key: 'term', value: e.target.value}));
                // dispatch({type:'PUB/RECORD/FETCH', payload: {page: 0, type: 'new'}});
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
              id="pub-date-picker-inline-start"
              label="startdate"
              autoOk={true}
              value={startDate}
              onChange={(date) => {
                if (isValid(date)) {
                  dispatch(publicInfoModule.actions.handleDialogOnChange({key: 'startDate', value: date}));
                  // dispatch({type:'PUB/RECORD/FETCH', payload: {page: 0, type: 'new'}});
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
              id="pub-date-picker-inline-end"
              label="enddate"
              autoOk={true}
              value={endDate}
              onChange={(date) => {
                if (isValid(date)) {
                  dispatch(publicInfoModule.actions.handleDialogOnChange({key: 'endDate', value: date}));
                  // dispatch({type:'PUB/RECORD/FETCH', payload: {page: 0, type: 'new'}});
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