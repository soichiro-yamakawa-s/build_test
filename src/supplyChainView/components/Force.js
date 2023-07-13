import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as HeaderComponent from './Header'

import * as d3 from 'd3';

// ----- initial state --- 
export const initialState = {
    comData: { "code": "", "name": "", "data": "", "country": "", "industry": "", "entity": "", "revTotal": "", "revInternal": "", "revForeign": "", "employees": "" },
    comParam: { "code": "", "name": "", "data": "", "country": "", "industry": "", "entity": "" },
    entity: "",
    name: "",
    historyData: "",
    supplyData: "",
    supplyData2: "",
    supplyForceData: "",
    supplyForceData2: "",
    supplyAll: "",
    supplyAll2: "",
    supplyForceAll: "",
    supplyForceAll2: "",
    history: [],
    zoom: 100
};

// ---- type ----- 

export const types = {
    COMPANY_DATA: "COMPANY_DATA",
    UPDATE_COMPANY: "UPDATE_COMPANY",
    BACK_DATA: "BACK_DATA",
    CHANGE_FETCH_DATA: "CHANGE_FETCH_DATA",
    CHANGE_FETCH_DATA_TREE: 'CHANGE_FETCH_DATA_TREE',
    CHANGE_MOUSE_STATE: "CHANGE_MOUSE_STATE",
    DATA_UPDATED: 'DATA_UPDATED',
    DATA_UPDATED2: 'DATA_UPDATED2',
    DATA_UPDATED_FORCE: 'DATA_UPDATED_FORCE',
    DATA_UPDATED_FORCE2: 'DATA_UPDATED_FORCE2',
    GET_DATA: 'GET_DATA',
    GET_DATA2: 'GET_DATA2',
    GET_FORCE_DATA: 'GET_FORCE_DATA',
    GET_FORCE_DATA2: 'GET_FORCE_DATA2',
    HISTORY_DATA: 'HISTORY_DATA',
    HISTORY_UPDATE: 'HISTORY_UPDATE',
    CHANGE_ENTITY: 'CHANGE_ENTITY',
    CHANGE_ZOOM: 'CHANGE_ZOOM'
};



// ---- action ----- 

export const actions = {
    changeComCode(code, name, country, industry, entity) {
        return { type: types.COMPANY_DATA, payload: { "code": code, "name": name, "country": country, "industry": industry, "entity": entity } }
    },
    updateData(entity, name) {
        return { type: types.CHANGE_FETCH_DATA, payload: { "entity": entity, "name": name } }
    },
    backData(value) {
        return { type: types.BACK_DATA, payload: value }
    },
    zoomScale(value) {
        return { type: types.CHANGE_ZOOM, payload: Math.round(100 * Number(value)) == 99 ? 100 : Math.round(100 * Number(value)) }
    }
}



// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.CHANGE_FETCH_DATA:
            return { ...state, entity: payload.entity, name: payload.name }
        case types.CHANGE_FETCH_DATA_TREE:
            return { ...state, entity: payload.entity, name: payload.name }
        case types.COMPANY_DATA:
            return { ...state, comParam: payload }
        case types.BACK_DATA:
            return { ...state, historyData: payload }
        case types.UPDATE_COMPANY:
            return { ...state, comData: payload }
        case types.DATA_UPDATED:
            return {
                ...state,
                supplyData: {
                    ...state.supplyData,
                    code: payload.code,
                    name: payload.name,
                    country: payload.country,
                    industry: payload.industry,
                    entity: payload.entity,
                    count: payload.count,
                    children: payload.data,
                }
            }
        case types.HISTORY_DATA:
            return { ...state, history: historyEdit(state.history, payload) }
        case types.HISTORY_UPDATE:
            return { ...state, history: payload }
        case types.DATA_UPDATED2:
            return {
                ...state,
                supplyData2: {
                    ...state.supplyData2,
                    code: payload.code,
                    name: payload.name,
                    country: payload.country,
                    industry: payload.industry,
                    entity: payload.entity,
                    count: payload.count,
                    children: payload.data,
                },


            }
        case types.DATA_UPDATED_FORCE:
            return { ...state, supplyForceData: payload.data }
        case types.DATA_UPDATED_FORCE2:
            return { ...state, supplyForceData2: payload.data }
        case types.GET_DATA:
            return { ...state, supplyAll: payload.data }
        case types.GET_DATA2:
            return { ...state, supplyAll2: payload.data }
        case types.GET_FORCE_DATA:
            return { ...state, supplyForceAll: payload.data }
        case types.GET_FORCE_DATA2:
            return { ...state, supplyForceAll2: payload.data }
        case types.CHANGE_ENTITY:
            return { ...state, entity: payload }
        case types.CHANGE_ZOOM:
            return { ...state, zoom: payload }
        default:
            return state
    }
}

const historyEdit = (hisArr, newHistory) => {
    return hisArr.concat([newHistory])
}

// ---- Component ----
class Force extends Component {
    constructor(props) {
        super(props)
        this.createLineChart = this.createLineChart.bind(this)
    }

    componentDidMount() {
        this.createLineChart()
    }
    componentDidUpdate() {
        this.createLineChart()
    }
    createLineChart() {
        // 3. 描画用データの変換
        const _self = this;
        let mouseState = true;
        let selectEntity = "";

        let graph = _self.props.supplyForceData
        let width = window.innerWidth
        let height = window.innerHeight - 150

        d3.select("g").remove();

        let svg = d3.select(".d3-svg")
        if (graph != "") {
            let g = svg.append("g")
                .attr("class", "everything")
            let color = d3.scaleOrdinal(d3.schemeCategory10);
            let simulation = d3.forceSimulation()
                .force("link", d3.forceLink().strength(_self.props.power).id(function (d) { return d.id; }))
                .force("charge", d3.forceManyBody().strength(-45))
                .force("center", d3.forceCenter(width / 2, height / 2));


            let link = g.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke", "#999")
                .attr("stroke-width", 0.5 /* function (d) { return Math.sqrt(d.value); } */);

            let node = g.append("g")
                .selectAll("g")
                .data(graph.nodes)
                .enter().append("g")
                .on("click", clicked)
                .attr("opacity", function (d) {
                    if (_self.props.filterType == "highlight" && d.group != 0) {
                        if (_self.props.country != "国" && _self.props.rbics != "業種") {
                            return (_self.props.country == _self.props.cnList[d.country] && _self.props.rbics == d.industry) ? "1.0" : "0.1"
                        } else {
                            return (_self.props.country == "国" && _self.props.rbics == "業種") || ((_self.props.country != "国" && _self.props.country == _self.props.cnList[d.country]) || (_self.props.rbics != "業種" && _self.props.rbics == d.industry)) ? "1.0" : "0.1"

                        }
                    }
                });

            let circles = node.append("circle")
                .attr("r", function (d) { return d.group == 0 ? 8.5 : 3.5; })
                .attr("fill", function (d) { return color(d.group); })
                .attr("class", "circle")
                // .on("mouseover" ,function (d) {
                //     d3.select(this).classed("circle-grab", true);
                // })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            let labels = node.append("text")
                .on("mouseover", function (d) {
                    if (mouseState) _self.props.actions.changeComCode(d.code, d.id, d.country, d.industry, d.entity)
                    d3.selectAll(".text-over").classed("text-over", false);
                    d3.select(this).classed("text-over", true);
                })
                .on("mouseout", function (d) {
                    d3.selectAll(".text-over").classed("text-over", false);
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
                .text(function (d) {
                    return d.id;
                })

                .attr("font-size", "12px")
                .attr('x', 6)
                .attr('y', 3);

            // node.append("title")
            //     .text(function (d) { return d.id })


            d3.select(".d3-svg")
                .on('click', function (d) {
                    if (!mouseState) {
                        mouseState = true
                        selectEntity = ""
                        d3.selectAll(".selected").classed("selected", false);
                        d3.selectAll(".connected").classed("connected", false);
                        d3.selectAll("line").classed("linkSelected", false);
                        d3.selectAll(".block").classed("block", false);
                        node.each(function () {
                            d3.select(this).classed("disconnected", false);
                        });

                    }
                });


            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            simulation
                .force("link")
                .links(graph.links);

            //zoom
            let zoom_handler = d3.zoom()
                .scaleExtent([1 / 2, 3])
                .on("zoom", zoom_actions);

            // zoom transform.k , x , y の初期化 
            zoom_handler.transform(svg, d3.zoomIdentity);

            svg.call(zoom_handler);

            function zoom_actions() {
                g.attr("transform", d3.event.transform)
                _self.props.actions.zoomScale(d3.zoomTransform(svg.node()).k)
            }


            function clicked(d) {
                if (selectEntity == d.entity) {
                    _self.props.actions.updateData(d.entity, d.id)
                } else {
                    if (!mouseState) _self.props.actions.changeComCode(d.code, d.id, d.country, d.industry, d.entity)
                    mouseState = false
                    selectEntity = d.entity

                    d3.selectAll(".selected").classed("selected", false);
                    d3.selectAll(".connected").classed("connected", false);
                    d3.selectAll("line").classed("linkSelected", false);
                    d3.selectAll(".block").classed("block", false);


                    d3.select(this).classed("selected", true);
                    d3.select(this).selectAll("text").classed("block", true);

                    node.each(function (v) {
                        d3.select(this).classed("disconnected", true);
                    });

                    d3.selectAll("line")
                        .filter(function (v, i) {
                            if (d == v.source) {
                                node.each(function (vj, j) {
                                    if (v.target == vj) d3.select(this).classed("connected", true);
                                });
                                return true;
                            } else if (d == v.target) {
                                node.each(function (vj, j) {
                                    if (v.source == vj) d3.select(this).classed("connected", true);
                                });
                                d3.selectAll("line").filter(function (l) {
                                    if (v.source == l.target && l.source.group == 0) {
                                        node.each(function (vj, j) {
                                            if (l.source == vj) d3.select(this).classed("connected", true);
                                        });
                                        return true
                                    }
                                }).classed("linkSelected", true)
                                return true;
                            }
                        }).classed("linkSelected", true)
                    d3.event.stopPropagation();
                }
            }

            function ticked() {
                link
                    .attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                circles
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
                labels
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3)
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }
        }
    }


    render() {
        const _self = this;
        return (
            <div className="main">
                {<style jsx global>{`
            .main {
                height: calc(100vh - 106px);
                min-height: 600px;
                overflow:hidden;
                position:relative;
            }
            .links line {
            //   stroke: #999;
              stroke-opacity: 0.6;
            }
            .circle {
              stroke: #fff;
              stroke-width: 0.5px;
            }
            .selected {
                opacity: 1 !important;
                fill: blue;
            }
            .linkSelected {
                stroke: red !important;
                opacity: 1 !important;
            }
            .connected {
                opacity: 1 !important;
            }

            .disconnected{
                opacity: 0.1;
            }
            .visible{
                display:none;
            }
            .block{
                display block !important;
            }
            .text-over{
                fill: blue;
                text-decoration: underline;
                cursor: pointer;
            }

        `}</style>}
                <svg className="d3-svg" width={"100%"} height={"calc(100% - 6px)"}></svg>
            </div>
        )
    }
}



const mapStateToProps = (state) => ({
    supplyForceData: state.Force.supplyForceData,
    history: state.Force.history,
    rbics: state.Filter.rbics,
    country: state.Filter.country,
    power: state.Header.power,
    filterType: state.Filter.filterType,
    cnList: state.Table.cnList,
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),

})

const view = connect(mapStateToProps, mapDispatchToProps)(Force)
export { view }


