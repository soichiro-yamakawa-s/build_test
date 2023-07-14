import React from "react";
import DatePicker from "react-datepicker";
import "./index.css"

import "react-datepicker/dist/react-datepicker.css";

class DatePickerDemo extends React.Component {
    constructor(props) {
        super(props);
        this.childRef = React.createRef();
        this.state = {
            minDate: new Date("1970/01/01"),
            maxDate: new Date("2099/12/31")
        };
    }
 
    render() {
        return (
            <div className={this.props.label}>
            <span className="span-font">{this.props.label}</span>
            <div className="date-picker-inline">
                <DatePicker
                    id={this.props.label}
                    className={this.props.check ? "date-picker-ok" : "date-picker-err" }
                    selected={this.props.selectedDate}
                    onChange={this.props.handleDateChange}
                    onSelect={this.props.onSelect}
                    dateFormat={"yyyy/MM/dd"}
                    onKeyDown={this.props.onKeyDown}
                    onBlur={this.props.checkDate}
                    maxDate={this.state.maxDate}
                    minDate={this.state.minDate}
                />
            </div>
          </div>
        );
    }
}
export default DatePickerDemo
