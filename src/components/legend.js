import React, { Component } from "react";
import _ from "underscore";

class ZoneLegend extends Component {
  render() {
    var i = 0;
    var leg = _.keys(this.props.zones).map(x => {
      return (
        <tr key={"legendOf" + x}>
          <td className={"colorData legend" + i++}></td>
          <td>{x}</td>
        </tr>
      );
    });
    return (
      <table id="legend">
        <tbody id="ltb">{leg}</tbody>
      </table>
    );
  }
}

export default ZoneLegend;
