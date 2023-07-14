import * as React from 'react';
import './index.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; 
import ExportJsonExcel from 'js-export-excel';
// import storage from '../utils/storageUtils';
// import memoryData from '../utils/memoryUtile';

class DataGridDemo extends React.Component {
  constructor(props) {
    super(props);
    this.childRef = React.createRef();
    this.state = {
      defaultColDef: {
        resizable: true,
        width: 120,
        sortable: true,
        flex: 1,
        minWidth: 150,
      },

    };
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  reSetPlaceholder = () => {
    Array.from(document.getElementsByClassName('ag-input-field-input')).forEach((obj) => {
      if (obj.attributes['disabled']) { // skip columns with disabled filter
        return;
      }
      obj.setAttribute('placeholder', '');
    });
  }

  reSetColumns = (param) => {
    this.gridApi.setColumnDefs(param);
  };

  resetColumnState = () =>{
    this.gridColumnApi.resetColumnState()
    this.gridApi.setFilterModel(null)
    // this.gridApi.ensureIndexVisible(this.gridApi.getSelectedNodes()[0].rowIndex, null)
  }

  exportDataAsExcel = (fileName) => {
    const option = {}
    const csvStr = this.gridApi.getDataAsCsv()
    const csvList = csvStr.replace(/"/g, "").split("\n")
    const datalist = []
    const excelDataList = []
    const excelFilterList = []
    csvList.map(item => {
      datalist.push(item.split(","))
      return item
    })
    for (const dataItem of datalist) {
      const rowItem = {}
      dataItem.map((item, index) => {
        rowItem[index] = item
        return item
      })
      excelDataList.push(rowItem)
    }
    for (let index = 0 ; index < datalist[0].length ; index++) {
      excelFilterList.push(index)
    }
    option.fileName = fileName
    option.datas = [
      {
        sheetData: excelDataList,
        sheetName: fileName,
        sheetFilter: excelFilterList,
      }
    ]
    const toExcel = new ExportJsonExcel(option)
    toExcel.saveExcel();
  }

  render() {
    return (
      <div className="ag-theme-alpine" style={{ minWidth: 400, width: "100%", float: "right", minHeight: 570, height: "100%"}}>
        <AgGridReact
          gridRef={this.gridRef}
          columnDefs={this.props.columns}
          headerHeight={33}
          rowData={this.props.rows}
          suppressMovableColumns={true}
          rowHeight={33}
          onGridReady={this.onGridReady}
          defaultColDef={this.state.defaultColDef}
          overlayNoRowsTemplate={"表示可能な項目がありません"}
          onFilterOpened={this.reSetPlaceholder}
        ></AgGridReact>
      </div>
    );
  }
}
export default DataGridDemo
