import React, { Component, useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import EventListener from 'react-event-listener';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// ----- initial state --- 
export const initialState = {
    infoState: true
};

// ---- type ----- 

export const types = {
    CHANGE_INFO_STATE: 'CHANGE_INFO_STATE'
};



// ---- action ----- 

export const actions = {
    changeInfoState(bool) {
        return { type: types.CHANGE_INFO_STATE, payload: bool }
    },
    resize() {
        return { type: types.CHANGE_INFO_STATE, payload: handleResize() }
    }
}



// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.CHANGE_INFO_STATE:
            return { ...state, infoState: payload }
        default:
            return state
    }
}

function handleResize() {
    let tabulW = document.querySelector('.drag-div')
    if (tabulW) {
        let transX = document.defaultView.getComputedStyle(tabulW, null).transform
        let draggableX = transX.split(",")[4]
        let draggableY = transX.split(",")[5]
        if (window.innerWidth <= parseInt(draggableX) || window.innerHeight - 150 <= parseInt(draggableY)) {
            return false
        }
        return true
    }
}

// ---- Component ----
class Info extends Component {
    state = {
        activeDrags: 0,
        deltaPosition: {
            x: 0, y: 0
        }
    };

    handleDrag = (e, ui) => {
        const { x, y } = this.state.deltaPosition;
        this.setState({
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    };

    onStart = () => {
        this.setState({ activeDrags: ++this.state.activeDrags });
    };

    onStop = () => {
        this.setState({ activeDrags: --this.state.activeDrags });
    };

    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        const _self = this;
        return (
            <div>
                <EventListener target="window" onResize={() => _self.props.actions.resize()} />
                {<style jsx global>{`
                        .drag-div{
                            width: 428px;
                            background-color: black;
                            cursor: move;
                            color: #DDDDDD;
                            position: fixed;
                            z-index: 1;
                            opacity: 0.6;
                            font-size: 12px;
                            line-height: 1.2;
                            top: 130px;
                            font-family: ${_self.props.fontFamily} !important;
                        }
                        .info-div{
                            min-height: 20px;
                            margin: 8px;
                        }
                        .info-div-mini{
                            margin: 8px;
                            min-height: 20px;
                        }
                        .span-title{
                            color: white !important;
                        }
                        .mini-button{
                            position: absolute;
                            right: 8px;
                            bottom: 8px;
                            padding: 0px;
                            cursor: pointer;
                            background: none;
                            color: #DDDDDD;
                            outline: none;
                            border: solid 1px #DDD;
                            font-size: 12px;
                            text-align: center;
                            height: 22px;
                            line-height: 22px;
                            width: 52px;
                            font-family: ${_self.props.fontFamily} !important;
                        }
                        .mini-button:hover{
                            background-color: #555555;
                        }
                        .info-open{
                            position: absolute;
                            padding: 0px;
                            margin-top: 4px;
                            margin-left: 28px;
                            cursor: pointer;
                            background-color: black;
                            opacity: 0.6;
                            color: #DDD;
                            outline: none;
                            border: solid 1px #DDD;
                            font-size: 16px;
                            width: 120px;
                            height: 36px;
                            text-align: center;
                            line-height: 34px;
                            font-family: ${_self.props.fontFamily} !important;
                        }
                        .info-open:hover{
                            background-color: #555555;
                        }
                        .rev-div{
                            display: inline-block;
                        }
                        .rev-span{
                            float: right;
                        }
                    `}</style>}
                {(_self.props.tabState == "0" || _self.props.tabState == "1" || _self.props.tabState == "2") && _self.props.comData.name != "" ?
                    <div>
                        {_self.props.infoState ?
                            <Draggable bounds=".view" {...dragHandlers}>

                                <div className="drag-div">

                                    <div className="info-div">

                                        <div><span className="span-title">銘柄コード：</span>{_self.props.comData.code}</div>
                                        <div><span className="span-title">銘柄名：</span>{_self.props.comData.name}</div>
                                        <div><span className="span-title">国：</span>{_self.props.comData.country}</div>
                                        <div><span className="span-title">業種：</span>{_self.props.comData.industry}</div>
                                        <br />
                                        <div className="rev-div">
                                            <span className="span-title">総売上高：</span><span className="rev-span">{_self.props.comData.revTotal} {_self.props.comData.revTotal == "" ? "" : "百万円"}</span><br />
                                            <span className="span-title">日本売上高：</span><span className="rev-span">{_self.props.comData.revInternal} {_self.props.comData.revInternal == "" ? "" : "百万円"}</span><br />
                                            <span className="span-title">海外売上高：</span><span className="rev-span">{_self.props.comData.revForeign} {_self.props.comData.revForeign == "" ? "" : "百万円"}</span>
                                        </div>
                                        <div><span className="span-title">従業員数：</span>{_self.props.comData.employees} {_self.props.comData.employees == "" ? "" : "人"}</div>
                                        <br />
                                        <br /><span>{_self.props.comData.data}</span><br />
                                        <button className="mini-button" onClick={() => _self.props.actions.changeInfoState(false)}>閉じる</button><br /><br />
                                    </div>


                                </div>
                            </Draggable>
                            :
                            <button className="info-open" onClick={() => _self.props.actions.changeInfoState(true)}>銘柄情報 ▼</button>
                        }
                    </div>
                    : ""}

            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    comData: state.Force.comData,
    tabState: state.Tab.tabState,
    history: state.Force.history,
    infoState: state.Info.infoState,
    fontSize: state.Header.fontSize,
    fontFamily: state.Header.fontFamily
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),

})

const view = connect(mapStateToProps, mapDispatchToProps)(Info)
export { view }



