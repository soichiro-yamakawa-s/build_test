import * as React from "react";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GridColumns } from '../GridColumns';
import DataGridDemo from "../grid-data";
import logWriter from "../utils/logWriter";
import "./index.css"
import SelectList from "../select";
import DatePicker from "../datePicker";
import { fetchAPICompany, fetchAPICodeName } from "../api";


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


class Panel1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      columns: [],
      rows: [],
      top100Films: [],
      inputValue: "",
      value: null,
      searchTip: "",
      minYear: 1970,
      maxYear: 2099,
      from: new Date().setFullYear(new Date().getFullYear() - 1),
      fromCheck: true,
      to: new Date(),
      toCheck: true,
    };
  }

  handleChildEvent = (ref) => {
    this.childRef = ref
  }

  handleSelectedChange = (e) => {
    const newColumns = []
    for (const index of GridColumns.parent[e.target.value].member) {
      GridColumns.chiled[index].hide = false
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

  setInputValue = (e, newInputValue) => {
    if (!newInputValue) {
      this.setState({ searchTip: "結果が検索されませんでした", rows: [], top100Films: [] })
    }
    if (e && e.type === "change") {
      this.getCodeName(newInputValue)
    }
    this.setState({ inputValue: newInputValue })
    if (e && e.type === "click" && this.state.selected !== 0) {
      document.getElementById("codeAndName").blur()
      setTimeout(() => {
        this.getData(this.state.selected)
      }, 10);
    }
  }

  getCodeName = async (newInputValue) => {
    const top100Films = await fetchAPICodeName(newInputValue)
    this.setState({ top100Films: top100Films })
  }

  changeFrom = (date) => {
    if (date === null){
      this.setState({ from: date , fromCheck: false})
    } else {
      this.setState({ from: date , fromCheck: true})
    }
    
  }

  selectFrom = (date) => {
    this.setState({ from: date , fromCheck: true})
    if (this.state.selected !== 0) {
      setTimeout(() => {
        document.getElementById("update").click();
      }, 5);
    }
  }

  selectTo = (date) => {
    this.setState({ to: date , fromCheck: true})
    if (this.state.selected !== 0) {
      setTimeout(() => {
        document.getElementById("update").click();
      }, 5);
    }
  }

  changeTo = (date) => {
    if (date === null){
      this.setState({ to: date , toCheck: false})
    } else {
      this.setState({ to: date , toCheck: true})
    }
  }

  formatDate = (date) => {
    const now = new Date(date)
    const result = {}
    result.year = now.getFullYear()
    if (now.getMonth() + 1 < 10) {
      result.month = '0' + (now.getMonth() + 1)
    } else {
      result.month = now.getMonth() + 1
    }

    if (now.getDate() < 10) {
      result.day = '0' + now.getDate()
    } else {
      result.day = now.getDate()
    }
    return result.year.toString() + result.month.toString() + result.day.toString()
    
  }

  handleOnKeyDown = (e) => {
    if (e.which === 13) {
      //Enterで銘柄名自動入力
      // const result = this.formatInput()
      // if (result) {
      //   this.setState({ value: result.label})
      // }
      if (e.target.id === "from" || e.target.id === "to") {
        this.checkDate(e)
      }
      document.getElementById(e.target.id).blur();
      if (this.state.selected !== 0) {
        setTimeout(() => {
          document.getElementById("update").click();
        }, 5);
      }
    }
  }

  checkDate = (e) => {
    const regex =/[0-9]{8}/
    if(regex.test(e.target.value)) {
      const year = parseInt(e.target.value.slice(0,4))
      const month = parseInt(e.target.value.slice(4,6))
      const day = parseInt(e.target.value.slice(6,8))
      const dateStr = year + "/" + month + "/" + day
      if (year >= this.state.minYear && year <= this.state.maxYear && 
        new Date(dateStr).getDate() === day){
            switch (e.target.id) {
              case "from": this.setState({from: new Date(dateStr)})
                break;
              case "to": this.setState({to: new Date(dateStr)})
                break;
              default: break;
            }
          }
      }
  }

  setCodeAndName = () => {
    setTimeout(() => {
      const inputValue = document.getElementById("codeAndName").value
      this.setState({ inputValue: inputValue })
    }, 5);
  }

  formatInput = () => {
    const input = document.getElementById("codeAndName").value.split("　　　")
    let result = ""
    if (input.length >= 1) {
      const regSimp = /[0-9]{4}/
      if (regSimp.test(input[0])) {
        this.state.top100Films.map(item => {
          if (item.id === input[0]) result = item
          return item
        })
      } else {
        this.state.top100Films.map(item => {
          if (item.name === input[0]) result = item
          return item
        })
      }
    }
    return result
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
    this.childRef.resetColumnState()
    this.childRef.reSetColumns([])
    const option = this.formatInput()
    if (!option) {
      this.setState({ searchTip: "結果が検索されませんでした", rows: [] })
      return
    }
    var gridData = []
    const from = this.formatDate(this.state.from)
    const to = this.formatDate(this.state.to)
    gridData = await fetchAPICompany(option.id, from, to, selected);
    // ログ出力
    const logParams = {}
    logParams.type = 1
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
    logParams.code = option.id
    logParams.from = this.state.from
    logParams.to = this.state.to
    logWriter(logParams)
    this.childRef.reSetColumns(this.state.columns);
    if (gridData.length === 0) {
      this.setState({ rows: gridData, searchTip: "結果が検索されませんでした" })
    } else {
      this.setState({ rows: gridData, searchTip: `${option.id} ${option.name}` })
    } 
  }

  render() {
    return (
      <Box sx={{ '& button': { borderRadius: 1 }, flexGrow: 1, minWidth: 1000, height: "100%" }}>
        <ThemeProvider theme={theme}>
          <Grid container spacing={2}>
            <Grid item xs="auto" sx={{marginTop: 1}}>
              <Autocomplete
                freeSolo={true}
                value={this.state.value}
                options={this.state.top100Films}
                size="small"
                id="codeAndName"
                sx={{ width: 240, display: 'inline-block', borderRadius: 1, backgroundColor: "white" }}
                filterOptions={(option) => option}
                onKeyDown={this.handleOnKeyDown}
                onInputChange={this.setInputValue}
                renderInput={(params) =>
                  <TextField {...params}
                    onBlur={this.setCodeAndName}
                    color='neutral'
                    error={!this.state.inputValue}
                    label="銘柄コードor銘柄名を入力" />}
                renderOption={(props, option) => (
                  <Box component="li"  {...props}>
                    {option.label}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={6} sx={{marginTop: 1}}>
              <DatePicker
                selectedDate={this.state.from}
                handleDateChange={this.changeFrom}
                label={"from"}
                onKeyDown={this.handleOnKeyDown}
                check={this.state.fromCheck}
                checkDate={this.checkDate}
                onSelect={this.selectFrom}
              />
              <DatePicker 
                selectedDate={this.state.to}
                handleDateChange={this.changeTo}
                label={"to"}
                onKeyDown={this.handleOnKeyDown}
                check={this.state.toCheck}
                checkDate={this.checkDate}
                onSelect={this.selectTo}
              />
              <Button
                sx={{ width: 80, marginLeft: 4 }}
                id="update"
                variant="contained"
                color='neutral'
                onClick={() => this.getData(this.state.selected)}
                disabled={!(this.state.inputValue && this.state.from && this.state.to && this.state.selected)} >更新</Button>
              </Grid> 
              <Grid item xs sx={{marginTop: 1}}>
                <Button 
                  sx={{ float: "right" }} 
                  color='neutral' 
                  variant="contained" 
                  onClick={this.downloadFileToExcel}
                  disabled={this.state.rows.length === 0}>EXCELダウンロード</Button>
                </Grid>
                </Grid>
                <Grid container spacing={2} style={{marginTop: 1}}>
            <Grid item xs="auto" >
              <SelectList
                handleCheckboxClick={this.handleCheckboxClick}
                handleCheckAll={this.handleCheckAll}
                handleSelectedChange={this.handleSelectedChange}
                params={
                  {
                    columns: this.state.columns,
                    selected: this.state.selected,
                  }
                }
                disabled={true}
                disabledChecked={
                  {
                    inputValue: this.state.inputValue,
                    from: this.state.from,
                    to: this.state.to
                  }
                }
              ></SelectList>
            </Grid>
            <Grid item xs sx={{height: "calc(100vh - 159px)"}}>
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

export default Panel1;
