import * as React from 'react';
import "./index.css"
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";


class SelectList extends React.Component {
    constructor(props) {
        super(props);
        this.childRef = React.createRef();
        this.state = {};
    }

    render() {
        return (
            <Box style={{maxWidth: 240}}>
                <FormControl
                    fullWidth
                    error={this.props.params.selected === 0}>
                    <div className='font-size-18'>
                        項目選択
                    </div>
                    <select
                        id="selected"
                        value={this.props.params.selected}
                        onChange={this.props.handleSelectedChange}
                        style={{ width: 240, color: this.props.params.selected === 0 ? "#e60000" : "", backgroundColor: "white" }}
                        disabled={this.props.disabled && !(this.props.disabledChecked.inputValue && this.props.disabledChecked.from && this.props.disabledChecked.to)}
                    >
                        <option value={0} disabled={true}>項目を選択してください</option>
                        <option value={1} style={{color: "black"}}>役員詳細</option>
                        <option value={2} style={{color: "black"}}>役員報酬</option>
                        <option value={3} style={{color: "black"}}>関係会社の状況</option>
                        <option value={4} style={{color: "black"}}>公認会計士の監査意見</option>
                    </select>
                </FormControl>
                <List
                    className="margin-left"
                    sx={{ height: 522, flexGrow: 1, overflow: "auto" }}
                >
                    <ListItemButton
                        sx={{ height: 25, minWidth: 400, display: this.props.params.selected === 0 ? "none" : true, backgroundColor: "white" }}
                        key={0}
                    >
                        <Checkbox
                            checked={this.props.params.columns.filter(item => item.hide === true).length === 0}
                            onClick={this.props.handleCheckAll}
                            id={"0"} />
                        <ListItemText primary={"すべて選択"} onClick={this.props.handleCheckAll} />
                    </ListItemButton>
                    {this.props.params.columns.map(item =>
                        <ListItemButton
                            sx={{ height: 25, minWidth: 400, backgroundColor: "white" }}
                            key={item.field}
                        >
                            <Checkbox checked={!item.hide} id={item.field.toString()} onClick={this.props.handleCheckboxClick} />
                            <ListItemText primary={item.headerName} id={item.field.toString()} onClick={this.props.handleCheckboxClick} />
                        </ListItemButton>
                    )}
                </List>
            </Box>
        )
    }
}
export default SelectList