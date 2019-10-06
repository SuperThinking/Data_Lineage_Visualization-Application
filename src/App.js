import React, { Component } from 'react';
import Connection from './components/connections';
import ReactFileReader from 'react-file-reader';
import Table from './components/table';
import _ from 'underscore';
const csv = require('csvtojson');

/* Helper Variables */
var uniqueMap = {}; //Stores all connections in the form {a:{b, c, d}, b:{e, f, g}, f:{k}...}
var hops = 0; //For keeping count of the number of hops
var connectionCount = 0; //Keep track of the line number (connection) and helps in forming ID of each connection
var helper = {}; //Helps in storing all the elements/column attributes of a single hop
var allConnections = []; //Array of [fromElement, toElement, connectionCount]
var columnPath = {}; //Stores the connection ids of the elements emerging from it {fromElement1:[connectionIDs],...,fromElementN:[connectionIDs]}
var backTo = 0; //Keep tracks of the last visited node by storing its offset value
var recCheck = {}; //Keep tracks that their is no cycles in between by storing the visited node
var ddd; //Might use this variable when finding different types of lineages

class App extends Component {
    state = {
        nodes: [], //Stores [[hop1, {element1:1, ..., elementn:1}],...]
        status: "Load Data",
        allConnections: [], //Array of [fromElement, toElement, connectionCount]
        f1:"",
        f2:"",
        f3:"",
        f4:"",
        f5:""
    }
    resetVariables = ()=>{
        hops = 0;
        connectionCount = 0;
        helper = {};
        allConnections = [];
        columnPath = {};
        backTo = 0;
        recCheck = {}
        this.setState({nodes:[], allConnections:[]});
        this.directDomChange('showMoreButtons', 'visibility', 'visible');
    }
    directDomChange = (a, b, c)=>{
        if(document.getElementById(a))
            document.getElementById(a).style[b] = c;
    }
    onCsvUpload = (data) => {
        this.resetVariables();uniqueMap={};
        ddd = data;
        data.forEach(e => {
            var a1 = [e['From1'], e['From2'], e['From3'], e['From4'], e['From5']];
            var a2 = [e['To1'], e['To2'], e['To3'], e['To4'], e['To5']];
            if (a1 in uniqueMap)
                uniqueMap[a1][a2]=1;
            else
            {
                uniqueMap[a1] = {[a2]:1};
            }
        });
    }
    handleFiles = files => {
        var fNameEx = files[0].name.split('.');
        if (fNameEx[fNameEx.length - 1] === "csv") {
            var reader = new FileReader();
            this.setState({ status: <img src={require('./images/loading.gif')} alt='Loading CSV..' /> })
            reader.onload = e => {
                //reader.result => csv
                csv().fromString(reader.result).then(data => {
                    this.directDomChange('loadLineage', 'display', 'inline-block')
                    this.onCsvUpload(data);
                    console.log(uniqueMap);
                    this.setState({ status: <p>CSV Uploaded<br />Now fill the info. about the column whose lineage is to be visualized.</p> })
                });
            };
            reader.readAsText(files[0]);
        }
        else {
            alert("Choose a CSV file");
        }
    }
    notViews = (id, x) => {
        if (!(x in uniqueMap))
            return;
        _.keys(uniqueMap[x]).forEach(y => {
            y = y.split(',');
            if (!y[2].includes('VIEWS')) {
                allConnections.push([id, y.slice(0, 5).join("//")+"//"+hops, connectionCount]);
                (id in columnPath) ? columnPath[id].push("lineNo" + connectionCount++) : columnPath[id] = ["lineNo" + connectionCount++];
                helper[y] = 1;
            }
            else
                this.notViews(id, y);
        });
    }
    copyByValue = (x)=>{
        var a = new Array(x.length);
        for (var i=0; i<x.length; ++i)
            a[i] = x[i].slice(0);
        return a;
    }
    showTill = (x) => {
        let till = (x===-1)?-1:7;
        let nodes = this.copyByValue(this.state.nodes);
        while(till!==0)
        {
            let lastHopElements = _.keys(nodes[nodes.length-1][1]);
            helper = {};
            let a = [++hops];
            let anyChange = 0;
            for(let i=0; i<lastHopElements.length; i++)
            {
                let data = lastHopElements[i].split(',');
                let id = data.slice(0, 5).join("//")+"//"+(hops-1);
                if(data in uniqueMap && !(data in recCheck))
                {
                    recCheck[data] = 1;
                    _.keys(uniqueMap[data]).forEach(x=>{
                        x = x.split(',');
                        if (x[2].includes('VIEWS'))
                            this.notViews(id, x);
                        else {
                            allConnections.push([id, x.slice(0, 5).join("//")+"//"+hops, connectionCount]);
                            (id in columnPath) ? columnPath[id].push("lineNo" + connectionCount++) : columnPath[id] = ["lineNo" + connectionCount++];
                            helper[x] = 1;
                        }
                    });
                    anyChange = 1;
                }
            }
            if(anyChange){
                a.push(helper);
                nodes.push(a);
                till--;
            }
            else{
                this.directDomChange('showMoreButtons', 'visibility', 'hidden');
                break;
            }
        }
        console.log("NODE LINEAGE : ", nodes);
        console.log("CONNECTIONS : ", allConnections);
        this.setState({nodes:this.copyByValue(nodes)});
    }
    showAll = ()=>{
        this.showTill(-1);
    }
    onClick = (x) => {
        var n = document.getElementsByClassName('hoverStrokes').length;
        if (n)
            for (let i = 0; i < n; i++)
                document.getElementById(document.getElementsByClassName('hoverStrokes')[0].id).classList.remove('hoverStrokes');
        if (x in columnPath) {
            var scTo = document.getElementById(columnPath[x][0]).getAttribute('d').split(" ");
            backTo = document.getElementById(x).offsetLeft;
            window.scrollTo(parseInt(scTo[8]) - (document.body.offsetWidth / 2), parseInt(scTo[9]) - (window.outerHeight / 2));
            columnPath[x].forEach(a => {
                if (document.getElementById(a))
                    document.getElementById(a).classList.add('hoverStrokes');
            });
        }
    }
    handleScroll = () => {
        if (document.body.scrollLeft > 20 || document.documentElement.scrollLeft > 20)
            this.directDomChange('scrollBack', 'display', 'block');
        else
            this.directDomChange('scrollBack', 'display', 'none');
    }
    goLeft = () => {
        document.body.scrollLeft = backTo;
        document.documentElement.scrollLeft = backTo;
        backTo = 0;
    }
    updateConnections = ()=>{
        this.setState({allConnections:this.copyByValue(allConnections)});
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        // this.jsonToLineage();
    }
    typeOfLineage = (a)=>{
        this.resetVariables();uniqueMap={};
        ddd.forEach(e => {
            var a1 = [e['From1'], e['From2'], e['From3'], e['From4'], e['From5']];
            var a2 = [e['To1'], e['To2'], e['To3'], e['To4'], e['To5']];
            for(let i=0; i<a.length; i++)
            {
                if(a[i]==='')
                {
                    a1[i] = "";
                    a2[i] = "";
                }

            }
            if (a1 in uniqueMap)
                uniqueMap[a1][a2]=1;
            else
            {
                uniqueMap[a1] = {[a2]:1};
            }
        });
        console.log(JSON.stringify(uniqueMap));
    }
    getTheFlow = ()=>{
        this.setState({status:1});
        this.resetVariables();
        var of = [this.state.f1, this.state.f2, this.state.f3, this.state.f4, this.state.f5];
        // this.typeOfLineage(of);
        this.setState({ nodes: [[hops, {[of]:1}]] });
        console.log(this.state.nodes);
    }
    inputChange = (e)=>{
        this.setState({[e.target.id]:e.target.value.trim()});
    }
    metadataJson = (data)=>{
        this.resetVariables();uniqueMap={};
        data.forEach(e => {
            var a1 = e['filter'];
            var a2 = [e['id']];
            if (a1 in uniqueMap)
                uniqueMap[a1][a2]=1;
            else
            {
                uniqueMap[a1] = {[a2]:1};
            }
        });
    }
    render() {
        return (
            <div>
                <div className='fixed-content'>
                <ReactFileReader handleFiles={this.handleFiles} className="upload-button">
                    <button className='btn'>Upload CSV</button>
                </ReactFileReader>
                <div className='getInput'><input id='f1' value={this.state.f1} type='text' placeholder='F1' onChange={this.inputChange}/><input id='f2' value={this.state.f2} type='text'  placeholder='F2' onChange={this.inputChange} /><input id='f3' value={this.state.f3} type='text' placeholder='F3' onChange={this.inputChange} /><input id='f4' value={this.state.f4} type='text' placeholder='F4' onChange={this.inputChange} /><input id='f5' value={this.state.f5} type='text' placeholder='F5' onChange={this.inputChange} /><input type='button' id='loadLineage' onClick={this.getTheFlow} value='Find Lineage' /></div>
                </div>
                <hr/>
                <div id='flow'>
                    {
                        (this.state.status===1) ? <div><Table updateConnections={this.updateConnections} showAll={this.showAll} showMore={this.showTill} initial={this.state.nodes} hops={hops} onClick={this.onClick} /><img id='scrollBack' src={require('./images/back.png')} alt='Go Back' onClick={this.goLeft} /></div> : this.state.status
                    }
                    <Connection connections={this.state.allConnections} />
                </div>
            </div>
        )
    }
};

export default App;