import React, {Component} from 'react';

class Connection extends Component
{
    findAbsolutePosition=(htmlElement)=>{
        // var x = htmlElement.offsetLeft;
        // var y = htmlElement.offsetTop;
        for (var x=0, y=0, el=htmlElement; el != null; el = el.offsetParent) {
          x += el.offsetLeft;
          y += el.offsetTop;
        }
        return {
          "x": x,
          "y": y,
          "width": htmlElement.offsetWidth,
          "height": htmlElement.offsetHeight
        };
    }

    shouldComponentUpdate(np, ns)
    {
        if(np.connections.length===this.props.connections.length)
            return false;
        return true;
    }

    render() {
        var directedConnections = this.props.connections.map(x=>{
            let x1 = this.findAbsolutePosition(document.getElementById(x[0]));
            let x2 = this.findAbsolutePosition(document.getElementById(x[1])), tension = -1;
            let v = [(x1.x+(x1.width/2)), (x1.y+x1.height), (x1.x+(x1.width/2)), ((x1.y+x1.height)-(((x2.y-8)-(x1.y+x1.height))*tension)), (x2.x+(x2.width/2)), ((x2.y-8)+(((x2.y-8)-(x1.y+x1.height))*tension)), (x2.x+(x2.width/2)), (x2.y-8)];
            return(
                <path key={"lineNo"+x[2]} d={"M "+v[0]+" "+v[1]+" C "+v[2]+" "+v[3]+" "+v[4]+" "+v[5]+" "+v[6]+" "+v[7]} fill="none" stroke="blue" id={"lineNo"+x[2]} markerStart="url(#dot)" markerEnd="url(#triangle)"></path>
            )
        })
        return(
        <svg id="svg-canvas" width={document.body.scrollWidth} height={document.body.scrollHeight} xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <marker id="cotriangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="10" markerHeight="8" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                <marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="10" markerHeight="8" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"><circle cx="5" cy="5" r="5" fill="blue"></circle></marker>
            </defs>
            {directedConnections}
        </svg>
        )
     }
    
}

export default Connection;