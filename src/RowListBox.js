// RowListBox.js
import React from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Select from 'react-select';

const SpanDiscourseMarker = styled.span`
    font-size: 12px;
    font-weight: normal;
    color: black;
    border: 1px solid lightgrey;
    padding: 1px;
    border: 1px;
    background: #f0ebfa;
`;

const SpanDiscourseMarkerFaded = styled.span`
    font-size: 12px;
    font-weight: normal;
    color: #B0B0B0;
    border: 1px solid lightgrey;
    padding: 1px;
    border: 1px;
    background: #f0ebfa;
`;

export default class RowListBox extends React.Component {
  // Constructor  
  constructor() {    
    super()    
    this.uniqueName = "uniqueName"      // Should be set by render()
    this.value = "TestValue"

  }

  mkList() {
    var out = []        
    for (var i=0; i<this.connectives.length; i++) {        
        var connectiveID = this.connectives[i][0]
        out.push( (<option value={connectiveID}> {this.connectives[i][1]} </option>) )
    }
    return out
  }

  /*
   * Separate text into main and that between square brackets
   */ 
  separateTextSquareBrackets(contentStr) {    
    var contentMainStr = ""
    var contentGreyedStr = ""

    var blockStart = contentStr.indexOf("[")
    var blockEnd = contentStr.lastIndexOf("]")
    if ((blockStart > 0) && (blockEnd > 0)) {
      contentMainStr = contentStr.substring(0, blockStart) + " "
      contentGreyedStr = contentStr.substring(blockStart)
    } else {
      contentMainStr = contentStr
    }

    var out = {mainStr:contentMainStr, greyedStr:contentGreyedStr};    
    return out;
  }


  buttonClick = result => {
    //console.log("buttonClick()")    
    //console.log(result)    
    //console.log(this.uniqueName)

    // Get the value of the selection
    var selectBox = document.getElementById(this.uniqueName);
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    //var selectedValue = selectBox.options[selectBox.selectedIndex];
    //console.log(selectedValue)
    this.value = selectedValue

    // Call the user-supplied callback with the value
    this.callback({
            uniqueName: this.uniqueName,
            value: this.value,
            textValue: this.connectivesLUT.get(this.value)
        })
    
  }


  render() {
    // Retrieve discourse options passed in from index.js
    //this.discourseOptions = this.props.discourseOptions;
    this.connectives = this.props.connectives
    this.connectivesLUT = this.props.connectivesLUT
    this.connectivesReverseLUT = this.props.connectivesReverseLUT

    this.callback = this.props.selectCallback

    // The currently connectived selective for this row (passed in from the main call)
    var selectedConnective = this.props.selectedConnective
    if (typeof(selectedConnective) == "undefined") selectedConnective = ""
    var selectedConnectiveSplit = this.separateTextSquareBrackets(selectedConnective)    
    var selectedID = ""
    //console.log(this.connectivesReverseLUT)
    //if (selectedConnective in this.connectivesReverseLUT) {
        selectedID = this.connectivesReverseLUT.get(selectedConnective)
    //}

    //console.log("selectedConnective: " + selectedConnective)
    //console.log("selectedConnectiveID: " + selectedID)
/*
    for (var i=0; i<this.connectives.length; i++) {
        out.push( (<option value="item-1"> {this.connectives[i]} </option>) )
    }
*/
    this.uniqueName = this.props.uniqueName     
    //console.log(this.connectivesLUT)
    //console.log("selectedID: " + selectedID)
    return (
        <div>
            <SpanDiscourseMarker> {selectedConnectiveSplit.mainStr} </SpanDiscourseMarker>
            <SpanDiscourseMarkerFaded> {selectedConnectiveSplit.greyedStr} </SpanDiscourseMarkerFaded>
        <select id={this.uniqueName} value={selectedID} style={{ fontSize: '12px', width: '20px'}} onChange={this.buttonClick}>
            <option value="blank">  </option>
            {this.mkList()}
        </select>
        </div>
    )

  }
}