import React, {Component} from 'react';
import ZoneLegend from './legend';
import _ from 'underscore';
 
var zones = {};
class Table extends Component
{
    onClick = (e)=>{
        this.props.onClick(e.target.id);
    }
    componentDidUpdate(pp, ps)
    {
        this.props.updateConnections();
    }
    shouldComponentUpdate(np, ns)
    {
        if(this.props.initial.length===np.initial.length && JSON.stringify(this.props.initial[0])===JSON.stringify(np.initial[0]))
            return false;
        return true;
    }
    render()
    {
        var modification = this.props.initial.map(x=>{
            return(
            <div id={"HOP"+x[0]} key={"HOP"+x[0]}>
                {
                    _.keys(x[1]).map(y=>{
                        y = y.split(',');
                        zones[y[1]] = 1;
                        return(
                            <table id={y[0]+"//"+y[1]+"//"+y[2]+"//"+y[3]+"//"+y[4]+"//"+x[0]} key={y[0]+"//"+y[1]+"//"+y[2]+"//"+y[3]+"//"+y[4]} className={"tb "+y[1]+" legend"+_.keys(zones).indexOf(y[1])} onMouseDown={this.onClick} align="center">
                                <thead><tr><th>{y[2]+" | "+y[3]}</th></tr></thead>
                                <tbody id='tb-tbody'><tr><td>{y[0]+" | "+y[4]}</td></tr></tbody>
                            </table>
                        );
                    })
                }
            </div>
            )
        });
        return(
            <div>
                <div id="structure">
                    {modification}
                </div>
                <div id='showMoreButtons'>
                    <button onClick={this.props.showMore} id='showMore'>SHOW MORE</button>
                    <button onClick={this.props.showAll} id='showAll'>SHOW ALL</button>
                </div>
                <ZoneLegend zones={zones}/>
            </div>
        );
    }
}

export default Table;