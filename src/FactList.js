// FactList.js

import React, { useEffect, Component } from 'react';
import PropTypes from 'prop-types';
//import React, { Component } from 'react';
import { DndProvider, DragSource } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Select from 'react-select';

// Key for write-in discourse markers
const writeInKey = 'writein'
const sectionMarker = 'block-section'

const TableRow = styled.div`
  display: flex;
  border: 1px solid lightgrey;
  padding: 2px;
  margin-bottom: 8px;
  border-radius: 2px;  
  background-color: ${props => (props.isDragging ? 'lightgreen' : props.bgcolor)};  
  color: ${props => (props.taskId.startsWith('blank') ? 'lightgrey' : 'black')}
  min-height: 35px;
  max-height: 35px;
  height: 35px;  
`;

const TableCell = styled.td`
  display: inline;
  width: ${props => (props.width)};  
  align-items:center;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 26px;      
  font-size: 12px;
  user-select: none;
`;


const SpanGray = styled.div`
  display: inline;
  color: grey;
`;

export class FactList extends React.Component {
  // Constructor  
  constructor() {    
    super()    

  }

  populateDefaultMarkers() {
      var out = [];

      out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-bg1", name: 'As background,' }}/>)
      out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-core1", name: 'The core concepts to know to answer this question are:' }}/>)
      out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-ex1", name: 'In this example, [grounding concept in example]' }}/>)
      out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-add1", name: 'While not critical to answer the question, it may be helpful to know that' }}/>)
      out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-summary1", name: 'In summary, [inference/conclusion]' }}/>)      
      out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-syn1", name: 'Some word synonymy relations you might need to know to answer this question are:' }}/>)      

      return out;
  }

  render() {
    // Retrieve discourse options passed in from index.js
    //this.discourseOptions = this.props.discourseOptions;
    this.factOptions = this.props.factOptions
    this.factFilter = this.props.factFilter 
    this.markers = this.props.markerList

    // console.log("FactOptions:")
    // console.log(this.factOptions)

    var out = [];
    // Populated by default    
    out.push( <YourExternalNodeComponent node={{ className:"icon-c", id: writeInKey, name: 'Write-in' }}/>)
    out.push( <YourExternalNodeComponent node={{ className:"icon-d", id: sectionMarker, name: '[Section Marker]' }}/>)    

    // Populate default markers
    //out = out.concat(this.populateDefaultMarkers())
    out = out.concat(this.markers)

    // Populated from data
    for (let key in this.factOptions) {
        var originalFact = this.factOptions[key]
        /*
        if (!originalFact.id.startsWith("blank")) {            
            
            originalFact['className'] = 'unknown'
            if (originalFact.id.startsWith("task")) {            
                originalFact['className'] = 'notassigned'
            } else if (originalFact.id.startsWith("marker")) {
                originalFact['className'] = 'icon-a'
            } else if (originalFact.id.startsWith("disc")) {
                originalFact['className'] = 'icon-b'
            } else if (originalFact.id.startsWith("writeInKey")) {
                originalFact['className'] = 'icon-c'
            } else if (originalFact.id.startsWith("sectionMarker")) {
                originalFact['className'] = 'icon-d'
            } 
            */   
        if (originalFact.id.startsWith("task")) {            
            originalFact['className'] = 'fact'
            originalFact['name'] = originalFact['content']

            out.push( <YourExternalNodeComponent node={originalFact} />)
        }        
    }

    /*
    for (var i=0; i<10; i++) {
      out.push( <YourExternalNodeComponent node={{ className:"icon-a", name: 'Baby Rabbit' }} />    )
    }
    */

    // Fact filtering (post)    
    var filteredOut = []
    for (var i=0; i<out.length; i++) {
        var originalFact = out[i]
        //console.log(originalFact)

        // Handle filtering
        var includeRow = false
        if (this.factFilter.length == 0) {
            includeRow = true
        } else {
            for (var j=0; j<this.factFilter.length; j++) {
                if (originalFact.props.node.id.startsWith( this.factFilter[j]) ) {
                    includeRow = true
                    // console.log("Include row on filter: " + this.factFilter[j])
                    // console.log(originalFact.props.node)
                }
            }
        }

        if (includeRow) {
            filteredOut.push( out[i] )
        }
    }

    return (
      filteredOut
    )

  }
}





// ----------


// -------------------------
// Create an drag source component that can be dragged into the tree
// https://react-dnd.github.io/react-dnd/docs-drag-source.html
// -------------------------
// This type must be assigned to the tree via the `dndType` prop as well

export const externalNodeType = 'yourNodeType';
const externalNodeSpec = {
  // This needs to return an object with a property `node` in it.
  // Object rest spread is recommended to avoid side effects of
  // referencing the same object in different trees.
  beginDrag: componentProps => ({ node: { ...componentProps.node } }),
};
const externalNodeCollect = (connect) => ({
  connectDragSource: connect.dragSource(),
  // Add props via react-dnd APIs to enable more visual
  // customization of your component
  // isDragging: monitor.isDragging(),
  // didDrop: monitor.didDrop(),
});
class externalNodeBaseComponent extends Component {

  
  // Separate text into main and that between square brackets
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


  render() {
    const { connectDragSource, node } = this.props;

    var bgColor = "#FFFFFF"
    if (node.className == "icon-a") bgColor = "lightblue"
    if (node.className == "icon-b") bgColor = "#f0ebfa"
    if (node.className == "icon-c") bgColor = "#ffdb99"
    if (node.className == "icon-d") bgColor = "#E5E7E9"
    if (node.className == "icon-a1") bgColor = "#b2df8a"

    var mainStr = this.separateTextSquareBrackets(node.name).mainStr
    var greyStr = this.separateTextSquareBrackets(node.name).greyedStr

    var scoreText = ""
    if (node.score !== undefined) scoreText = node.score.toFixed(2)
    var relevance = node.relevance

    return connectDragSource(
      <div
        style={{
          display: 'inline-block',
          //padding: '3px 5px',          
          border: '1px',
          'border-style': 'solid',
          'border-radius': '2px',          
          'border-color': 'lightgrey',
          padding: '5px 5px 5px 5px',
          margin: '2px 2px 2px 2px',
          width: '95%',
          'font-size': '12px',
          'background-color': bgColor,
        }}
      >
          <table><tr>
        <td width="3%"> {relevance} </td>
        <td width="8%"> {scoreText} </td>                            
        <td width="85%">{mainStr} <SpanGray> {greyStr} </SpanGray></td>
        </tr></table>
      </div>,      
      { dropEffect: 'copy' }
    );
  }
}
externalNodeBaseComponent.propTypes = {
  node: PropTypes.shape({ title: PropTypes.string }).isRequired,
  connectDragSource: PropTypes.func.isRequired,
};
export const YourExternalNodeComponent = DragSource(
  externalNodeType,
  externalNodeSpec,
  externalNodeCollect
)(externalNodeBaseComponent);
