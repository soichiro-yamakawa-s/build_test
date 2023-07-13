import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ForceComponent from './Force'
import * as HeaderComponent from './Header'
import * as d3 from 'd3';


// ----- initial state --- 
export const initialState = {

};

// ---- type ----- 

export const types = {

};



// ---- action ----- 

export const actions = {
    changeComCode(code , name , country , industry , entity) {
        return { type: ForceComponent.types.COMPANY_DATA, payload: { "code": code , "name": name , "country": country , "industry": industry , "entity": entity} }
    },
    updateData(entity, name) {
        return { type: ForceComponent.types.CHANGE_FETCH_DATA_TREE, payload: { "entity": entity, "name": name } }
    },
    backData(value) {
        return { type: ForceComponent.types.BACK_DATA, payload: value }
    }
}



// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.DATA_UPDATED:
            return { ...state, supplyData: payload }
        default:
            return state
    }
}


// ---- Component ----

// 7,左右にサプライヤー　カスタマー

class Tree extends Component {
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
        const _self = this;
        var root = d3.hierarchy(_self.props.supplyData);
        var height = 1080;
        var width = 1400;
        let grandChild = {};
        let grandChild2 = {};
        let depth0 = 0;
        let depth1 = 0;
        let depth2 = 0;
        let depth3 = 0;
        let depth4 = 0;
        let depth5 = 0;
        let mouseState = true;
        let selectEntity = "";
        let backD = ""
        if (_self.props.history.length >= 2) backD = _self.props.history[_self.props.history.length - 2]
        // 3. 描画用のデータ変換

        var tree = d3.tree()
            // .size([height, width])
        //  .nodeSize([50,300]) ;
        //.separation(function(a, b) { return(a.parent == b.parent ? 1 : 1); });

        tree(root);
        //各ノードが持つ末端ノードの数を付与
        root.count();
        d3.select("g").remove();
        //位置やサイズ情報

        const basicSpace = {
            padding: 10,
            height: 10,
            height2: 40,
            width: 300
        };


        //位置決め
        const definePos = (treeData, spaceInfo) => {
            depth2 = 0
            treeData.each((d) => {
                if (d.depth == 0) {
                    d.y = 40 + d.depth * spaceInfo.width;
                    d.x = spaceInfo.padding + depth0 * spaceInfo.height;
                    d.stat = true
                } else if (d.depth == 1) {
                    d.y = spaceInfo.padding + d.depth * spaceInfo.width;
                    d.x = spaceInfo.padding + depth1 * spaceInfo.height2;
                    d.stat = true
                    depth1++
                } else if (d.depth == 2) {
                    let check = duplicate(d.data.name, spaceInfo.padding + depth2 * spaceInfo.height);
                    d.y = spaceInfo.padding + d.depth * spaceInfo.width;
                    d.x = check.x;
                    d.stat = check.stat
                    depth2++
                }
            })
        }
        const duplicate = (name, x) => {
            if (grandChild[name]) return { "x": grandChild[name] , "stat": false }

            grandChild[name] = x;
            depth2++
            return {"x" : x, "stat": true }
        }
        definePos(root, basicSpace);

        // 4. svg要素の配置

        d3.select("g").remove();

        var g = d3.select("#d3-svg-tree").append("g").attr("transform", "translate(200,0)");
        var link = g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("stroke", "#999")
            .attr("d", function (d) {
                return "M" + (width / 2 - d.y) + "," + d.x +
                    "C" + (width / 2 - d.parent.y - 200) + "," + d.x +
                    " " + (width / 2 - d.parent.y - 300) + "," + d.parent.x +
                    " " + (width / 2 - d.parent.y) + "," + d.parent.x;
            });

        var node = g.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + (width / 2 - d.y) + "," + d.x + ")"; })
            .on("click", clicked);

        d3.selectAll("#d3-svg-tree")
            .on('click', function (d) {
                if (!mouseState) {
                    mouseState = true
                    d3.selectAll(".selected").classed("selected", false);
                    d3.selectAll(".connected").classed("connected", false);
                    d3.selectAll("path").classed("linkSelected", false);
                    d3.selectAll(".block").classed("block", false);
                    node.each(function (v) {
                        d3.select(this).classed("disconnected", false);
                    });
                    node2.each(function (v) {
                        d3.select(this).classed("disconnected", false);
                    });
                }
                d3.selectAll(".text-over").classed("text-over", false);
            });

        function clicked(d) {
            if(d.depth == 0) return
            if(selectEntity == d.data.entity){
                _self.props.actions.updateData(d.data.entity, d.data.name)
            } 
            if (!mouseState) _self.props.actions.changeComCode(d.data.code, d.data.name, d.data.country, d.data.industry, d.data.entity)
            mouseState = false
            selectEntity = d.data.entity
            d3.selectAll(".selected").classed("selected", false);
            d3.selectAll(".connected").classed("connected", false);
            d3.select("#d3-svg-tree").selectAll("path").classed("linkSelected", false);
            d3.selectAll(".block").classed("block", false);
            d3.select(this).classed("selected", true);
            d3.select(this).selectAll("text").classed("block", true);
            node.each(function (v) {
                if (v.depth != 0 && d.data.name !== v.data.name) d3.select(this).classed("disconnected", true);
            });
            node2.each(function (v) {
                if (v.depth != 0 && d.data.name !== v.data.name) d3.select(this).classed("disconnected", true);
            });

            if (d.depth == 1) {
                let child = [];
                d3.select("#d3-svg-tree").selectAll("path").filter(function (v, i) {
                    if (d.data.name == v.data.name && v.depth == 1) {
                        node.each(function (vj, j) {
                            if (v.parent.data.name == vj.data.name && vj.depth == 0) d3.select(this).classed("connected", true);

                            if (v.children) {
                                for (let count = 0; count < v.children.length; count++) {
                                    if (v.children[count].data.name == vj.data.name && vj.depth == 2) {
                                        d3.select(this).classed("connected", true);
                                        child.push(vj.data.name)
                                    }
                                }
                            }
                        });
                        node2.each(function (vj, j) {
                            if (v.parent.data.name == vj.data.name && vj.depth == 0) d3.select(this).classed("connected", true);

                            if (v.children) {
                                for (let count = 0; count < v.children.length; count++) {
                                    if (v.children[count].data.name == vj.data.name && vj.depth == 2) {
                                        d3.select(this).classed("connected", true);
                                        child.push(vj.data.name)
                                    }
                                }
                            }
                        });
                        return true;
                    }
                }).classed("linkSelected", true);

                d3.select("#d3-svg-tree").selectAll("path").filter(function (l) {
                    if (l.depth == 2) {
                        for (let count = 0; count < child.length; count++) {
                            if (child[count] == l.data.name && d.data.name == l.parent.data.name) return true
                        }
                    }
                }).classed("linkSelected", true)
            }

            //最短距離
            if (d.depth == 2) {
                d3.select("#d3-svg-tree").selectAll("path").filter(function (v, i) {

                    if (d.data.name == v.data.name && v.depth == 2) {
                        node.each(function (vj, j) {
                            if (v.data.name == vj.data.name && vj.depth == 2) d3.select(this).classed("connected", true);
                            if (v.parent.data.name == vj.data.name && vj.depth == 1) d3.select(this).classed("connected", true);

                        });
                        node2.each(function (vj, j) {
                            if (v.data.name == vj.data.name && vj.depth == 2) d3.select(this).classed("connected", true);
                            if (v.parent.data.name == vj.data.name && vj.depth == 1) d3.select(this).classed("connected", true);

                        });
                        return true;
                    }
                }).classed("linkSelected", true);
            }
            d3.event.stopPropagation();
        }





        node.append("circle")
            .attr("r", 1)
            .attr("fill", "#999");

        node.append("text")
            .attr("dy", 3)
            .attr("x", function (d) { return d.depth == 2 ? -12 : 12 })
            .style("text-anchor", function (d) { return d.depth == 2 ? "end" : "start"; })
            .attr("font-size", "12px")
            .on("mouseover", function (d) {
                if (mouseState) _self.props.actions.changeComCode(d.data.code, d.data.name,d.data.country,d.data.industry,d.data.entity)
                if(d.depth != 0){
                    d3.selectAll(".text-over").classed("text-over", false);
                    d3.select(this).classed("text-over", true);
                }
            })
            .attr("opacity", function (d) {
                if(_self.props.filterType == "highlight" && d.depth != 0){
                    if (_self.props.country != "国" && _self.props.rbics != "業種") {
                        return (_self.props.country == _self.props.cnList[d.data.country] && _self.props.rbics == d.data.industry) ? "1.0" : "0.1"
                    } else {
                        return (_self.props.country == "国" && _self.props.rbics == "業種") || ((_self.props.country != "国" && _self.props.country == _self.props.cnList[d.data.country]) || (_self.props.rbics != "業種" && _self.props.rbics == d.data.industry)) ? "1.0" : "0.1"
                        
                    }
                }
            })
            .on("mouseout", function (d) {
                d3.selectAll(".text-over").classed("text-over", false);
            })
            .text(function (d) { if(d.stat) return d.data.name; });

        var root2 = d3.hierarchy(_self.props.supplyData2);

        tree(root2);
        //各ノードが持つ末端ノードの数を付与
        root2.count();

        //位置やサイズ情報
        const definePos2 = (treeData, spaceInfo) => {
            depth5 = 0
            treeData.each((d) => {
                if (d.depth == 0) {
                    d.y = 40 + d.depth * spaceInfo.width;
                    d.x = spaceInfo.padding + depth3 * spaceInfo.height;
                    d.stat = true
                } else if (d.depth == 1) {
                    d.y = spaceInfo.padding + d.depth * spaceInfo.width;
                    d.x = spaceInfo.padding + depth4 * spaceInfo.height2;
                    d.stat = true
                    depth4++
                } else if (d.depth == 2) {
                    let check = duplicate2(d.data.name, spaceInfo.padding + depth5 * spaceInfo.height);
                    d.y = spaceInfo.padding + d.depth * spaceInfo.width;
                    d.x = check.x;
                    d.stat = check.stat
                    depth5++
                }
            })
        }
        const duplicate2 = (name, x) => {
            if (grandChild2[name]) return { "x": grandChild2[name] , "stat": false }

            grandChild2[name] = x;
            depth5++
            return {"x" : x, "stat": true }
        }

        definePos2(root2, basicSpace);

        // 4. svg要素の配置


        var g2 = d3.select("#d3-svg-tree").append("g").attr("transform", "translate(200,0)");
        var link2 = g2.selectAll(".link")
            .data(root2.descendants().slice(1))
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("stroke", "#999")
            .attr("d", function (d) {
                return "M" + (width / 2 + d.y) + "," + d.x +
                    "C" + (width / 2 + d.parent.y + 200) + "," + d.x +
                    " " + (width / 2 + d.parent.y + 300) + "," + d.parent.x +
                    " " + (width / 2 + d.parent.y) + "," + d.parent.x;
            });

        var node2 = g2.selectAll(".node")
            .data(root2.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + (width / 2 + d.y) + "," + d.x + ")"; })
            .on("click", clicked);

        node2.append("circle")
            .attr("r", 1)
            .attr("fill", "#999");

        node2.append("text")
            .attr("dy", 3)
            .attr("x", function (d) { return d.depth == 2 ? 12 : 12 })
            .style("text-anchor", function (d) { return d.depth == 2 ? "start" : "end"; })
            .attr("font-size", "12px")
            .on("mouseover", function (d) {
                if (mouseState) _self.props.actions.changeComCode(d.data.code, d.data.name,d.data.country,d.data.industry,d.data.entity)
                if(d.depth != 0){
                    d3.selectAll(".text-over").classed("text-over", false);
                    d3.select(this).classed("text-over", true);
                }
            })
            .attr("opacity", function (d) {
                if(_self.props.filterType == "highlight" && d.depth != 0){
                    if (_self.props.country != "国" && _self.props.rbics != "業種") {
                        return (_self.props.country == _self.props.cnList[d.data.country] && _self.props.rbics == d.data.industry) ? "1.0" : "0.1"
                    } else {
                        return (_self.props.country == "国" && _self.props.rbics == "業種") || ((_self.props.country != "国" && _self.props.country == _self.props.cnList[d.data.country]) || (_self.props.rbics != "業種" && _self.props.rbics == d.data.industry)) ? "1.0" : "0.1"
                        
                    }
                }
            })
            .on("mouseout", function (d) {
                d3.selectAll(".text-over").classed("text-over", false);
            })
            .text(function (d) { if(d.stat) return d.data.name; });


        

    }
    render() {
        const _self = this;
        return (
            <div className="tree-main">
                {<style jsx global>{`
                  .tree-main {
                      height: calc(100vh - 126px);
                      padding-top: 20px;
                      min-height: 600px;
                      overflow:auto;
                  }
                  .link {
                      fill: none;
                      stroke-opacity: 0.3;
                      stroke-width: 0.5px;
                  }
                  .link:hover{
                      color: red;
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
                    stroke-opacity: 1 !important;
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
                <svg 
                    id="d3-svg-tree"
                    width={1880} 
                    height={_self.props.supplyData.count > _self.props.supplyData2.count 
                            ? _self.props.supplyData.count * 20 
                            : _self.props.supplyData2.count * 20} 
                    ref={node => this.node = node}>
                </svg>
            </div>
        )
    }

}







const mapStateToProps = (state) => ({
    supplyData: state.Force.supplyData,
    supplyData2: state.Force.supplyData2,
    width: state.Force.width,
    height: state.Force.height,
    displaySize: state.Force.displaySize,
    history: state.Force.history,
    sc: state.Tab.sc,
    rbics: state.Filter.rbics,
    country: state.Filter.country,
    fontFamily: state.Header.fontFamily,
    filterType: state.Filter.filterType,
    cnList: state.Table.cnList,
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),

})

const view = connect(mapStateToProps, mapDispatchToProps)(Tree)
export { view }



