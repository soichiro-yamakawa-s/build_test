import * as React from "react";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GridColumns } from '../GridColumns';
import DataGridDemo from "../grid-data";
import "./index.css"
import SelectList from "../select";
import { fetchAPIUniverse } from "../api";
import logWriter from "../utils/logWriter";


const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    neutral: {
      main: '#003B75',
      contrastText: '#fff',
    },
  },
});


class Panel2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      columns: [],
      rows: [],
      selectValue: "mostRecent",
      universeValue: "",
      searchTip: "",
      dateValue: "",
    };
  }


  handleChildEvent = (ref) => {
    this.childRef = ref
  }

  handleRadioChange = (e) => {
    this.setState({ selectValue: e.target.value })
  }

  handleSelectedChange = (e) => {
    const newColumns = []
    for (const index of GridColumns.parent[e.target.value].member) {
      newColumns.push(GridColumns.chiled[index])
    }
    this.setState({ selected: e.target.value, columns: newColumns })
    this.getData(e.target.value);
    this.childRef.reSetColumns(newColumns);
  }

  handleCheckboxClick = (e) => {
    const newColumns = this.state.columns
    if (e.target.innerText) {
      newColumns.map(item => {
        if (item.headerName === e.target.innerText)
          item.hide = !item.hide;
        return item
      })
    } else if (e.target.id) {
      newColumns.map(item => {
        if (item.field === e.target.id)
          item.hide = !item.hide;
        return item
      })
    }
    this.childRef.reSetColumns(newColumns);
    this.setState({ columns: newColumns })
  }

  handleCheckAll = () => {
    const newColumns = this.state.columns
    const checkListLength = this.state.columns.filter(item => item.hide === true).length
    if (checkListLength === 0 || checkListLength === this.state.columns.length) {
      newColumns.map(item => {
        item.hide = !item.hide;
        return item
      })
    } else {
      newColumns.map(item => {
        item.hide = false;
        return item
      })
    }
    this.childRef.reSetColumns(newColumns);
    this.setState({ columns: newColumns })
  }

  changeUniverseValue = (e) => {
    this.setState({ universeValue: e.target.value })
  }

  changeDateValue = (e) => {
    this.setState({ dateValue: e.target.value })
  }

  downloadFileToExcel = () => {
    const option = {}
    let fileName = ''
    const date = new Date();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    switch (this.state.selected) {
      case 1:
        fileName = "役員詳細"
        break;
      case 2:
        fileName = "役員報酬"
        break;
      case 3:
        fileName = "関係会社の状況"
        break;
      case 4:
        fileName = "公認会計士の監査意見"
        break;
      default:
        break;
    }
    option.fileName = `${fileName}_${date.getFullYear()}${month}${day}`
    this.childRef.exportDataAsExcel(option.fileName)
  }

  getData = async (selected) => { 
    const rows = []
    const gridData = await fetchAPIUniverse();
    const title = GridColumns.parent[selected].member;
    for (let index_data = 0; index_data < gridData.length; index_data++) {
      const Obj = {}
      for (let index_obj = 0; index_obj < title.length; index_obj++) {
        Obj.id = index_data;
        Obj[title[index_obj + 1]] = gridData[index_data][index_obj];
      }
      rows.push(Obj)
    }
      // ログ出力
      const logParams = {}
      logParams.type = 2
      switch (this.state.selected) {
        case 1:
          logParams.selected = "D004"
          break;
        case 2:
          logParams.selected = "D072"
          break;
        case 3:
          logParams.selected = "B050"
          break;
        case 4:
          logParams.selected = "B036"
          break;
        default:
          break;
      }
      logParams.code = this.state.universeValue
      logParams.date = this.state.dateValue
      logWriter(logParams)
      this.setState({ rows: rows, searchTip: `${this.state.universeValue}` })
  }

  render() {
    return (
      <Box sx={{ '& button': { borderRadius: 1 }, flexGrow: 1, minWidth: 1495 }}>
        <ThemeProvider theme={theme}>
          <Grid container spacing={2}>
            <Grid item xs={2} sm={2} md={2} lg={2} sx={{marginTop: 1}}>
            <TextField
                // error={!this.state.universeValue}
                defaultValue={this.state.universeValue}
                id="universe"
                size="small"
                label="ユニバース"
                color='neutral'
                sx={{ width: '100%', borderRadius: 1, backgroundColor: "white" }}
                onChange={this.changeUniverseValue}
              />
            </Grid>
            <Grid item xs={10} sm={10} md={10} lg={10} sx={{marginTop: 1}}>
              <label className='font-size-18'>ユニバース基準日：</label >
            <FormControl component="fieldset" variant="standard">
            <RadioGroup row>
              <FormControlLabel
                value="mostRecent" 
                control={
                  <Radio 
                    checked={this.state.selectValue === 'mostRecent'}
                    onChange={this.handleRadioChange} />}
                label="直近"
              />
              <FormControlLabel
                value="customDate" 
                control={
                  <Radio
                    checked={this.state.selectValue === 'customDate'}
                    onChange={this.handleRadioChange} />} 
                label={
                  <TextField
                  error={!this.state.dateValue}
                  defaultValue={this.state.dateValue}
                  type={"date"}
                  id="dateValue"
                  size="small"
                  color='neutral'
                  sx={{ width: 150, borderRadius: 1, backgroundColor: "white" }}
                  onChange={this.changeDateValue}
                  disabled={this.state.selectValue === 'mostRecent'}
                />
                }
              />
            </RadioGroup>

            </FormControl>
              <Button
                sx={{ width: 80, marginLeft: 4, }}
                id="update"
                variant="contained"
                color='neutral'
                onClick={() => this.getData(this.state.selected)} >更新</Button>
              <Button
                sx={{ float: "right" }} 
                color='neutral' 
                variant="contained" 
                onClick={this.downloadFileToExcel}
                disabled={this.state.rows.length === 0}>EXCELダウンロード</Button>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <SelectList
                handleCheckboxClick={this.handleCheckboxClick}
                handleCheckAll={this.handleCheckAll}
                handleSelectedChange={this.handleSelectedChange}
                disabled={false}
                params={
                  {
                    columns: this.state.columns,
                    universeValue: this.state.universeValue,
                    selected: this.state.selected,
                    dateValue: this.state.dateValue,
                  }
                }
              ></SelectList>
            </Grid>
            <Grid item xs={10} sm={10} md={10} lg={10}>
              <div className='font-size-18 '>
                {this.state.searchTip ? this.state.searchTip : "　"}
              </div>
              <DataGridDemo
                onRef={this.handleChildEvent}
                columns={this.state.columns}
                rows={this.state.rows}
                selected={this.state.selected} />
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    );
  }
}

export default Panel2;
