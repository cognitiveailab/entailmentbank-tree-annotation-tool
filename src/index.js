import React, { useEffect, Component } from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import sampleData1 from './sampleData';
import discourseMarkers1 from './discourseMarkers'
import Column from './Column';
import RowListBox from './RowListBox';
import {FactList, YourExternalNodeComponent, externalNodeType} from './FactList';
import _ from 'lodash';
import axios from 'axios';

import { library, icon } from '@fortawesome/fontawesome-free'
import '@fortawesome/fontawesome-free/css/all.css';

// External draggable
import PropTypes from 'prop-types';
//import React, { Component } from 'react';
import { DndProvider, DragSource } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// NORMAL
//import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
// EXTERNAL DRAGGABLE
import { SortableTreeWithoutDndContext as SortableTree, changeNodeAtPath, removeNodeAtPath, insertNode, removeNode, addNodeUnderParent } from 'react-sortable-tree';

//import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import './sortable-tree-style.css'; // This only needs to be imported once in your app

import { saveAs } from 'file-saver';


const hostName = 'http://localhost:8000'

//import TextBox from './TextBox';

// Key for write-in discourse markers
const writeInKey = 'Write_in'


const TextBox = styled.div`
  display: flex;
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;  
  //background-color: ${props => console.log(props)};
  background-color: ${props => (props.isDragging ? 'lightgreen' : (props.isRemoved ? '#f0ebfa' : 'white'))};  
  font-size: 12px;
  min-height: 150px;
`;


const Container = styled.div`
  height: 750px;
  overflow: auto;
  display: flex;   
  border: 1px solid lightgrey; 
`;

const ParaText = styled.p`
  display: inline;
  padding: 1px;
`;

const ParaTextHighlight = styled.p`
  display: inline;
  color: green;
  padding: 1px;
`;

const SpanNormal = styled.span``;
const SpanHighlight = styled.span`
  background-color: lightgreen;
  //color: white;  
  //font-weight: bold;
`;
const SpanHighlightDisc = styled.span`  
  background-color: #d1c2f0;
  //color: white;  
  //font-weight: bold;
`;
const SpanCustom = styled.span`
  background-color: ${props => (props.backgroundcolor)};
  color: black;
`;

const SpanGreen = styled.span`
  color: lightgreen;
`;

const SpanGray = styled.span`
  color: lightgray;
  font-size: 8pt;
`;

const SpanDarkGray8pt = styled.span`
  color: #666666;
  font-size: 8pt;
  font-weight: normal;
`;

const SpanDarkGrayBlue8pt = styled.span`
  color: #6666EE;
  font-size: 8pt;
  font-weight: normal;
`;

const SpanGray12pt = styled.span`
  color: lightgrey;
  font-size: 12px;
  font-weight: normal;
`;

const DivInline = styled.div`
  display: inline;
`;

const TextCell = styled.span`
  display: inline;
  width: ${props => (props.width)};  
  align-items:center;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 26px;      
  font-size: 12px;
  user-select: none;
  font-color: black;  
  font-weight: normal;
`;

const TextCellGrey = styled.span`
  display: inline;
  width: ${props => (props.width)};
  align-items:center;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 26px;      
  font-size: 12px;
  user-select: none;
  color: grey;  
  font-weight: normal;
`;

const Title = styled.h3`
  padding: 8px;
`;

const BRSmall = styled.br`
  content: "";
  margin: 2em;
  display: block;
  font-size: 24%;
`;

const BRVerySmall = styled.br`
  /*content: "";*/
  /*margin: 0.1em;*/
  display: block;
  font-size: 2pt;
`;


const TopNav = styled.div`
  width: 100%;
  background-color: grey;
  overflow: hidden;
  color: white;
  font-size: 14pt;
`;

/*
const ButtonRound = styled.button`
  background-color: white;
  border: none;
  color: black;
  padding: 4px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 2px 2px;
  min-width: 18px;
  min-height: 18px;
  border-radius: 18px;  
  transition-duration: 0.4s;
`;
*/


//-----------------------------------------------------
// Test for external draggable

/*
// -------------------------
// Create an drag source component that can be dragged into the tree
// https://react-dnd.github.io/react-dnd/docs-drag-source.html
// -------------------------
// This type must be assigned to the tree via the `dndType` prop as well
const externalNodeType = 'yourNodeType';
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
  render() {
    const { connectDragSource, node } = this.props;

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
          width: '100%',
          'font-size': '12px',
        }}
      >
        {node.name}
      </div>,      
      { dropEffect: 'copy' }
    );
  }
}
externalNodeBaseComponent.propTypes = {
  node: PropTypes.shape({ title: PropTypes.string }).isRequired,
  connectDragSource: PropTypes.func.isRequired,
};
const YourExternalNodeComponent = DragSource(
  externalNodeType,
  externalNodeSpec,
  externalNodeCollect
)(externalNodeBaseComponent);
*/

//-----------------------------------------------------




class App extends React.Component {
  state = initialData;

  constructor() {
    super()    

    document.onkeydown = this.checkKey.bind(this);

    // Set current question
    this.curQuestion = 0;
    this.curExample = 0;
    this.isDone = false;
    this.statusStr = "";

    this.id = "undefined";
    this.isModified = false;

    this.saveIdx = 0;           //## debug
    this.lastMove = 0;

    this.factFilter = ""        //## Fact filtering (right hand selection pane)

    this.initialized = false;

    var storedName = this.getCookie("annotatorName")
    if (storedName != "") {
      this.annotatorName = storedName
    } else {
      this.annotatorName = "Initials";
    }
    
    // Initialize discourse connectives (tree)
    this.initializeConnectivesTree()

    // Initialize to blank/toy data
    this.discourseMarkers = discourseMarkers1;
    this.sampleData = sampleData1;

    this.loadJsonServerDataAll();
    

    // Test -- react-sortable-tree    
    this.treeData = this.mkSampleTree();

    console.log("treeData (start) -- state:")
    //console.log(this.state)
    console.log(this.treeData)
    
  }

  // Initialization (before first render)
  initializeFirst() {
    this.initialized = true;

    // Copy the list of discourse markers into the list of possible tasks
    this.addStandardTasksToGeneralList()      

    // Update the internal question variables based on the curQuestion/curExample indices
    this.retrieveQuestionData();            

  }

  /*
   * json-server: load/save
   */ 
  loadJsonServerDataAll() {    

    // Step 1: Load discourse markers
    axios.get(hostName + '/discourseMarkers')
      .then(resp => {
          console.log(resp);
          //## console.log(this);

          this.discourseMarkers = resp.data;
          this.discourseMarkers[writeInKey] = {}    // Add/clear out write-in section
          
          // Check to make sure that each element in the discourse list has an 'originalText' field populated (to be non-breaking with older data)
          for (const discListName in this.discourseMarkers) {            
            for (const taskKey in this.discourseMarkers[discListName]) {
              if (!this.discourseMarkers[discListName][taskKey].hasOwnProperty('originalText')) {
                this.discourseMarkers[discListName][taskKey]['originalText'] = this.discourseMarkers[discListName][taskKey]['content']
              }                
            }              
          }
          
          //## this.debugBigPrint("DATA! (DISCOURSE)");
          //## console.log(this.discourseMarkers);          
          
          this.retrieveQuestionData();    
      })
      .catch(error => {
          console.log(error);
      });    

    // Tree: Load markers and connectives from server
    this.loadDiscourseMarkersTree(true)
    this.loadConnectivesTree(true)

    // Step 2: Load question data
    axios.get(hostName + '/sampleData')
      .then(resp => {
          console.log(resp);
          //## console.log(this);

          // Check to make sure that all tasks also have originalText attached to them. 
          //var qData = resp.data.questionData;
          var qData = resp.data;
          
          //## console.log("qData:")
          //## console.log(qData)

          // For each question
          for (var qIdx=0; qIdx<qData.length; qIdx++) {
            for (var exampleIdx=0; exampleIdx<qData[qIdx]['examples'].length; exampleIdx++) {
              var tasks = qData[qIdx]['examples'][exampleIdx].tasks
              for (const taskKey in tasks) {
                if (!tasks[taskKey].hasOwnProperty('originalText')) {
                  tasks[taskKey]['originalText'] = tasks[taskKey]['content']
                }                
              }
              qData[qIdx]['examples'][exampleIdx].tasks = tasks
              if (!qData[qIdx]['examples'][exampleIdx].isDone) {
                qData[qIdx]['examples'][exampleIdx].isDone = false
              }
              if (!qData[qIdx]['examples'][exampleIdx].statusStr) {
                qData[qIdx]['examples'][exampleIdx].statusStr = ""
              }

              if (!qData[qIdx]['examples'][exampleIdx].annotators) {
                qData[qIdx]['examples'][exampleIdx].annotators = ""
              }

              if (qData[qIdx]['examples'][exampleIdx].hasOwnProperty('tree') == false) {
                qData[qIdx]['examples'][exampleIdx].tree = this.mkEmptyTree()
              }
            }
          }
          
          //throw new Error("exit")

          //this.sampleData = resp.data.questionData;          
          this.sampleData = qData
          //## this.debugBigPrint("DATA! (QUESTIONS)");
          //## console.log(this.sampleData);
          
          this.retrieveQuestionData();    

          this.forceUpdate();
      })
      .catch(error => {
          console.log(error);
      });    

  }

  loadDiscourseMarkersTree(constructIfMissing=false, callback) {
    // New markers
    
    axios.get(hostName + '/discourseMarkersTree')
      .then(resp => {
          console.log(resp);
          //## console.log(this);

          var discourseMarkersTree = resp.data.data;
          //this.discourseMarkersTree[writeInKey] = {}    // Add/clear out write-in section
          
          // Check to make sure that each element in the discourse list has an 'originalText' field populated (to be non-breaking with older data)           
          for (var i=0; i<discourseMarkersTree.length; i++) {            
            if (typeof(discourseMarkersTree[i].originalText) == "undefined") {
              discourseMarkersTree[i].originalText = discourseMarkersTree[i].name
            }            
          } 
                  
          //console.log(" load discourseMakersTree: ")
          //console.log(discourseMarkersTree)
          
          if (discourseMarkersTree.length == 0) {
            //console.log("Retrieved empty list of discourse markers -- populating with default list.")
            this.discourseMarkersTree = this.populateDefaultMarkers()
          } else {
            // Convert from internal form to draggable objects
            this.discourseMarkersTree  = []                 
            for (var i=0; i<discourseMarkersTree.length; i++) {
              this.discourseMarkersTree.push( <YourExternalNodeComponent node={discourseMarkersTree[i]}/>)                         
            }          
          }
          //## this.debugBigPrint("DATA! (DISCOURSE)");
          //## console.log(this.discourseMarkers);          

          //console.log(this.discourseMarkersTree)

          //this.retrieveQuestionData();    

          // Callback
          if (callback) callback();      
      })
      .catch(error => {                
          //console.log("ERROR: Was unable to retrieve 'discourseMarkersTree' from server.  Populate with default markers = " + constructIfMissing + ".")
          //console.log(error);
          if (constructIfMissing == true) {
            this.discourseMarkersTree = this.populateDefaultMarkers()
          }

          // Callback
          if (callback) callback();      
      });  

      
  }

  loadConnectivesTree(constructIfMissing=false, callback) {
    axios.get(hostName + '/connectives')
      .then(resp => {
          console.log(resp);
          //## console.log(this);

          this.connectives = resp.data.data;
          this.computeConnectivesLUT();
          /*
          this.discourseConnectivesTree[writeInKey] = {}    // Add/clear out write-in section
          
          // Check to make sure that each element in the discourse list has an 'originalText' field populated (to be non-breaking with older data)
          for (const discListName in this.discourseConnectivesTree) {            
            for (const taskKey in this.discourseConnectivesTree[discListName]) {
              if (!this.discourseConnectivesTree[discListName][taskKey].hasOwnProperty('originalText')) {
                this.discourseMarkerdiscourseConnectivesTreesTree[discListName][taskKey]['originalText'] = this.discourseMarkersTree[discListName][taskKey]['name']
              }                
            }              
          }
          */

         if (this.connectives.length == 0) {
          console.log("Retrieved empty list of connectives -- populating with default list.")
          this.initializeConnectivesTree()
        }

          //## this.debugBigPrint("DATA! (DISCOURSE)");
          //## console.log(this.discourseMarkers);          
          
          this.retrieveQuestionData();                    

          // Callback
          if (callback) callback();

      })
      .catch(error => {        
          console.log("ERROR: Was unable to retrieve 'connectives' from server.  Populate with default connectives = " + constructIfMissing + ".")
          console.log(error);
          
          if (constructIfMissing == true) {
            this.initializeConnectivesTree();
          }
          //this.discourseConnectivesTree = ...

          // Callback
          if (callback) callback();

      });  

  }


  saveDiscourseMarkersConnectivesTree() {
    console.log("saveDiscourseMarkersConnectivesTree(): started... ")
    const config = {
      maxContentLength: 52428890
    };    


    // Step 1: Pack markers
    var packedMarkers = []
    for (var i=0; i<this.discourseMarkersTree.length; i++) {
      packedMarkers.push( this.discourseMarkersTree[i].props.node )
    }
    
    console.log("Packed Markers: ")
    console.log(packedMarkers)

    axios.put(hostName + '/discourseMarkersTree', {data: packedMarkers}, config).then(resp => {      
      console.log(resp.data);
      }).catch(error => {
      console.log(error);        
    });      


    // Step 2: Send connectives
    axios.put(hostName + '/connectives', {data: this.connectives}, config).then(resp => {      
      console.log(resp.data);
      }).catch(error => {
      console.log(error);  
    });            
  }

  loadJsonServerDataCurrentQuestion(questionIdxIn) {        
    var questionIdx = JSON.parse(JSON.stringify(questionIdxIn))
  
    // Step 1: Load discourse markers
    axios.get(hostName + '/discourseMarkers')
      .then(resp => {
          console.log(resp);
          //## console.log(this);

          this.discourseMarkers = resp.data;
          this.discourseMarkers[writeInKey] = {}    // Add/clear out write-in section
          
          // Check to make sure that each element in the discourse list has an 'originalText' field populated (to be non-breaking with older data)
          for (const discListName in this.discourseMarkers) {            
            for (const taskKey in this.discourseMarkers[discListName]) {
              if (!this.discourseMarkers[discListName][taskKey].hasOwnProperty('originalText')) {
                this.discourseMarkers[discListName][taskKey]['originalText'] = this.discourseMarkers[discListName][taskKey]['content']
              }                
            }              
          }
          
          //## this.debugBigPrint("DATA! (DISCOURSE)");
          //## console.log(this.discourseMarkers);          
          
          this.retrieveQuestionData();    
      })
      .catch(error => {
          console.log(error);
      });    

    // Step 2: Load question data
    axios.get(hostName + '/sampleData/' + this.sampleData[questionIdx].id)
      .then(resp => {
          //## console.log(resp);
          //## console.log(this);

          // Check to make sure that all tasks also have originalText attached to them. 
          //var qData = resp.data.questionData;
          var qData = resp.data;
          
          //## console.log("qData:")
          //## console.log(qData)

          // For each question
          
            for (var exampleIdx=0; exampleIdx<qData['examples'].length; exampleIdx++) {
              var tasks = qData['examples'][exampleIdx].tasks
              for (const taskKey in tasks) {
                if (!tasks[taskKey].hasOwnProperty('originalText')) {
                  tasks[taskKey]['originalText'] = tasks[taskKey]['content']
                }                
              }
              qData['examples'][exampleIdx].tasks = tasks
              if (!qData['examples'][exampleIdx].isDone) {
                qData['examples'][exampleIdx].isDone = false
              }
              if (!qData['examples'][exampleIdx].statusStr) {
                qData['examples'][exampleIdx].statusStr = ""
              }
              if (!qData['examples'][exampleIdx].annotators) {
                qData['examples'][exampleIdx].annotators = ""
              }
            }
          
          
          //throw new Error("exit")

          //this.sampleData = resp.data.questionData;          
          this.sampleData[questionIdx] = qData
          //## this.debugBigPrint("DATA! (QUESTION " + this.currentQuestion + ")");
          //## console.log(this.sampleData[this.currentQuestion]);
          
          this.retrieveQuestionData();    
          this.forceUpdate();
      })
      .catch(error => {
          console.log(error);
      });    

  }


  saveJsonServerDataAll() {    
    // Step 1: Save discourse markers
    // First, filter out any write-in markers    
    var discourseMarkersFiltered = this.discourseMarkers
    if (discourseMarkersFiltered.hasOwnProperty(writeInKey)) {
      discourseMarkersFiltered[writeInKey] = {}
    }

    const config = {
      maxContentLength: 52428890
    };

    // Then, save 
    //axios.post(hostName + '/discourseMarkers', this.discourseMarkers).then(resp => {
    axios.post(hostName + '/discourseMarkers', this.discourseMarkers, config).then(resp => {      
          console.log(resp.data);
      }).catch(error => {
          console.log(error);
      });        

    // Step 2: Save question markers
    // Store any data on the screen
    this.storeCurrentData()

    // Pack data    
    /*
    var packedData = {      
      questionData: this.sampleData
    };
    */    

    // Send data
    axios.post(hostName + '/sampleData', this.sampleData, config).then(resp => {    
          console.log(this.sampleData);
          console.log(resp.data);
          console.log("saved....")
      }).catch(error => {
          console.log(error);
      });    

  }

  saveJsonServerDataCurrentQuestion() {
    var questionIdx = JSON.parse(JSON.stringify(this.curQuestion))
    this.saveJsonServerDataQuestion(questionIdx)    
  }


  saveJsonServerDataQuestion(questionIdxIn) {  
    var questionIdx = JSON.parse(JSON.stringify(questionIdxIn))
    console.log("questionIdx:")
    console.log(questionIdx)

    // Step 1: Save discourse markers
    // First, filter out any write-in markers    
    var discourseMarkersFiltered = this.discourseMarkers
    if (discourseMarkersFiltered.hasOwnProperty(writeInKey)) {
      discourseMarkersFiltered[writeInKey] = {}
    }

    if (this.id == "undefined") {
      console.log("ERROR: No question id currently defined (this.id = " + this.id + ").  No data sent to server for saving.")
      return
    }

    const config = {
      maxContentLength: 52428890
    };

    // Then, save 
    //axios.post(hostName + '/discourseMarkers', this.discourseMarkers).then(resp => {
    axios.post(hostName + '/discourseMarkers', this.discourseMarkers, config).then(resp => {      
          console.log(resp.data);
      }).catch(error => {
          console.log(error);
      });        


    // Step 2: Save question markers
    // Store any data on the screen
    this.storeCurrentData()

    // Pack data    
    var packedData = {      
      questionData: this.sampleData
    };    

    var dataToSend = this.sampleData[questionIdx]

    console.log("dataToSend")
    console.log(dataToSend)

    // Send data
    //axios.post(hostName + '/sampleData/' + this.id, packedData, config).then(resp => {    
    axios.put(hostName + '/sampleData/' + this.sampleData[questionIdx].id, dataToSend, config).then(resp => {    
          //## console.log(this.sampleData);
          console.log(resp.data);
          console.log("saved.... (id: " + this.sampleData[questionIdx].id + ")")
      }).catch(error => {
          console.log(error);
      });    

  }


   /* 
    *
    */


  addStandardTasksToGeneralList(whereToAddIn) {
    var whereToAdd = this.state.tasks
    if (whereToAddIn !== undefined) {
      whereToAdd = whereToAddIn
    }

    var toAdd = {}
    // Copy the list of discourse markers into the list of possible tasks
    for (const key in this.discourseMarkers) {
      console.log("key: " + key)
      for (const key1 in this.discourseMarkers[key]) {
        toAdd[key1] = this.discourseMarkers[key][key1]
      }
    }    

    // Also add a list of blanks
    var blanks = this.mkBlankModifiers()
    for (const key in blanks) {
      toAdd[key] = blanks[key]
    }  
    
    // Add to state
    for (const key in toAdd) {
      whereToAdd[key] = toAdd[key];
    }
    
    // Also return, in case they need to be added
    //return toAdd;
  }

  onDragStart = start => {
    // This code dynamically sets whether a given Droppable is Droppable in a specific column
    const homeIndex = this.state.ColumnOrder.indexOf(start.source.droppableId);

    this.setState({   
      ...this.state,   
      homeIndex,
    });
  }

  onDragEnd = result => {
    // Reset state of whether this Droppable is droppable or not
    this.setState({ 
      ...this.state,     
      homeIndex: null,
    });

    var newState = this.getNewDragOrder(result);

    console.log('new state', newState);

    this.setState(newState);
  };  
  
  onDragUpdate = result => {
    var newState = this.getNewDragOrder(result);

    console.log("###### onDragUpdate()");
    if (newState === undefined) {
      // Undefined
    } else {
      console.log(" -----" + this.getOrderedTextHelper(newState) )

      //this.render(newState);
    }
    this.forceUpdate();

  };

  debugBigPrint(message) {
    console.log("=====================================")
    console.log("=====================================")
    console.log(message)
    console.log("=====================================")
    console.log("=====================================")
  }

  //
  getNewDragOrder(result) {
    const { destination, source, draggableId } = result;
    
    const start = this.state.columns[source.droppableId];    

    this.markQuestionAsModifiedByAnnotator()

    this.debugBigPrint(destination)
    this.debugBigPrint(source)
    this.debugBigPrint(draggableId)    

    // CASE: Row was dragged away, and should be removed
    if (!destination) {
      console.log("START:")
      console.log(start)

      // CASE: Check if column-2 (discourse marker column).  If so, do not remove. 
      if (start.id == "column-2") {
        // Do not remove if in column 2 (discourse column)
        return this.state;

      } else if (start.id == 'column-1') {

        // CASE: column-1 (explanation sentence marker).  Do not remove, but move to below 'removemarker'

        // Remove from source column      
        const startTaskIds = Array.from(start.taskIds);
        var destinationIdx = start.taskIds.indexOf('removemarker');
        startTaskIds.splice(source.index, 1);          
        
        // Allow removing discourse markers from main list (since these can be added in easily). 
        // But, do not allow removing facts -- instead, move them just below the 'removemarker' marker position. 
        if (!draggableId.startsWith("disc")) {        
          startTaskIds.splice(destinationIdx, 0, draggableId);
        }

        const newColumn = {
          ...start,
          taskIds: startTaskIds,
        };
    
        const newState = {
          ...this.state,
          columns: {
            ...this.state.columns,
            [newColumn.id]: newColumn,
          },
        };

        return newState;      

      } else if (start.id == 'column-3') {
        // CASE: Element in modifier row was dragged away -- remove it, and replace with a blank        
        // Step 1: Make new blank
        //var modifierColumn = this.state.columns['column-3'];    
        //var replacementBlank = this.getNextUnusedBlankModifierKey(modifierColumn['taskIds'])              

        // Step 2: Splice it in        
        const startTaskIds = Array.from(start.taskIds);        
        startTaskIds.splice(source.index, 1);          
        //startTaskIds.splice(source.index, 0, replacementBlank);          

        const newColumn = {
          ...start,
          taskIds: startTaskIds,
        };
    
        const newState = {
          ...this.state,
          columns: {
            ...this.state.columns,
            [newColumn.id]: newColumn,
          },
        };

        return newState;      

      }
    }

    /*
    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return;
    }
  */  
    
    const finish = this.state.columns[destination.droppableId];        

    console.log("start.id: " + start.id)
    console.log("finish.id: " + finish.id)

    // CASE: Start and finish columns are the same
    if (start == finish) {
      this.debugBigPrint("start == finish")

      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
  
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
  
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      return newState;

    } else if (start.id == "column-2") {
      this.debugBigPrint("start == column-2")

      // From DISC to any other column:
      // Action: clone a copy, don't remove original

      var existingTask = this.state.tasks[draggableId]

      /*
      if (existingTask.id.startsWith("blank")) {
        console.log("MOVING BLANK BETWEEN COLUMNS -- NOT ALLOWED")
        return this.state;
      }
      */

      // Clone draggable    
      console.log("************** existingTask:")
      console.log(existingTask)
      //var newTask = JSON.parse(JSON.stringify(existingTask))
      var newTask = _.cloneDeep(existingTask)
      newTask.id = newTask.id + "-" + Math.floor(Math.random() * 100000);
      var newTasks = this.state.tasks;
      newTasks[newTask.id] = newTask

      // Remove from source column      
      const startTaskIds = Array.from(start.taskIds);
      //startTaskIds.splice(source.index, 1);      
      //startTaskIds.splice(source.index, 0, newTask.id);
      const newStart = {
        ...start, 
        taskIds: startTaskIds,        
      };          
          
      // Add to destination column
      const finishTaskIds = Array.from(finish.taskIds);
      //finishTaskIds.splice(destination.index, 0, draggableId);
      finishTaskIds.splice(destination.index, 0, newTask.id);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      // Record state
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
        tasks: newTasks,              // For cloned task 
      };

      // console.log("NEWSTATE:")
      // console.log(newState);

      return newState;

    } else if (
              ((start.id == 'column-3') && (finish.id == 'column-1')) ||
              ((start.id == 'column-1') && (finish.id == 'column-3')) ) {

      this.debugBigPrint("col1-3")

      // From MARKER to FACT, or from FACT to MARKER
      // Action: Only allow movements if they're discourse markers or blanks          

      if ((draggableId == 'removemarker') ||
         (draggableId.startsWith('task'))) {
        // The user is not allowed to move these -- return
        console.log(" * Not allowed to move these between 1/3: " + draggableId)
        return this.state;
      }
      console.log(" * Can move this between 1/3: " + draggableId)

      // Clone draggable    
      console.log("************** existingTask:")
      console.log(existingTask)
      /*      
      //var newTask = JSON.parse(JSON.stringify(existingTask))
      var newTask = _.cloneDeep(existingTask)
      newTask.id = newTask.id + "-" + Math.floor(Math.random() * 100000);
      var newTasks = this.state.tasks;
      newTasks[newTask.id] = newTask
      */

      // Remove from source column      
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);      
      //startTaskIds.splice(source.index, 0, newTask.id);
      const newStart = {
        ...start, 
        taskIds: startTaskIds,        
      };          
          
      // Add to destination column
      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      //finishTaskIds.splice(destination.index, 0, newTask.id);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      // Record state
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
        //tasks: newTasks,              // For cloned task 
      };

      // console.log("NEWSTATE:")
      // console.log(newState);

      return newState;    

    } else {
      // CASE: Other cases of moving between columns: Not allowed
      this.debugBigPrint("else")
      
      return this.state
    }
    
    // Moving from one column to another (no cloning)
    /*
      // Remove from source column      
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start, 
        taskIds: startTaskIds,        
      };
      

      // Add to destination column
      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      // Record state
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      return newState;
    */

    //return newState;
  }




  getOrderedText() {
    var state = this['state'];
    //## console.log("state:")
    //## console.log(state)
    return this.getOrderedTextHelper(state);
  }

  getOrderedTextHelper(state) {    
    //## console.log("This:")
    //## console.log(this)
    
    /*
    if (!'state' in this) return "Initializing";
    if (!'columns' in this['state']) return "Initializing";
    if (!'column-1' in this['state']['columns']) return "Initializing";
    if (!'taskIds' in this['state']['columns']['column-1']) return "Initializing";
    */

    //ordering = this['state']['columns']['column-1']['taskIds'];    
    console.log("Ordering:")        
    //var ordering = this['state']['columns']['column-1']['taskIds'];
    //var tasks = this['state']['tasks'];
    var ordering = state['columns']['column-1']['taskIds'];
    var orderingModifiers = state['columns']['column-3']['taskIds'];
    var tasks = state['tasks'];

    console.log(ordering);  
    console.log("Tasks: ")
    console.log(tasks);
    
    var outList = [];
    for (let i=0; i<ordering.length; i++) {
      
      // console.log(ordering[i])
      // console.log(tasks)

      if (ordering[i] == "removemarker") {
        break
      }

      var found = false

      // First, add modifier
      for (let key in tasks) {      
        if (orderingModifiers[i] == tasks[key].id) {
          if (!orderingModifiers[i].startsWith("blank")) {
            var formattedOut = tasks[key].content.trim()
            if (tasks[key].isHoveredOver) {          
              outList.push( [formattedOut, true, key] );
            } else {
              outList.push( [formattedOut, false, key] );
            }
          }
        }
      }


      // Then, add fact
      for (let key in tasks) {      
        if (ordering[i] == tasks[key].id) {
          if (!ordering[i].startsWith("blank")) {
            // console.log("tasks[key]:")
            // console.log(tasks[key])

            var formattedOut = tasks[key].content.trim()
            // console.log("formattedOut:" + formattedOut)
            if (formattedOut.endsWith(".") || formattedOut.endsWith(":")) {
              // Do nothing            
            } else {
              formattedOut += ".";
            }
            // console.log("formattedOutAfter:" + formattedOut)

            if (tasks[key].isHoveredOver) {          
              outList.push( [formattedOut, true, key] );
            } else {
              outList.push( [formattedOut, false, key] );
            }
          }
          found = true;
          //textStr += i + ":  "
          //textStr += tasks[key].content;
        }
      }      

      if (!found) {
        outList.push("[error: '" + ordering[i] + "' not found]. ")
      }

    }

    var textStr = outList.join(" ");
    

    console.log("==========" +  textStr );
    return outList;
    //return textStr;
  }

  getTimeMilliseconds() {
    var d = new Date();
    var n = d.getMilliseconds();
    return n;
  }

  /*
  refresh(isHover) {
    console.log("REFRESH");
    var curTime = this.getTimeMilliseconds();
    if (curTime - this.lastRender > 500) {
      this.render()
    }
  }
  */

  /*
  useEffect = result => {
    const timer = setTimeout(() => {
      console.log('This will run after 1 second!')
      this.refresh();
      this.useEffect();
    }, 1000);
    return () => clearTimeout(timer);
  };
  */
  rerender() {
    //this.forceUpdate();
    this.setState({
      ...this.state, 
      randNum:Math.random(),
      })
  }
  
  /*
   *  Navigation 
   */ 
  // Move to the next question
  moveNextQuestion = result => {
    console.log("moveNextQuestion()")
    this.moveQuestion(1);
  }

  moveNextQuestion25 = result => {
    console.log("moveNextQuestion()")
    this.moveQuestion(25);
  }

  moveNextQuestion100 = result => {
    console.log("moveNextQuestion()")
    this.moveQuestion(100);
  }

  moveQuestion(delta) {
    console.log("-----------------------------------------")
    console.log(" MOVE QUESTION")
    console.log("-----------------------------------------")
    // Only allow one move-in-progress to happen at once
    var now = new Date()
    if (now.getTime() - this.lastMove < 100) {
      console.log("Too fast");
      return;
    }
    this.lastMove = now.getTime()
  


    // Step 0: Clear out any write-in discourse markers from the last question
    this.discourseMarkers[writeInKey] = {}

    // Step 1: Store current data
    this.storeCurrentData();


    // TODO: Change isModified to recognize changes to the tree data
    console.log("this.curQuestion: " + this.curQuestion)
    if (this.isModified == true) {
      var questionIdx = JSON.parse(JSON.stringify(this.curQuestion))
      this.saveJsonServerDataCurrentQuestion(questionIdx);   // Give a hard reference to the question id
    }


    // Step 2: Increment/decrement question counter
    this.curQuestion += delta;
    
    if (this.curQuestion < 0) {
      this.curQuestion = 0;
    }
    if (this.curQuestion >= this.sampleData.length) {
      this.curQuestion = this.sampleData.length-1;
    }
    
    this.curExample = 0;

    // Step 3: Update question on screen
    // Get new question data
    this.isModified = false;

    //### TURN THIS BACK ON!
    this.loadJsonServerDataCurrentQuestion(this.curQuestion);       // Retrieve the question data from the server

    this.retrieveQuestionData()    
    
    this.forceUpdate();    
  }

  // Move to the previous question
  movePrevQuestion = result => {
    console.log("movePrevQuestion()")
    
    this.moveQuestion(-1);
  }

  movePrevQuestion25 = result => {
    console.log("movePrevQuestion()")
    
    this.moveQuestion(-25);
  }

  movePrevQuestion100 = result => {
    console.log("movePrevQuestion()")
    
    this.moveQuestion(-100);
  }

  // Save data from the current question into the global data array
  storeCurrentData() {
    console.log("storeCurrentQuestion()")
    console.log("curQuestion: " + this.curQuestion)

    console.log("BEFORE:")
    console.log(this.sampleData[this.curQuestion]);

    var data = this.sampleData[this.curQuestion];
    this.qid = data.qid
    this.topics = data.topics
    this.questionText = data.questionText;
    this.answerText = data.answerText;

    // Update values for this example
    var curExample = data['examples'][this.curExample];
    curExample['name'] = this.exampleName;
    curExample['granularity'] = this.exampleGranularity;
    curExample['isDone'] = this.isDone;
    curExample['statusStr'] = this.statusStr;
    curExample['doneTimestamp'] = this.doneTimestamp;
    curExample['annotators'] = this.annotators;

    //curExample['tasks'] = this.state.tasks;
    curExample['taskOrdering'] = this.state.columns['column-1']['taskIds'];

    // Modifier ordering
    curExample['modifierOrdering'] = this.state.columns['column-3']['taskIds'];    

    var curTasks = {}
    // Only store tasks that are actually used -- we'll add in the rest dynamically upon reload    
    for (const key in this.state.tasks) {
      if (curExample['taskOrdering'].includes(key) || curExample['modifierOrdering'].includes(key)) {
        curTasks[key] = this.state.tasks[key];
        //console.log(key + " -- used")
      } else {
        //console.log(key + " -- unused")
      }
    }
    curExample['tasks'] = curTasks;

    //## STORE TREE
    curExample['tree'] = this.treeData;

    // Store this example
    data['examples'][this.curExample] = curExample;
    this.sampleData[this.curQuestion] = data;

    console.log("AFTER:")
    console.log(this.sampleData[this.curQuestion]);

  }

  countQuestionsWithSomeAnnotation() {
    // Return if not yet initialized
    if (this.sampleData === undefined) {
      return 0
    }

    var count = 0
    for (var i=0; i<this.sampleData.length; i++) {
      var data = this.sampleData[i];

      var found = false
      for (var exampleIdx=0; exampleIdx<data['examples'].length; exampleIdx++) {
        var curExample = data['examples'][exampleIdx];
        var curModifierTaskOrdering = curExample['modifierOrdering']

        for (var modIdx=0; modIdx<curModifierTaskOrdering.length; modIdx++) {
          //console.log("---> " + curModifierTaskOrdering[modIdx])
          if (!curModifierTaskOrdering[modIdx].startsWith("blank")) {            
            found = true
            break
          }
        }

      }

      if (found == true) {
        count += 1
      }
      
    }

    return count
  }

  countQuestionsWithFlag(flag) {
    // Return if not yet initialized
    if (this.sampleData === undefined) {
      return 0
    }

    var count = 0
    for (var i=0; i<this.sampleData.length; i++) {
      var data = this.sampleData[i];

      var found = false
      for (var exampleIdx=0; exampleIdx<data['examples'].length; exampleIdx++) {        
        var curExample = data['examples'][exampleIdx];
        var statusStr = curExample.statusStr
        if (typeof(statusStr) != "undefined") {
          var flags = statusStr.split(" ")
          if (flags.indexOf(flag) >= 0) found = true
        }
      }

      if (found == true) {
        count += 1
      }
      
    }

    return count
  }


  countQuestionsWithSomeAnnotationTree() {
    // Return if not yet initialized
    if (this.sampleData === undefined) {
      return 0
    }

    var count = 0
    for (var i=0; i<this.sampleData.length; i++) {
      var data = this.sampleData[i];

      var found = false
      for (var exampleIdx=0; exampleIdx<data['examples'].length; exampleIdx++) {
        var curExample = data['examples'][exampleIdx];
        var tree = curExample['tree']
        
        var numFactsInTree = this.countFactsInTree(tree)
        if (numFactsInTree > 0) found = true
      }

      if (found == true) {
        count += 1
      }
      
    }

    return count
  }

  // Count the number of facts (not modifiers) in a given tree
  countFactsInTree(node) {    
    if (typeof(node) == "undefined") return 0;

    var numFacts = 0
    for (var i=0; i<node.length; i++) {
      //console.log("countFactsInTree: ", i, node, node[i])
      if (!node[i].hasOwnProperty['uniqueName']) {
        if (typeof(node[i].id) != "undefined") {          
          if ((node[i].id.startsWith("task")) || (node[i].id.startsWith("fact"))) {
            numFacts += 1
          }
        }
      }

      if (node[i].hasOwnProperty('children')) {
          numFacts += this.countFactsInTree(node[i].children)
      }
    }    
        
    return numFacts;
  }

  

  countQuestionsWithOneDoneExample() {
    // Return if not yet initialized
    if (this.sampleData === undefined) {
      return 0
    }

    var count = 0
    for (var i=0; i<this.sampleData.length; i++) {
      var data = this.sampleData[i];

      var found = false
      for (var exampleIdx=0; exampleIdx<data['examples'].length; exampleIdx++) {
        var curExample = data['examples'][exampleIdx];
        if (curExample.isDone == true) {
          found = true
          break
        }
      }

      if (found == true) {
        count += 1
      }
      
    }

    return count
  }

  // Get data from the global question data array for the current question, and place it in the current view datastructures
  retrieveQuestionData() {
    console.log("retrieveQuestionData():")
    console.log("curQuestion: " + this.curQuestion)

    // Return if not yet initialized
    if (this.sampleData === undefined) {
      return
    }

    var data = this.sampleData[this.curQuestion];

    console.log("DATA:")
    console.log(data)

    this.id = data.id     // One way, this should never change in the other direction
    this.qid = data.qid
    this.topics = data.topics
    this.questionText = data.questionText;
    this.answerText = data.answerText;

    var curExample = data['examples'][this.curExample];
    this.exampleName = curExample['name'];
    this.exampleGranularity = curExample['granularity'];    
    var curExampleTasks = curExample['tasks']
    var curExampleTaskOrdering = curExample['taskOrdering']

    var curModifierTaskOrdering = curExample['modifierOrdering']
    this.isDone = curExample['isDone'];
    this.statusStr = curExample['statusStr'];
    this.doneTimestamp = curExample['doneTimestamp'];   
    this.annotators = curExample['annotators'];

    //## RETRIEVE TREE
    if (curExample.hasOwnProperty('tree') == true) {
      this.treeData = curExample['tree'];    
      console.log("hasTree:")
      console.log(curExample['tree'])    
    } else {
      this.treeData = this.mkEmptyTree();
      console.log("emptyTree:")
      console.log(this.treeData)
    }   
    // Sanitize tree
    this.ensureTreeHasOriginalText(this.treeData)

    // Ensure each tree node has a unique ID
    this.giveNodesUniqueNumbers(this.treeData);
    

    console.log("####################################### UPDATE")
    console.log(data);
    console.log(this.state);   
    
    // Add list of discourse markers and blanks to tasklist    
    var toAdd = this.addStandardTasksToGeneralList(curExampleTasks);    
    /*
    for (const key in toAdd) {
      curExampleTasks[key] = toAdd[key];
    }
    */

    // Add blank modifiers, if required
    var newModifierColumn1 = this.autoExpandBlankModifierFill(curModifierTaskOrdering, curExampleTaskOrdering)
    curModifierTaskOrdering = _.cloneDeep(newModifierColumn1)
    this.debugBigPrint(curModifierTaskOrdering)
    console.log("FIRST")

    // Update the examples list (if required)
    this.updateExampleList()

    // Update the state
    const newDataColumn = {
      id: "column-1",
      title: "Facts",
      taskIds: curExampleTaskOrdering,
    };

    const newModifierColumn = {
      id: "column-3",
      title: "Modifiers",
      taskIds: curModifierTaskOrdering,
    }

    const newState = {
      ...this.state,
      tasks: curExampleTasks,
      columns: {
        ...this.state.columns,        
        [newDataColumn.id]: newDataColumn,
        [newModifierColumn.id]: newModifierColumn,
      },
    };

    console.log("newState:")
    console.log(newState);

    this.setState(newState);
    
    //this.forceUpdate()

    //this.debugBigPrint(newState.columns['column-3'])
    //this.debugBigPrint(this.state.columns['column-3'])
    //console.log("FIRST")

  }


  // Update the example options based on the options currently available in the data structure
  updateExampleList() {    
    var data = this.sampleData[this.curQuestion];

    var exampleOptions = []
    var curExamples = data['examples'];
    for (var i=0; i<curExamples.length; i++) {
      var granularity = curExamples[i].granularity

      var label = "Example " + i + " - " + granularity
      var value = "example" + i
      exampleOptions.push({value:value, label:label})
    }
    
    this.exampleOptions = exampleOptions;    
  }

  updateExampleName() {

  }

  /*
   *  Example buttons
   */ 
  onPressGranularityHigh = result => {
    console.log("onPressGranularityHigh()")
    this.relabelExampleGranularity("High")    
  }

  onPressGranularityMed = result => {
    console.log("onPressGranularityMed()")
    this.relabelExampleGranularity("Med")    
  }

  onPressGranularityLow = result => {
    console.log("onPressGranularityLow()")
    this.relabelExampleGranularity("Low")    
  }

  relabelExampleGranularity(label) {
    this.exampleGranularity = label

    /*
    console.log("#########################################")
    console.log("#########################################")
    console.log("GRANULARITY:")
    console.log("#########################################")
    console.log("#########################################")
    console.log(sampleData[this.curQuestion])
    */

    this.markQuestionAsModifiedByAnnotator()    
    this.storeCurrentData()
    this.retrieveQuestionData()
  }

  onPressAdd = result => {
    console.log(" parent onPressAdd()")
    // Step 1: Store current example data
    this.markQuestionAsModifiedByAnnotator()    
    this.storeCurrentData()

    // Step 2: Create a copy 
    var data = this.sampleData[this.curQuestion];
    //var curExample = data['examples'][this.curExample];
    var newExample = _.cloneDeep(data['examples'][this.curExample]);
    data['examples'].push(newExample);
    this.sampleData[this.curQuestion] = data;
    
    
    // Step 3A: Update list of examples
    // Todo, update listbox

    // Step 3B: Change view to new example
    this.curExample = data['examples'].length - 1;
    // Todo, change listbox selection to new example
    
    // Step 4: Update display
    this.retrieveQuestionData()

  }

  onPressRemove = result => {
    console.log("onPressRemove()")
    var data = this.sampleData[this.curQuestion];
    var curExamples = data['examples'];
    
    // TODO: Incorporate 'are you sure?' dialog

    if (curExamples.length > 1) {
      if (window.confirm("Are you sure you want to delete Example " + this.curExample + " - " + curExamples[this.curExample].granularity + " ?")) {        
        // Remove example
        curExamples.splice(this.curExample, 1)

        this.markQuestionAsModifiedByAnnotator()    
      }
    } else {
      window.alert("Can not delete -- this question only has one example left.")
    }

    // Check bounds on current example index, and decrease if we're out of range
    if (this.curExample > (curExamples.length-1)) {
      this.curExample = curExamples.length-1;
    }

    // Store changes
    data['examples'] = curExamples;
    this.sampleData[this.curQuestion] = data;    

    // Step 4: Store changes and Update display    
    this.retrieveQuestionData()  

  }

  onExampleChange = (event) => {
    //console.log("onExampleChange()")
    //console.log(event)

    // Step 1: Store current example
    this.storeCurrentData();

    // Step 2: Determine which example was selected from the dropdown
    // Find index
    var exampleIdx = 0;
    for (var i=0; i<this.exampleOptions.length; i++) {
      if (this.exampleOptions[i].value == event.value) {
        exampleIdx = i;
      }
    }

    this.curExample = exampleIdx;

    // Step 3: Update the view to the new example
    this.retrieveQuestionData()
  }


  // Discourse
  onAddDiscElem = (event) => {
    console.log("onAddDiscElem")    
    var elementName = window.prompt("Please enter the discourse ELEMENT to add:", "element")
    if (elementName == null || elementName == "") {
      // Cancelled
    } else {
      this.markQuestionAsModifiedByAnnotator()

      this.storeCurrentData()    

      // TODO: Add to current list
      var listKeyName = this.curDiscourseList['value']
      var listName = this.curDiscourseList['label'].toLowerCase()
                  
      // Add an appropriate prefix to the element to determine coloring
      var elemKeyPrefix = "disc-"
      if (listName.startsWith("block")) elemKeyPrefix = "block-"
      if (listName.startsWith("marker")) elemKeyPrefix = "marker-"
      if (listName.startsWith("write")) elemKeyPrefix = "write-"

      // Find a unique key name, with the listname as the prefix
      if (elemKeyPrefix != "write-") {
        // Non-write in element: use sequential suffix
        var elemKey = ""
        for (var i=0; i<1000; i++) {
          elemKey = elemKeyPrefix + listKeyName + "-" + i
          if (!this.discourseMarkers[listKeyName].hasOwnProperty(elemKey)) {
            break;
          }
        }
      } else {
        // Write in marker, generate random (unique) key, since these aren't stored in the discourse list
        elemKey = elemKeyPrefix + listKeyName + "-" + Math.floor(Math.random() * 1000000);
      }

      var newOption = { id: elemKey, isRemoved: true, isHoveredOver: false, content: elementName, originalText: elementName };      
      this.discourseMarkers[listKeyName][elemKey] = newOption;

      // Refresh question data      
      this.retrieveQuestionData()

      // Save JSON
      //this.saveJsonServerData()        
      
    }

  }

  onAddDiscList = (event) => {
    console.log("onAddDiscList")
    var listName = window.prompt("Please enter the discourse LIST to add:", "listname")
    if (listName == null || listName == "") {
      // Cancelled
    } else {      
      this.markQuestionAsModifiedByAnnotator()    
      this.storeCurrentData() 
      
      var listNameSanitized = listName      
      listNameSanitized = listNameSanitized.replace(" ", "_")
      listNameSanitized = listNameSanitized.replace("-", "_")
      listNameSanitized = listNameSanitized.replace("[^0-9a-zA-Z ]+", "")
      listNameSanitized = listNameSanitized.replace("_+", "_")

      // TODO: Add new list
      if (this.discourseMarkers.hasOwnProperty(listName)) {
        window.alert("Can not add new list (" + listNameSanitized + ").  A list with that name already exists.")
      } else {
        this.discourseMarkers[listNameSanitized] = {}

        // Refresh question data
        this.retrieveQuestionData()
       
        // Save JSON
        //this.saveJsonServerData()        
      }
    }

  }

  onRemoveDiscElem = (event) => {
    console.log("onRemoveDiscElem")
    // this.markQuestionAsModifiedByAnnotator()    
    // TODO: Check if element is used

  }

  // Make the list of discourse options for the discourse option dropdown box
  mkDiscourseOptionsList() {

    var discourseOptions = []
    for (const key in this.discourseMarkers) {
      discourseOptions.push({value: key, label: key.replace("_", " ")})      
    }

    // TODO: Sort by key?


    return discourseOptions;    
  }

  getCurrentDiscourseSelectionCallback(selection) {
    console.log("getCurrentDiscoruseSelectionCallback(): ")
    console.log(selection);

    this.curDiscourseList = selection;
    
  }

  /*
   *  Changing default text
   */
  onCustomizeText = (event) => {
    console.log("onCustomizeText")    
    console.log(event)
    var taskId = event.id
    var currentText = event.content
    var originalText = event.originalText
    //var originalText = "This is sample text"

    // Check to make sure we can modify the text of this cell
    if (taskId.startsWith("blank")) {
      window.alert("ERROR: Can not modify the text of blank spacer cells.")
      return;
    } 
    if (taskId.startsWith("block")) {
      window.alert("ERROR: Can not modify the text of block markers.")
      return;
    } 

    console.log(this.state.tasks)

    //var editedText = window.prompt("Original Text: \n" + originalText, currentText)   // Text is no longer selectable with line-breaks (bug in javascript)
    var editedText = window.prompt(originalText, currentText)

    if (editedText == null || editedText == "") {
      // Cancelled
    } else {
      console.log("Updating text to " + editedText)

      this.state.tasks[taskId].content = editedText
      
      console.log(this.state.tasks)

      this.markQuestionAsModifiedByAnnotator()

      this.storeCurrentData()    

      this.forceUpdate()
      // Refresh question data      
      //this.retrieveQuestionData()

    }

  }


  /*
   *  Modifiers
   */ 

  getNextUnusedBlankModifierKey(modifierColumnTasksIn) {
    var MAX_BLANK = 250;

    var modifierColumnTasks = this.state.columns['column-3']['taskIds'];    
    if (modifierColumnTasksIn !== undefined) {
      modifierColumnTasks = modifierColumnTasksIn
    }

    
    for (var i=0; i<MAX_BLANK; i++) {
      var key = "blank-" + i;      
      if (!modifierColumnTasks.includes(key)) {
        return key
      }
    }

    return "error-no-more-unused-blank-keys"
  }

  autoExpandBlankModifierFill(modifierColumnTaskIdsIn, factColumnTaskIdsIn) {
    var modifierColumnTaskIds = this.state.columns['column-3']['taskIds'];    
    var factColumnTaskIds = this.state.columns['column-1']['taskIds'];    
    if (modifierColumnTaskIdsIn !== undefined) modifierColumnTaskIds = modifierColumnTaskIdsIn
    if (factColumnTaskIdsIn !== undefined) factColumnTaskIds = factColumnTaskIdsIn    

    console.log("MODIFIER COLUMN")
    console.log(modifierColumnTaskIds)

    var numFacts = factColumnTaskIds.length
    var numModifiers = modifierColumnTaskIds.length
    
    var diff = numFacts - numModifiers
    console.log("numFacts: " + numFacts)
    console.log("numModifiers: " + numModifiers)
    console.log("DIFF: " + diff)

    for (var i=0; i<(numFacts-numModifiers); i++) {
      var blank = this.getNextUnusedBlankModifierKey(modifierColumnTaskIds + factColumnTaskIds)
      modifierColumnTaskIds.push( blank )

      console.log("ADDING BLANK:")
      console.log(blank)
    }
    
    /*
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [modifierColumn.id]: modifierColumn,
      },
    };

    this.setState(newState);        
    */
   return modifierColumnTaskIds;
  }

  mkBlankModifiers() {
    var MAX_BLANK = 250;
    var out = {};

    for (var i=0; i<MAX_BLANK; i++) {
      var key = "blank-" + i;      
      //out[key] = { id: key, isRemoved: false, isHoveredOver: false, content: 'blank ' + i, relevance: 0, score: 0 };
      out[key] = { id: key, isRemoved: false, isHoveredOver: false, content: 'blank ' + i, originalText: 'blank ' + i };
    }

    return out;
  }

  // Sanitize output text for the explanation
  sanitizeText(textIn) {
    // Remove text between parentheses
    if (textIn.startsWith("[Section Marker]") || textIn.startsWith("[Final Conclusion]")) {
      return textIn
    }

    // Remove any text within brackets
    var r = textIn.replace(/ *\[[^\]]*]/, '');
    return r
  }


  // From Date() docs
  ISODateString (date) {
    function pad(n){return n<10 ? '0'+n : n}
    return date.getUTCFullYear()+'-'
    + pad(date.getUTCMonth()+1)+'-'
    + pad(date.getUTCDate())+'T'
    + pad(date.getUTCHours())+':'
    + pad(date.getUTCMinutes())+':'
    + pad(date.getUTCSeconds())+'Z'
  }

  getTimestampStr() {
    var today = new Date();    
    var outStr = this.ISODateString(today)
    return outStr;
  }

  /*
  // Toggle whether the question's explanation is marked as done
  toggleIsDone = result => {
    console.log("Toggle isDone")
    if (this.isDone == true) {
      this.isDone = false      
    } else {
      this.isDone = true      
    }

    this.markQuestionAsModifiedByAnnotator()    

    this.storeCurrentData()

    this.forceUpdate()
  }
  */

  toggleStatusStrFlag(flag) {
    console.log("Toggling status flag: " + flag)
    var flags = this.statusStr.split(" ")
    var index = flags.indexOf(flag)

    // Check if flag exists
    if (index == -1) {
      // Add flag
      flags.push(flag)
    } else {
      // Remove flag
      flags.splice(index, 1)      
    }

    this.statusStr = flags.join(" ")

    if (this.checkForStatusFlag("done")) {
      this.isDone = true
    } else {
      this.isDone = false
    }
  
    this.markQuestionAsModifiedByAnnotator()
    this.storeCurrentData()
    this.forceUpdate()
  }

  checkForStatusFlag(flag) {
    if (typeof(this.statusStr) == "undefined") return false;

    var flags = this.statusStr.split(" ")
    var index = flags.indexOf(flag)
    if (index >= 0) return true;
    // default
    return false;
  }


  // Node status flags
  checkForStatusFlagNode(node, flag) {
    //console.log("checkForStatusFlagNode(): statusStr: " + node.statusStr)

    if (typeof(node.statusStr) == "undefined") return false;

    var flags = node.statusStr.split(" ")
    var index = flags.indexOf(flag)
    if (index >= 0) {
      //console.log("flag " + flag + " found in " + node.statusStr)
      return true;
    }
    // default
    //console.log("flag " + flag + " not found in " + node.statusStr)
    return false;
  }

  // Search an entire tree for one or more occurrances of a given status flag
  checkForStatusFlagTree(node, flag) {
    //console.log("checkForStatusFlagTree(): Started... ")
    //console.log("node", node)

    for (var i=0; i<node.length; i++) {
      if (this.checkForStatusFlagNode(node[i], flag) == true){
        //console.log("checkForStatusFlagTree(): Found... ")
        return true;
      } 

      if (node[i].hasOwnProperty('children')) {
        //console.log("checkForStatusFlagTree(): Checking children... ")
        //console.log("checkForStatusFlagNode(): Checking children... (" + uniqueNameToFind + ")")
        var result = this.checkForStatusFlagTree(node[i].children, flag)
        if (result == true) return true;
      }
    }    

    return false;
  }

  // Automatically populate the 'minor edits' flag, if any nodes have 'minor edits' flagged
  autoPopulateMinorEditsFlag(treeData) {
    if (this.checkForStatusFlagTree(treeData, "minoredits")) {
      // Turn on, if off
      if (this.checkForStatusFlag("minoredits") == false) {
        this.toggleStatusStrFlag("minoredits")
      }
    } else {
      // Turn off, if on
      if (this.checkForStatusFlag("minoredits") == true) {
        this.toggleStatusStrFlag("minoredits")
      }
    }
  }

  toggleStatusStrFlagNode(node, uniqueNameToFind, flag) {
    console.log("toggleStatusStrFlagNode(): Started... (" + uniqueNameToFind + ")")
    console.log("node", node)

    for (var i=0; i<node.length; i++) {
      if (node[i].uniqueName == uniqueNameToFind) {        
        console.log("toggleStatusStrFlagNode(): Found...")
        this.toggleStatusStrFlagNodeHelper(node[i], flag)
        return;
      }

      if (node[i].hasOwnProperty('children')) {
        console.log("toggleStatusStrFlagNode(): Checking children... (" + uniqueNameToFind + ")")
        this.toggleStatusStrFlagNode(node[i].children, uniqueNameToFind, flag)
      }
    }    

  }

  toggleStatusStrFlagNodeHelper(node, flag) {
    console.log("Toggling node status flag: " + flag)
    if (typeof(node.statusStr) == "undefined") node.statusStr = "";

    console.log("toggleStatusStrFlagNode(): Current flags: " + node.statusStr)

    var flags = node.statusStr.split(" ")
    var index = flags.indexOf(flag)

    // Check if flag exists
    if (index == -1) {
      // Add flag
      flags.push(flag)
    } else {
      // Remove flag
      flags.splice(index, 1)      
    }

    node.statusStr = flags.join(" ")

    console.log("toggleStatusStrFlagNode(): New flags: " + node.statusStr)

    // TODO: Do these need to be done?
    this.markQuestionAsModifiedByAnnotator()
    this.storeCurrentData()
    this.forceUpdate()        
  }

  // Update annotator initials
  annotatorInitialUpdate = event => {        
    this.annotatorName = event.target.value
    console.log("ANNOTATOR INITIALS: " + this.annotatorName)

    document.cookie = "annotatorName=" + this.annotatorName + "; path=/;"

    this.forceUpdate()
  }

  // Put this annotator's initials on this example
  markQuestionAsModifiedByAnnotator() {
    var annotators = this.annotators.split(" ")
    var outStr = ""

    for (var i=0; i<annotators.length; i++) {
      if (annotators[i] != this.annotatorName) {
        outStr += annotators[i] + " "
      }
    }

    // Add this annotator's name to the front
    outStr = this.annotatorName + " " + outStr
    outStr = outStr.trim()

    // Save
    this.annotators = outStr

    // Also update the timestamp to the question
    this.doneTimestamp = this.getTimestampStr()

    // Also set the global isModified flag
    this.isModified = true

  }

  // Helper function (from https://www.w3schools.com/js/js_cookies.asp)
  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // Generate statistics
  generateStatistics() {
    var FileSaver = require('file-saver');
    var delim = "\t"    
    var outStr = ""

    // Header
    outStr += "idx" + delim
    outStr += "done" + delim
    outStr += "flags" + delim
    outStr += "numExamples" + delim
    outStr += "explLength" + delim
    outStr += "annotators" + delim
    outStr += "qid" + delim
    outStr += "topics" + delim
    outStr += "question" + delim
    outStr += "answer" + delim
    outStr += "\n"

    // Create statistics string
    var count = 0
    for (var i=0; i<this.sampleData.length; i++) {
      var data = this.sampleData[i];

      outStr += i + delim

      var found = false
      for (var exampleIdx=0; exampleIdx<data['examples'].length; exampleIdx++) {
        var curExample = data['examples'][exampleIdx];
        if (curExample.isDone == true) {
          found = true
          break
        }
      }

      if (found == true) {
        outStr += "1" + delim
      } else {
        outStr += "0" + delim
      }

      outStr += curExample.statusStr + delim

      outStr += data['examples'].length + delim

      // Count length of first example
      var curExample = data['examples'][0];
      var explLength = 0
      for (var j=0; j<curExample['taskOrdering'].length; j++) {
        if (curExample['taskOrdering'][j] == "removemarker") break
        explLength += 1        
      }
      outStr += explLength + delim

      outStr += curExample['annotators'] + delim

      outStr += data['qid'] + delim
      outStr += data['topics'] + delim
      outStr += data['questionText'] + delim
      outStr += data['answerText'] + delim      

      outStr += "\n"
      
    }

    // Export
    var blob = new Blob([outStr], {type: "text/plain;charset=utf-8"});
    var filenameOut = "statistics-" + this.getTimestampStr() + ".txt"
    FileSaver.saveAs(blob, filenameOut);

  }

  resaveAll() {    
    var timeFrame = 1500;        
    
    if (this.saveIdx < this.sampleData.length) {
      console.log(this.saveIdx)
      this.saveJsonServerDataQuestion(this.saveIdx)
      this.saveIdx += 1
      setTimeout(this.resaveAll.bind(this), timeFrame)
    } else {
      this.saveIdx = 0
    }

  }  

  // Handle keyboard input (primarily, arrow navigation)
  checkKey(e) {  
      e = e || window.event;  
      //## console.log(e)
      if (e.keyCode == '38')  {
          // up arrow
      }
      else if (e.keyCode == '40') {
          // down arrow
      }
      else if (e.keyCode == '37') {
         // left arrow
         this.movePrevQuestion()
      }
      else if (e.keyCode == '39') {
         // right arrow
         this.moveNextQuestion()
      } 
      else if (e.keyCode == '33') {
        // Page up
        this.movePrevQuestion25()
      }
      else if (e.keyCode == '34') {
        // Page down
        this.moveNextQuestion25()
      }
      
  
  }


  /*
   *  Tree stuff
   */
  mkSampleTree() {
    // Test -- react-sortable-tree
    var treeData = [
      { name: 'the water will boil if heat energy is increased past the boiling point',
        className:"icon-a",
        expanded: true,
        children: [
          { name: 'the water will increase temperature by absorbing heat energy',
            className:"icon-b",
            expanded: true,
            children: [ 
              { name: 'the pot is touching the water',
                className:"icon-c",
                expanded: true,
                children: [ 
                  { name: 'a pot contains water' },
                  { name: 'if a pot contains something then that pot touches that something',
                    className:"icon-b",
                    expanded: true,
                    children: [ 
                      { name: 'a pot is a kind of container' },
                      { name: 'if a container contains something then that container touches that something' },                              
                    ],
                   },            
                ],
              },
              { name: 'if a pot touches something, then something will increase temperature by absorbing heat energy from the object' },        
            ],
          },
          { name: 'boiling happens when liquids increase heat energy above their boiling point',
            expanded: true,
            children: [
              { name: 'boiling happens when liquids are heated above their boiling points' },
              { name: 'heating means adding heat' },
            ],
          },
        ],
      },                        

      { name: 'x' },
    ]    

    return treeData;
  }

  mkEmptyTree() {
    var treeData = [
      { id: "marker-core1",
        name: 'The core concepts to know to answer this question are:',
        className:"icon-a",
        expanded: true
      }
      ]

    return treeData;    
  }

  /*
   *  Discourse marker listbox
   */  

  listBoxExample() {
    return (
      <select id="test">
        <option value="blank"> blank </option>
        <option value="item-1"> test 1 </option>
        <option value="item-2"> test 2 </option>
        <option value="item-3"> test 3 </option>
        <option value="item-4"> test 4 </option>
      </select>
    )
  }


  /*
   *  Fact box
   */  
  
  buttonFactFilterAll = result => {
    this.factFilter = []
    this.forceUpdate()
  }

  buttonFactFilterMarkers = result => {
    this.factFilter = ["marker", "block-section"]
    this.forceUpdate()
  }

  buttonFactFilterFacts = result => {
    this.factFilter = ["write", "block-section", "task", "fact"]
    this.forceUpdate()
  }

  /*
   *  String for removal confirmation
   */ 
  getNodeRemovalConfirmationStr(node) {
    var out = this.getNodeRemovalConfirmationStrHelper(node)
    for (var i=0; i<out.length; i++) {
      out[i] = (i+1) + ": " + out[i]
    }

    var outStr = "Are you sure you want to delete " + out.length + " node(s)? \n\n"
    outStr += out.join("\n")

    return outStr;
  }

  getNodeRemovalConfirmationStrHelper(node) {
    var thisStr = []
    thisStr.push( node.name )
    if (node.hasOwnProperty('children')) {
      for (var i=0; i<node.children.length; i++) {        
        thisStr = thisStr.concat( this.getNodeRemovalConfirmationStrHelper(node.children[i]) )
      }
    }

    return thisStr;
  }

  // Traverse the tree -- if a node doesn't contain OriginalText, populate it with 'name'. 
  ensureTreeHasOriginalText(node) {
    if (typeof(node) == "undefined") return;
    for (var i=0; i<node.length; i++) {
      // This node
      if (!node[i].hasOwnProperty('originalText')) {
        node[i].originalText = node[i].name
      }

      // Children
      if (typeof(node[i].children) != "undefined") {
        this.ensureTreeHasOriginalText( node[i].children )
      }    
    }
  }

  /*
   *  Explanation string generation
   */

   // Column version
   mkExplanationStringColumns() {
    return this.orderedText.map((item) => {
      var text = item[0];
      var highlight = item[1];
      var taskid = item[2];
      var sanitizedText = this.sanitizeText(text)

      if (highlight == true) {
        //return <ParaTextHighlight> {text} </ParaTextHighlight>          
        //return {text}
        if (taskid.startsWith("block") || taskid.startsWith("marker")) {
          return (<DivInline> <BRSmall /> <SpanHighlight> {sanitizedText} </SpanHighlight> </DivInline>)
        } else {
          return (<SpanHighlight> {sanitizedText} </SpanHighlight> )
        }
      } else {                    
        //return <SpanNormal> {text} </SpanNormal>          
        var bgcolor="white";
        if (taskid.startsWith("disc"))  bgcolor = "#f0ebfa";
        if (taskid.includes("marker"))  bgcolor = "lightblue";
        if (taskid.startsWith("block")) bgcolor = "#E5E4E2";
        if (taskid.startsWith("write")) bgcolor = "#ffdb99";

        if (taskid.startsWith("block") || taskid.startsWith("marker")) {
          return (<DivInline> <BRSmall /> <SpanCustom backgroundcolor={bgcolor}> {sanitizedText} </SpanCustom> </DivInline> )
        } else {
          return (<SpanCustom backgroundcolor={bgcolor}> {sanitizedText} </SpanCustom>)
        }
        //return {text}
        //outText += text
      }

    })
   }

  // Tree version (for exporting)
   // Tree version
   mkExplanationStringTreeExportFlat(treeData) {
    console.log("Tree:")
    console.log(treeData)

    var out = this.mkExplanationStringTreeHelperStringExport(treeData)    

    //##    
    for (var i=0; i<treeData.length; i++) {
      if (treeData[i].id == "marker-summary1") {
        //console.log("explTreeStart:")
        //console.log(treeData[i])

        var rootNode = treeData[i]
        if (typeof(rootNode.children) != "undefined") {
          if (rootNode.children.length > 0) {
            var outTreeOrdered = []
            var explTreeTest = this.collectInfTreeExplanation( rootNode.children )
            //console.log("explTreeTest:")
            //console.log(explTreeTest)    

            for (var j=0; j<explTreeTest.length; j++) {
              for (var k=0; k<explTreeTest[j].length; k++) {
                //console.log(explTreeTest[j][k])

                if ((k==0) && (j!=0)) {
                  if (j < (explTreeTest.length-1)) {
                    // Space markers between inference steps
                    //## out.push( this.mkExplanationStringTreeElem() )
                    outTreeOrdered.push( { connective:"", name: "[Section Marker]", id:"block" } )
                  } else {
                    // Last marker
                    //## out.push( this.mkExplanationStringTreeElem({ connective:"", name: "[Final Conclusion]", id:"block" }) )
                    outTreeOrdered.push( { connective:"", name: "[Final Conclusion]", id:"block" } )
                  }                
                }

                var id = ""
                //var node = { connective:explTreeTest[j][k][0], name: explTreeTest[j][k][1], id:id }
                var node = explTreeTest[j][k]
                //## out.push( this.mkExplanationStringTreeElem(node) )
                outTreeOrdered.push( node )
              }
            }
    
            //console.log("outTreeOrdered:", outTreeOrdered)          
            // Output tree in order (required to properly deliminate with periods for send-of-sentence bounds)          
            for (var a=0; a<outTreeOrdered.length; a++) {
              if (i < (outTreeOrdered.length-1)) {
                out.push( this.mkExplanationStringTreeElemStringExport(outTreeOrdered[a], outTreeOrdered[a+1]) )
              } else {
                out.push( this.mkExplanationStringTreeElemStringExport(outTreeOrdered[a], undefined) )
              }
            }          
          }
        }
      } 
      if ((typeof(treeData[i].id) != "undefined") && (treeData[i].id == "marker-remove1")) break
    }


    return out;

  }

  

  // Tree version (for display)
  mkExplanationStringTree() {
    console.log("Tree:")
    console.log(this.tree)

    /*
    var out = []
    for (var i=0; i<this.treeData.length; i++) {
      out = out.concat( this.mkExplanationStringTreeHelper(this.treeData[i]) )
    }
    */
    var out = this.mkExplanationStringTreeHelper(this.treeData)

    //##    
    for (var i=0; i<this.treeData.length; i++) {
      if (this.treeData[i].id == "marker-summary1") {
        console.log("explTreeStart:")
        console.log(this.treeData[i])

        var rootNode = this.treeData[i]
        if (typeof(rootNode.children) != "undefined") {
          if (rootNode.children.length > 0) {
            var outTreeOrdered = []
            var explTreeTest = this.collectInfTreeExplanation( rootNode.children )
            console.log("explTreeTest:")
            console.log(explTreeTest)    

            for (var j=0; j<explTreeTest.length; j++) {
              for (var k=0; k<explTreeTest[j].length; k++) {
                console.log(explTreeTest[j][k])

                if ((k==0) && (j!=0)) {
                  if (j < (explTreeTest.length-1)) {
                    // Space markers between inference steps
                    //## out.push( this.mkExplanationStringTreeElem() )
                    outTreeOrdered.push( { connective:"", name: "[Section Marker]", id:"block" } )
                  } else {
                    // Last marker
                    //## out.push( this.mkExplanationStringTreeElem({ connective:"", name: "[Final Conclusion]", id:"block" }) )
                    outTreeOrdered.push( { connective:"", name: "[Final Conclusion]", id:"block" } )
                  }                
                }

                var id = ""
                //var node = { connective:explTreeTest[j][k][0], name: explTreeTest[j][k][1], id:id }
                var node = explTreeTest[j][k]
                //## out.push( this.mkExplanationStringTreeElem(node) )
                outTreeOrdered.push( node )
              }
            }
    
            console.log("outTreeOrdered:", outTreeOrdered)          
            // Output tree in order (required to properly deliminate with periods for send-of-sentence bounds)          
            for (var a=0; a<outTreeOrdered.length; a++) {
              if (i < (outTreeOrdered.length-1)) {
                out.push( this.mkExplanationStringTreeElem(outTreeOrdered[a], outTreeOrdered[a+1]) )
              } else {
                out.push( this.mkExplanationStringTreeElem(outTreeOrdered[a], undefined) )
              }
            }          
          }
        }
      } 
      if ((typeof(this.treeData[i].id) != "undefined") && (this.treeData[i].id == "marker-remove1")) break
    }


    return out;

  }

  mkExplanationStringTreeHelper(node) {
    var ordered = this.mkExplanationStringTreeHelperOrdered(node)
    var out = []
    
    console.log("ordered:", ordered)    
    for (var i=0; i<ordered.length; i++) {
      if (i < (ordered.length-1)) {
        out.push( this.mkExplanationStringTreeElem(ordered[i], ordered[i+1]) )
      } else {
        out.push( this.mkExplanationStringTreeElem(ordered[i], undefined) )
      }
    }
    

    // Return
    return out;
  }

  mkExplanationStringTreeHelperOrdered(node) {
    
    var out = []    
    for (var i=0; i<node.length; i++) {
      //console.log("node i:")
      //console.log(node[i])
      
      if ((typeof(node[i].id) != "undefined") && (node[i].id == "marker-remove1")) break

      //## out.push( this.mkExplanationStringTreeElem(node[i]) )
      out.push( node[i] )

      if (node[i].hasOwnProperty('children')) {

        // Do not export for "In Summary" entailment trees -- this is handled by a subsequent function
        if (node[i].id != "marker-summary1") {
          //console.log("node i children: ")
          //console.log(node[i].children)

          //for (var j=0; j<node[i].children.length; j++) {                    
            var result = this.mkExplanationStringTreeHelperOrdered(node[i].children)
            out = out.concat( result )
          //}
        }
      }
    }
    
    return out;
  }

  // For exporting strings
  mkExplanationStringTreeHelperStringExport(node) {
    var ordered = this.mkExplanationStringTreeHelperOrdered(node)
    var out = []
    
    //console.log("ordered:", ordered)    
    for (var i=0; i<ordered.length; i++) {
      if (i < (ordered.length-1)) {
        out.push( this.mkExplanationStringTreeElemStringExport(ordered[i], ordered[i+1]) )
      } else {
        out.push( this.mkExplanationStringTreeElemStringExport(ordered[i], undefined) )
      }
    }
    

    // Return
    return out;
  }  

  mkExplanationStringTreeElem(node, next) {    

    var connectiveText = ""
    if (node.hasOwnProperty('connective')) {
      connectiveText = this.sanitizeText(node.connective).trim()
    }
    var sanitizedText = this.sanitizeText(node.name).trim()

    var discColor = "#f0ebfa"

    //var text = node['name'] + ;
    var highlight = node.highlight;
    var taskid = ""
    if (node.hasOwnProperty('id')) {
      taskid = node['id'];
    }
    
    // console.log("formattedOut:" + formattedOut)
    var nextConnectiveAddPeriod = true
    if (typeof(next) != "undefined") {
      if (typeof(next.connective) != "undefined") {
        if ((next.connective.length > 0) && (next.connective[0] === next.connective[0].toLowerCase())) {
          // Character is lower case -- no period required
          nextConnectiveAddPeriod = false
        }
      }
    }
    if (sanitizedText.endsWith(".") || sanitizedText.endsWith(":") || sanitizedText.endsWith(",") || sanitizedText.startsWith("[")) {
      // Do nothing            
    } else if (nextConnectiveAddPeriod == false) {
      // Do nothing
    } else {
      sanitizedText += ".";
    }

    if (highlight == true) {
      //return <ParaTextHighlight> {text} </ParaTextHighlight>          
      //return {text}
      if (taskid.startsWith("block") || taskid.startsWith("marker")) {
        return (<DivInline> <BRSmall /> 
                <SpanHighlightDisc> {connectiveText} </SpanHighlightDisc> 
                <SpanHighlight> {sanitizedText} </SpanHighlight> 
                </DivInline>)
      } else {
        return (<DivInline>
                <SpanHighlightDisc> {connectiveText} </SpanHighlightDisc> 
                <SpanHighlight> {sanitizedText} </SpanHighlight> 
                </DivInline>)
      }
    } else {                    
      //return <SpanNormal> {text} </SpanNormal>          
      var bgcolor="white";
      if (taskid.startsWith("disc"))  bgcolor = "#f0ebfa";
      if (taskid.includes("marker"))  bgcolor = "lightblue";
      if (taskid.startsWith("block")) bgcolor = "#E5E4E2";
      if (taskid.startsWith("write")) bgcolor = "#ffdb99";
      if (taskid.startsWith("marker-summary1")) bgcolor = "#b2df8a";

      if (taskid.startsWith("block") || taskid.startsWith("marker")) {
        return (<DivInline> <BRSmall /> 
                <SpanCustom backgroundcolor={discColor}> {connectiveText} </SpanCustom> 
                <SpanCustom backgroundcolor={bgcolor}> {sanitizedText} </SpanCustom> 
                </DivInline> )
      } else {
        return (<DivInline><SpanCustom backgroundcolor={discColor}> {connectiveText} </SpanCustom>
                <SpanCustom backgroundcolor={bgcolor}> {sanitizedText} </SpanCustom>
                </DivInline>)
      }
      //return {text}
      //outText += text
    }

    /*
    //## Tester
    var bgcolor="white";
    return ( <SpanCustom backgroundcolor={bgcolor}> {sanitizedText} </SpanCustom> )
    */
  }

  // Just for string export
  mkExplanationStringTreeElemStringExport(node, next) {    

    var connectiveText = ""
    if (node.hasOwnProperty('connective')) {
      connectiveText = this.sanitizeText(node.connective).trim()
    }
    var sanitizedText = this.sanitizeText(node.name).trim()

    var discColor = "#f0ebfa"

    //var text = node['name'] + ;
    var highlight = node.highlight;
    var taskid = ""
    if (node.hasOwnProperty('id')) {
      taskid = node['id'];
    }
    
    // console.log("formattedOut:" + formattedOut)
    var nextConnectiveAddPeriod = true
    if (typeof(next) != "undefined") {
      if (typeof(next.connective) != "undefined") {
        if ((next.connective.length > 0) && (next.connective[0] === next.connective[0].toLowerCase())) {
          // Character is lower case -- no period required
          nextConnectiveAddPeriod = false
        }
      }
    }
    if (sanitizedText.endsWith(".") || sanitizedText.endsWith(":") || sanitizedText.endsWith(",") || sanitizedText.startsWith("[")) {
      // Do nothing            
    } else if (nextConnectiveAddPeriod == false) {
      // Do nothing
    } else {
      sanitizedText += ".";
    }

    return {connectiveText:connectiveText, sanitizedText:sanitizedText}    
  }

  /*
   *  Give nodes unique numbers
   */ 
  giveNodesUniqueNumbers(node) {    
    for (var i=0; i<node.length; i++) {
      if (!node[i].hasOwnProperty['uniqueName']) {
        node[i]['uniqueName'] = Math.floor(Math.random() * 100000);
      }

      if (node[i].hasOwnProperty('children')) {
          var result = this.giveNodesUniqueNumbers(node[i].children)
      }
    }        
  }

  /*
   *  Connectives (tree)
   */
  initializeConnectivesTree() {
    this.connectives = []    

    //this.connectives.push(["blank", ""])
    this.connectives.push(["title-1", "GENERAL"])
    this.connectives.push(["disc-1", "and"])
    this.connectives.push(["disc-2", "More specifically, [elaboration/more detail]"])
    this.connectives.push(["disc-3", "which is called [definition]"])
    this.connectives.push(["blank", ""])
    this.connectives.push(["title-2", "COMPARE/CONTRAST"])
    this.connectives.push(["disc-4", "Similarly, [comparison, same properties]"])
    this.connectives.push(["disc-5", "Conversely, [comparision, different properties]"])
    this.connectives.push(["disc-6", "But,"])
    this.connectives.push(["disc-7", "Because both [comparison, 'X and Y have the same/diff properties']"])
    this.connectives.push(["disc-8", "we can infer that they are [comparison, conclusion, similar/different]"])
    this.connectives.push(["disc-9", "If [hypothetical, list of assertions]"])
    this.connectives.push(["disc-10", "then [hypothetical, conclusion]"])
    this.connectives.push(["disc-11", "Imagine a situation where [hypothetical, list of assertions]"])
    this.connectives.push(["disc-12", "Because [actual, list of assertions]"])    
    this.connectives.push(["disc-13", "we can infer that [actual, conclusion]"])    
    this.connectives.push(["disc-14", "which is subjectively considered [X for Y, conclusion, elaboration]"])
    this.connectives.push(["blank", ""])
    this.connectives.push(["title-3", "TEMPORAL"])
    this.connectives.push(["disc-15", "First, [start of sequence]"])    
    this.connectives.push(["disc-16", "Then, [next step in sequence]"])    
    this.connectives.push(["disc-17", "Finally, [end of sequence]"])    
    this.connectives.push(["blank", ""])
    this.connectives.push(["disc-auto", "--"])
    this.connectives.push(["disc-unk", "UNKNOWN [import error]"])
    
    //this.connectives.push(["disc-14", "Therefore"])
    //this.connectives.push(["disc-15", ""])
    //this.connectives.push(["disc-16", ""])
    //this.connectives.push(["disc-17", ""])

    // Compute LUT
    this.computeConnectivesLUT()
  }

  // Recompute connectives look-up table
  computeConnectivesLUT() {
    this.connectivesLUT = new Map(this.connectives.map(i => [i[0], i[1]]));
    this.connectivesReverseLUT = new Map(this.connectives.map(i => [i[1], i[0]]));
  }

  /*
   *  Tree - discourse marker select box callback
   */ 

  // Callback from discourse selection listbox on a given row -- update the tree node (row) with the new selection
  updateSelectBoxSelection(newSelectionInfo) {
    console.log("updateSelectBoxSelection()")    
    console.log(newSelectionInfo)
    //console.log(result)    
    console.log(this.uniqueName)

    var uniqueName = newSelectionInfo.uniqueName;
    var connectiveID = newSelectionInfo.value;
    var connective = newSelectionInfo.textValue;

    // Set the connective of the specified node to be its new value
    this.updateNodeConnectiveTextHelper(this.treeData, uniqueName, connectiveID, connective)
    
    this.markQuestionAsModifiedByAnnotator()

    //## BUG in react-sortable-dnd : must update the tree (like add/remove a phantom node) to have it update the rowHeights in the display.
    // This applies to when something causes the row height to change dynamically (like setting the auto function for the inference tree connectives)
    if (connectiveID == "disc-auto") {
      this.addPhantomNodeToRefreshHeight()
    } else {
      this.forceUpdate()
    }


  }

  countNodesInTree(node, omitCollapsedNodes=false) {
    var count = 0
    for (var i=0; i<node.length; i++) {
      count += 1      
      if (node[i].hasOwnProperty('children')) {
        
        var isExpanded = true
        if ((node[i].hasOwnProperty('expanded')) && (node[i].expanded == false)) {
          isExpanded = false
        } 

        //console.log("node", i, node[i], isExpanded, omitCollapsedNodes)

        if ((omitCollapsedNodes == false) || (isExpanded == true)) {          
          count += this.countNodesInTree(node[i].children, omitCollapsedNodes)
        }      
      }
    }
    // Return     
    return count
  }

  // This adds then quickly removes a phantom node to the tree, causing the display to refresh the height rendering. 
  // This appears to be a known but in react-sortable-tree, and this is a very hacky workaround (but I haven't found anything else that works yet)
  addPhantomNodeToRefreshHeight() {
    // Step 1: Add a node on the end
    var newItem = {}
    newItem.node = { className:"icon-hidden", name: "", id: "temp-remove-me" }
    newItem.depth = 0; //this.countNodesInTree(this.treeData)
    newItem.minimumTreeIndex = this.countNodesInTree(this.treeData) //this.countNodesInTree(this.treeData)-1

    
    console.log("oldTreeData:", this.treeData)
    var newTreeData = insertNode({
      treeData: this.treeData,
      newNode: newItem.node,
      depth: newItem.depth,
      minimumTreeIndex: newItem.minimumTreeIndex,
      //expandParent: true,
      //getNodeKey: ({ treeIndex }) => treeIndex,
    });
    console.log("newTreeData:", newTreeData)
    this.treeData = newTreeData.treeData
    
    // Re-render display
    this.forceUpdate()        

    // Step 2: Now remove the node we just added on the end
    this.sleep(100).then(() => { 
      //this.treeData = beforeTree;
      //var idx = countNodesInTree(this.treeData)-1
      var idx = this.countNodesInTree(this.treeData, true)-1
      var path = [idx]
      console.log("path", path)
      var newTreeData1 = removeNodeAtPath({
        treeData: this.treeData,
        path: path,   // You can use path from here
        //getNodeKey: ({ node: { id } }) => id,
        getNodeKey: ({ treeIndex }) => treeIndex,
        //ignoreCollapsed: false,
      });

      console.log("newTreeData1:", newTreeData1)
      this.treeData = newTreeData1

      this.forceUpdate()
    });        

  }

  addNewNodeAtBottom(newNode) {
    // Step 1: Add a node on the end
    var minimumTreeIndex = this.countNodesInTree(this.treeData) //this.countNodesInTree(this.treeData)-1

    
    //console.log("oldTreeData:", this.treeData)
    var newTreeData = insertNode({
      treeData: this.treeData,
      newNode: newNode,
      depth: 0,
      minimumTreeIndex: minimumTreeIndex,
      //expandParent: true,
      //getNodeKey: ({ treeIndex }) => treeIndex,
    });
    //console.log("newTreeData:", newTreeData)
    this.treeData = newTreeData.treeData
    
    // Re-render display
    //this.forceUpdate()        
  }

  // Searches through a tree (starting from root node 'node') to find a node with uniqueName==uniqueNameToFind.  Sets the connective of that node to 'value'
  updateNodeConnectiveTextHelper(node, uniqueNameToFind, connectiveID, connectiveValue) {    
    for (var i=0; i<node.length; i++) {
      if (node[i].uniqueName == uniqueNameToFind) {
        node[i].connectiveID = connectiveID
        node[i].connective = connectiveValue        
        //console.log("updateNodeConnectiveTextHelper(): Found node")
        //console.log(node[i])
        return
      }

      if (node[i].hasOwnProperty('children')) {
          this.updateNodeConnectiveTextHelper(node[i].children, uniqueNameToFind, connectiveID, connectiveValue)
      }
    }        
  }

  /*
   * Tree node highlighting
   */ 
  setHighlightedNode(node, uniqueNameToFind) {
    for (var i=0; i<node.length; i++) {
      if (node[i].uniqueName == uniqueNameToFind) {
        if (node[i].highlight == true) {
          node[i].highlight = false
        } else {
          node[i].highlight = true
        }        
      } else {
        node[i].highlight = false
      }

      if (node[i].hasOwnProperty('children')) {
          this.setHighlightedNode(node[i].children, uniqueNameToFind)
      }
    }            
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


  addModifiedMarker(node) {
    if (node.name != node.originalText) {
      //return (<font color="lightgrey">&nbsp; &#9899;</font>)
      return (<font color="silver">&nbsp; &#9899;</font>)
    } else {
      return;
    }
  }

  addNodeScoreText(node) {
    if (node.hasOwnProperty("score")) {
      return (<SpanGray12pt>&nbsp;&nbsp;&nbsp; {node.relevance} &nbsp;&nbsp; {node.score.toFixed(2)}</SpanGray12pt>)      
    } else {
      return (<SpanGray12pt>&nbsp;&nbsp;&nbsp; {node.relevance} &nbsp;&nbsp; </SpanGray12pt>)      
    }
  }

  addClonedText(node) {
    if (node.hasOwnProperty("freshlyCloned")) {
      if (node.freshlyCloned == true) {
        return (<SpanGray12pt> &nbsp;&nbsp; <i class="fas fa-clone"></i> </SpanGray12pt>)      
      }
    }

  }

  removeFreshlyClonedFlag(node) {
    if (node.hasOwnProperty("freshlyCloned")) {
      delete node.freshlyCloned
    }
  }

  // Remove any 'freshlyCloned' flags that aren't in the main branch of the tree
  removeOldFreshlyClonedFlags(node, isRootNode=true) {
    for (var i=0; i<node.length; i++) {
      if (isRootNode == false) {
        this.removeFreshlyClonedFlag(node[i])
      }

      if (node[i].hasOwnProperty('children')) {
          this.removeOldFreshlyClonedFlags(node[i].children, false)
      }
    }            

  }

  /*
   *  Default markers (tree)
   */ 
  populateDefaultMarkers() {
    var out = [];

    out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-qc1", name: 'This question is about [question class]' }}/>)
    out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-bg1", name: 'As background,' }}/>)
    out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-core1", name: 'The core concepts to know to answer this question are:' }}/>)
    out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-ex1", name: 'In this example, [grounding concept in example]' }}/>)
    out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-add1", name: 'While not critical to answer the question, it may also be helpful to know that:' }}/>)
    out.push( <YourExternalNodeComponent node={{ className:"icon-a", id: "marker-syn1", name: 'Some word synonymy relations you might need to know to answer this question are:' }}/>)      
    out.push( <YourExternalNodeComponent node={{ className:"icon-a1", id: "marker-summary1", name: 'In summary, [inference tree/conclusion]' }}/>)      
    

    // Also copy the names to originalText
    for (var i=0; i<out.length; i++) {
      out[i].props.node.originalText = out[i].props.node.name
    }

    return out;
  }

  // Discourse
  onAddDiscElemTree = (event) => {
    console.log("onAddDiscElemTree")    

    // Refresh latest list of discourse markers from server
  
    var elementName = window.prompt("Please enter the discourse ELEMENT to add:", "element")
    if (elementName == null || elementName == "") {
      // Cancelled
    } else {
      //this.markQuestionAsModifiedByAnnotator()

      //this.storeCurrentData()    
        
      this.loadDiscourseMarkersTree(true, () => {
        // Add an appropriate prefix to the element to determine coloring
        var elemKeyPrefix = "marker-"
        
        // Create a unique key
        var elemKey = elemKeyPrefix + "-" + Math.floor(Math.random() * 1000000);              

        var newOption = { id: elemKey, className:"icon-a", isRemoved: true, isHoveredOver: false, name: elementName, content: elementName, originalText: elementName };      
        this.discourseMarkersTree.push( <YourExternalNodeComponent node={newOption}/>)                  

        // Refresh question data      
        //this.retrieveQuestionData()

        // Save JSON
        //this.saveJsonServerData()        
        this.saveDiscourseMarkersConnectivesTree()

        this.forceUpdate();

        console.log("onAddDiscElemTree(): this.discourseMarkersTree:")
        console.log(this.discourseMarkersTree)

      })
      
    }

  }

  // Discourse
  onAddConnectiveElemTree = (event) => {
    console.log("onAddConnectiveElemTree")    

    // Refresh latest list of discourse markers from server
    // 

    var elementName = window.prompt("Please enter the connective ELEMENT to add:", "element")
    if (elementName == null || elementName == "") {
      // Cancelled
    } else {
      //this.markQuestionAsModifiedByAnnotator()

      //this.storeCurrentData()    
      this.loadConnectivesTree(true, () => {      

        // Add an appropriate prefix to the element to determine coloring
        var elemKeyPrefix = "disc-"
        
        // Create a unique key
        var elemKey = elemKeyPrefix + "-" + Math.floor(Math.random() * 1000000);              

        this.connectives.push([elemKey, elementName])
        this.computeConnectivesLUT()

        // Save JSON
        //this.saveJsonServerData()        
        this.saveDiscourseMarkersConnectivesTree()

        // Refresh question data      
        //this.retrieveQuestionData()      
      
        this.forceUpdate()
        console.log("onAddConnectiveElemTree(): this.connectives:")
        console.log(this.connectives)

      });

    }

  }
  

  /*
   *  Import/Convert from Column to Tree format
   */


  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // Hack to save all trees one at a time after a conversion
  // ----------------------------------------------------------------------
  resaveConvertedData() {
    console.log("Resaving converted data...")

    //this.moveQuestion(1);
    this.saveCount = 0

    setTimeout(this.doSaveHelper(), 1000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }      

  doSaveHelper() {
    //if (this.saveCount < 10) {
      this.saveCount += 1
      console.log("Saving " + this.saveCount)
      this.isModified = true
      this.moveNextQuestion()      
    //}

    if (this.saveCount < this.sampleData.length) {
      this.sleep(500).then(() => { this.doSaveHelper() });      
    }
  }

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  // Convert the entire set from the column format to the tree format
  convertFromColumnToTreeFormatAll() {
    for (var qIdx=0; qIdx<this.sampleData.length; qIdx++) {
      console.log("Converting " + qIdx)
      this.convertFromColumnToTreeFormatSpecificQuestion(qIdx)
    }

    this.forceUpdate()
  }

  convertFromColumnToTreeFormatSpecificQuestion(qIdx) {
/*
    var factOrdering = this.state.columns['column-1']['taskIds'];
    var modifierOrdering = this.state.columns['column-3']['taskIds'];    
    var tasks = this.state.tasks;
*/
    // Load data
    var data = this.sampleData[qIdx];
    //var curExample = data['examples'][qIdx];    
    var curExample = data['examples'][this.curExample];
    var factOrdering = curExample['taskOrdering'];
    var modifierOrdering = curExample['modifierOrdering'];
    var tasks = curExample['tasks'];

    // Convert
    var convertedTree = this.convertFromColumnToTreeFormat(factOrdering, modifierOrdering, tasks)

    if (convertedTree.length == 0) {
      convertedTree = this.mkEmptyTree()
    } else {
      // Save (flags)
      curExample['statusStr'] = "tree-legacy " + curExample['statusStr']
      curExample['annotators'] = "AUTO " + curExample['annotators'];
    }

    // Pop-out flat tree
    convertedTree = this.popoutConvertedTree(convertedTree)


    // Save (tree)
    curExample['tree'] = convertedTree;

    // Store this example
    data['examples'][this.curExample] = curExample;
    this.sampleData[this.curQuestion] = data;

    //this.forceUpdate()
  }

  // Take a flat tree and "pop-out" all non-marker nodes by one element
  popoutConvertedTree(treeIn) {
    var treeOut = []

    var curBranch = treeIn[0]
    curBranch.expanded = true;

    for (var i=1; i<treeIn.length; i++) {
      treeIn[i].expanded = true;
      if (treeIn[i].id.startsWith("marker")) {
        // Pop current branch        
        treeOut.push( curBranch )

        // Start new branch
        curBranch = treeIn[i]
        curBranch.children = []
      } else {
        // Add to current branch
        if (typeof(curBranch.children) == "undefined") {
          curBranch.children = []
        }
        curBranch.children.push ( treeIn[i] )
      }
    }
    treeOut.push( curBranch ) // Push last branch

    //console.log(treeIn, treeOut)

    return treeOut
  }

  convertFromColumnToTreeFormat(factOrdering, modifierOrdering, tasks) {
    var treeOut = []
    var matchThresh = 0.20

    var numModifiersConverted = 0

    // Column data
    /*
    var factOrdering = this.state.columns['column-1']['taskIds'];
    var modifierOrdering = this.state.columns['column-3']['taskIds'];    
    var tasks = this.state.tasks;
    */

    for (var i=0; i<factOrdering.length; i++) {
      var modifierID = modifierOrdering[i]
      var factID = factOrdering[i]

      // Bound checking -- if the data is undefined for whatever reason (e.g. unpopulated), return whatever we have so far. 
      if ((typeof(modifierID) == "undefined") || (typeof(factID) == "undefined")) {
        return treeOut
      }

      var modifier = tasks[modifierID]
      var fact = tasks[factID]

      //console.log(i)
      //console.log("modifier: " + modifierID)
      //console.log(modifier)
      var modifierMarkerScore = this.convertHelperMarker(modifier.content) 
      var modifierConnectiveScore = this.convertHelperConnective(modifier.content) 
      
      var modifierRole = "fact"
      if ((modifierConnectiveScore.maxScore > modifierMarkerScore.maxScore) && (modifierConnectiveScore.maxScore > matchThresh)) {
        // This marker is likely a connective
        modifierRole = "connective"
        numModifiersConverted += 1
      } else if ((modifierMarkerScore.maxScore > modifierConnectiveScore.maxScore) && (modifierMarkerScore.maxScore > matchThresh)) {
        // This marker is likely a stand-alone marker block
        modifierRole = "marker"
        numModifiersConverted += 1
      } else if (modifier.content.startsWith("blank")) {
        // This is likely a blank (spacer) row and shouldn't be included
        modifierRole = "blank"
      }

      //console.log("fact: " + factID)
      //console.log(fact)
      var factMarkerScore = this.convertHelperMarker(fact.content)
      var factConnectiveScore = this.convertHelperConnective(fact.content)
          

      // Stop processing if we've reached the remove marker
      if (factID == "removemarker") break


      // Marker
      if (modifierRole == "fact") {
        var modifierFact = {
            name: modifier.content.trim(),
            originalText: modifier.originalText,
            id: modifier.id,
            className: modifier.id.toLowerCase().startsWith("write") ? "icon-c" : "fact",
          }
        treeOut.push( modifierFact )
      } else if (modifierRole == "marker") {

        //## 
        var clonedNode = JSON.parse(JSON.stringify( modifierMarkerScore.bestNode.props.node ))
        //console.log("MODIFIER: CLONED NODE: ")
        //console.log(clonedNode)
        clonedNode.originalText = clonedNode.name
        clonedNode.name = modifier.content.trim()
        treeOut.push( clonedNode )

        /*
        var modifierFact = {
          name: modifier.content,
          originalText: modifier.originalText,
          id: "unknown",
          className: "unknown",
        }
        treeOut.push( modifierFact )
        */

      } else if (modifierRole == "connective") {
        // Handle this below
      }
      
      if (!fact.content.startsWith("blank") || (fact.content.length > 10)) {      // Do not process if this is a blank spacer
        var connective = ["blank", ""]  // Default, blank connective
        if (modifierRole == "connective") {
          connective = modifierConnectiveScore.bestConnective        
        }
        // Convert to a tree-fact
        var treeFact = {
              name: fact.content.trim(),
              originalText: fact.originalText.trim(),
              id: fact.id,
              className: fact.id.toLowerCase().startsWith("write") ? "icon-c" : "fact",
              connectiveID: connective[0],
              connective: connective[1],
            }

        treeOut.push( treeFact )
      }
      
      
    }

    // Set    
    //this.treeData = treeOut
    //this.forceUpdate()

    if (numModifiersConverted == 0) {
      // If we did not convert any modifiers, it's likely that the data converted was the default data (so it's not meaningful).  Set this to an empty tree. 
      return []
    }

    console.log("treeOut:", treeOut, tasks)
    return treeOut;
  }

  // Find the best matching marker for a given conversion query
  convertHelperMarker(queryText) {
    //console.log("convertHelperMarker: query: " + queryText)
    var maxScore = 0
    var bestNode = {}    

    for (var i=0; i<this.discourseMarkersTree.length; i++) {
      var node = this.discourseMarkersTree[i]
      //console.log(node)
      var nodeName = node.props.node.name
      //console.log(nodeName)

      var score = this.convertHelperSimilarity(queryText, nodeName)
      if (score > maxScore) {
        bestNode = node
        maxScore = score
      }
    }


    // Return
    return {bestNode: bestNode, maxScore: maxScore}
  }

// Find the best matching marker for a given conversion query
convertHelperConnective(queryText) {
  //console.log("convertHelperConnective: query: " + queryText)
  var maxScore = 0
  var bestConnective = {}

  for (var i=0; i<this.connectives.length; i++) {
    var connective = this.connectives[i]
    //console.log(node)
    var connectiveID = connective[0]
    var connectiveText = connective[1]
    //console.log(nodeName)

    var score = this.convertHelperSimilarity(queryText, connectiveText)
    if (score > maxScore) {
      bestConnective = connective
      maxScore = score
    }
  }

  // Return
  return {bestConnective: bestConnective, maxScore: maxScore}
}


  convertHelperSimilarity(strIn1, strIn2) {
    var tokens1 = new Set( strIn1.toLowerCase().trim().split(" ") )
    var tokens2 = new Set( strIn2.toLowerCase().trim().split(" ") )

    var intersection = new Set([...tokens1].filter(x => tokens2.has(x)))
    var union = new Set([...tokens1, ...tokens2]);
    
    //console.log("Intersection: ", intersection)
    //console.log("union: ", union)

    var similarity = intersection.size / union.size
    return similarity
  }


  /*
   *  Adding reminder text for inference tree in same node
   */ 
  addExtraInferenceTreeText(node, addText=false) {
    var reminderText = this.collectInfReminderText(node)
    //console.log("Node: ")
    //console.log(node)
    //console.log("reminder text: ")
    //console.log(reminderText)

    var reminderTextFormatted = []        
    for (var i=0; i<reminderText.length; i++) {
      reminderTextFormatted.push(reminderText[i])
      reminderTextFormatted.push( <br/> )
    }        

    //##
    reminderTextFormatted = this.InfReminderTextToHtml(reminderText, true)    // includeInference = true (adds "we can infer that" to end of str)

    // <BRVerySmall />
    if (addText == true) {
      return (
        <div>  
            <p style={{"line-height": "8pt", "margin-bottom": "0pt"}}>
              <SpanDarkGray8pt>
                {reminderTextFormatted}
              </SpanDarkGray8pt>
            </p>
        </div>
      );
      /*
      return (
        <div>  
            <p style={{"line-height": "8pt", "margin-bottom": "0pt"}}>
              <SpanDarkGray8pt>Because this is test text <br />
              and this is also text text</SpanDarkGray8pt>
            </p>
        </div>
      );
      */
    } else {
      // Do not add text
      return;
    }
  }

  // Collect the rows of text from a node's children that should appear in an inference-tree's reminder text
  collectInfReminderText(startNode, includeInference=false) {
    var out = []

    if (startNode.hasOwnProperty('children')) {
      var children = startNode.children
      for (var i=0; i<children.length; i++) {
        var connectiveText = "[blank]"
        if (children[i].connectiveID == "disc-auto") {
          if (i == 0) {
            connectiveText = "Because"
          } else {
            connectiveText = "and"
          }
        } else {
          if (typeof(children[i].connective) != "undefined") {
            connectiveText = children[i].connective
          }
        }

        out.push([connectiveText, children[i].name])
      }    
      
      // Also include inference conclusion from current node (therefore... )
      if (includeInference) {
        var connectiveText = "[blank]"
        if (startNode.connectiveID == "disc-auto") {
          connectiveText = "We can infer that"
        } else {
          connectiveText = startNode.connective
        }

        out.push([connectiveText, startNode.name])
      }
    }

    return out;
  }

  // Collect the rows of text from a node's children that should appear in an inference-tree's reminder text
  // As above, but outputs full node objects (to retain ability to e.g. colour code/highlight in downstream functions)
  collectInfReminderTextNodesOut(startNode, includeInference=false) {
    var out = []

    if (startNode.hasOwnProperty('children')) {
      var children = startNode.children
      for (var i=0; i<children.length; i++) {
        var connectiveText = "[blank]"
        if (children[i].connectiveID == "disc-auto") {
          if (i == 0) {
            connectiveText = "Because"
          } else {
            connectiveText = "and"
          }
        } else {
          if (typeof(children[i].connective) != "undefined") {
            connectiveText = children[i].connective
          }
        }

        var clonedNode = JSON.parse(JSON.stringify(children[i]))
        clonedNode.connective = connectiveText
        out.push(clonedNode)
      }    
      
      // Also include inference conclusion from current node (therefore... )
      if (includeInference) {
        var connectiveText = "[blank]"
        if (startNode.connectiveID == "disc-auto") {
          connectiveText = "We can infer that"
        } else {
          connectiveText = startNode.connective
        }

        var clonedNode = JSON.parse(JSON.stringify(startNode))
        clonedNode.connective = connectiveText
        out.push(clonedNode)        
      }
    }

    return out;
  }

  InfReminderTextToHtml(reminderTextIn, includeInference=false) {
    var out = []
    for (var i=0; i<reminderTextIn.length; i++) {
      var connective = reminderTextIn[i][0]
      var fact = reminderTextIn[i][1]
      var infStr = ""
      if ((i == (reminderTextIn.length-1)) && (includeInference == true)) {
        infStr = (
          <SpanDarkGrayBlue8pt>, we can infer that</SpanDarkGrayBlue8pt>
        )
      }
      out.push( 
        <div>
          <SpanDarkGrayBlue8pt> {connective} </SpanDarkGrayBlue8pt> 
          <SpanDarkGray8pt> {fact} </SpanDarkGray8pt> 
          {infStr}
        </div>
        )

    }
    return out
  }

  // Collect the "In summary" explanation tree in readable order to generate a human-readable explanation
  collectInfTreeExplanation(startNode) {
    console.log(" * collectInfTreeExplanation(): started... ")
    console.log("startNode: " )
    console.log(startNode)

    var out = []

    // For each element
    for (var i=0; i<startNode.length; i++) {
      var node = startNode[i]      
      if ( node.connectiveID != "disc-auto") {     
        // Linear order
        var linearOut = []
        //linearOut.push(node)
        linearOut = linearOut.concat( this.collectChildrenInOrder( [node] ) )
        out.push( linearOut )

      } else if (typeof(node.children) != "undefined") {        
        if (node.children.length > 0) {
          // Tree order
          
          // Generate triples from children          
          console.log("Generate from children: " + node.children.length)
          for (var j=0; j<node.children.length; j++) {
            out = out.concat( this.collectInfTreeExplanation( [ node.children[j]] ))
          }

          console.log("Generating self: ")
          // Then, generate triples from this node
          //out = out.concat( [this.collectInfReminderText(node, true)] )          
          out = out.concat( [this.collectInfReminderTextNodesOut(node, true)] )          
        }                  
      } else {
        // If this node has no children/is terminal, then do not generate a triple from it

      }      

    }
    
    return out
  }

  // Collect "In summary" explanation text in linear order
  collectChildrenInOrder(startNode) {
    var out = []

    for (var i=0; i<startNode.length; i++) {      
      var node = startNode[i]      
      if (typeof(node) != "undefined") {
        out.push( node )
        if (typeof(node.children) != "undefined") {
          if (node.children.length > 0) {
            out = out.concat(this.collectChildrenInOrder( node.children ))
          }
        }
      }
    }
    return out;

  }

  // Calculate row height based on whether the node contains extra text or not (from being in the inference tree)
  calculateRowHeight(node) {
    var reminderText = this.collectInfReminderText(node)

    //## console.log("node", node);
    if ((node.connectiveID == 'disc-auto')) {
      // TODO: Dynamically calculate based on # of lines
      return 45 + (reminderText.length * 10) + 2;
    } else {
      return 35;
    }
  }  
  

  /*
   *  Tree cloning
   */ 
  cloneTreeFromExistingQuestion() {

    var cloneID = window.prompt("Clone tree from which question number? (0-" + (this.sampleData.length-1) + ")")
                              
    console.log("cloneID:", cloneID)    

    if (cloneID == null || cloneID == "") {
      // Cancelled
    } else {        
      var qIdx = parseInt(cloneID)
      if ((qIdx > 0) && (qIdx < this.sampleData.length)) {
        console.log("Cloning " + qIdx)

        // Step 1: Find tree to clone
        var data = this.sampleData[qIdx];    
        var curExample = data['examples'][0];
        var treeToClone = JSON.parse(JSON.stringify( curExample['tree'] ))            

        if (typeof(treeToClone) != "undefined") {
          // Step 2: Append the 'existing' tree to this cloned tree
          var removeMarker = {  className: "icon-e",
                                id: "marker-remove1",
                                name: "[Remove Marker]",
                                originalText: "[Remove Marker]",
                                expanded: true
                              }

          var newTree = treeToClone.concat([removeMarker]).concat( this.treeData )
          this.treeData = newTree

          this.markQuestionAsModifiedByAnnotator()

          this.forceUpdate()
        }


      } else {
        window.alert("Unknown question number: " + qIdx)
      }
    }

  }



  exportAllToJSON_all() {
    this.exportAllToJSON([], [])
  }

  exportAllToJSON_readyonly() {
    var mustInclude = ["thumbsup", "done"]
    var mustExclude = ["help", "hard", "minoredits"]
    this.exportAllToJSON(mustInclude, mustExclude)
  }


  // Export all to JSON  
  exportAllToJSON(flagsMustInclude, flagsMustExclude) {
    var FileSaver = require('file-saver');

    console.log("ExportAllToJSON(): Started... ")
    console.log("FlagsMustInclude: " + flagsMustInclude)
    console.log("FlagsMustExclude: " + flagsMustExclude)

    //var expl = this.exportOneExplanationToJSON(this.treeData)    
    var exportOut = []
    for (var qIdx=0; qIdx<this.sampleData.length; qIdx++) {    
      console.log(qIdx)
      // Step 1: Generate question and explanation export
      var questionExport = this.exportOneQuestionToJSON( qIdx )

      // Step 2: Filtering
      var qStatusStr = questionExport.statusStr
      var qFlags = qStatusStr.split(" ")
      var filterOut = false

      // Step 2A: Must include at least one of these flags
      if (flagsMustInclude.length > 0) {
        filterOut = true
        for (var i=0; i<flagsMustInclude.length; i++) {
          if (qFlags.includes(flagsMustInclude[i])) filterOut = false
        }
      }

      // Step 2B: Must not include any of these flags
      if (flagsMustExclude.length > 0) {        
        for (var i=0; i<flagsMustExclude.length; i++) {
          if (qFlags.includes(flagsMustExclude[i])) filterOut = true
        }
      }

      // Step 3: If this question passes the filtering criteria, include it
      if (filterOut == false) {
        exportOut.push(questionExport)
      }

    }

    // Convert to JSON string
    var outStr = JSON.stringify(exportOut, null, 4)

    // Export
    console.log("Exporting... (" + exportOut.length + " questions total meeting filtering criterion)")
    
    var filterStr = ""
    if ((flagsMustInclude.length > 0) || (flagsMustExclude).length > 0) {
      filterStr += "-FlagsMustInclude-" + flagsMustInclude.join("_")
      filterStr += "-FlagsMustExclude-" + flagsMustExclude.join("_")
    }

    var sizeStr = "-q" + exportOut.length

    var blob = new Blob([outStr], {type: "text/plain;charset=utf-8"});
    var filenameOut = "AZTreeExplanations-" + this.getTimestampStr() + filterStr + sizeStr + ".json"
    FileSaver.saveAs(blob, filenameOut);
    
  }

  exportOneQuestionToJSON(qIdx) {
    var data = this.sampleData[qIdx];
    var curExample = data['examples'][0]

    console.log("DATA:")
    console.log(data)
    var questionInfo = {
      qid: data.qid,
      statusStr: curExample.statusStr,
      topics: data.topics,
      questionText: data.questionText,
      answerText: data.answerText,      
      annotators: curExample.annotators,      
    }
    
    var tree = []
    if (curExample.hasOwnProperty('tree') == true) {
      tree = curExample['tree']
      questionInfo['explanations'] = this.exportOneExplanationToJSON(tree)      
    }
    
    return questionInfo;

    //console.log("questionInfo", questionInfo)
/*
    this.id = data.id     // One way, this should never change in the other direction
    this.qid = data.qid
    this.topics = data.topics
    this.questionText = data.questionText;
    this.answerText = data.answerText;

    var curExample = data['examples'][this.curExample];
    this.exampleName = curExample['name'];
    this.exampleGranularity = curExample['granularity'];    
    var curExampleTasks = curExample['tasks']
    var curExampleTaskOrdering = curExample['taskOrdering']

    var curModifierTaskOrdering = curExample['modifierOrdering']
    this.isDone = curExample['isDone'];
    this.statusStr = curExample['statusStr'];
    this.doneTimestamp = curExample['doneTimestamp'];   
    this.annotators = curExample['annotators'];

    //## RETRIEVE TREE
    if (curExample.hasOwnProperty('tree') == true) {
      this.treeData = curExample['tree'];    
      console.log("hasTree:")
      console.log(curExample['tree'])    
    } else {
      this.treeData = this.mkEmptyTree();
      console.log("emptyTree:")
      console.log(this.treeData)
    }   
    */

  }


  exportOneExplanationToJSON(fullTreeRaw) {
    // Step 1: Raw tree data    
    //console.log("fullTreeRaw", fullTreeRaw)

    //## TEST: Explanation tree
    var explFlat = this.mkExplanationStringTreeExportFlat(fullTreeRaw)
    //console.log("explFlat", explFlat)

    // Step N: Serialized
    var explSerial = []
    for (var i=0; i<explFlat.length; i++) {
      explSerial.push( explFlat[i].connectiveText )
      explSerial.push( explFlat[i].sanitizedText )
    }

    //console.log("explSerial", explSerial)

    // Step N: Big string
    var explStr = explSerial.join(" ").replace(/\s+/g, " ").trim()
    //console.log("explStr", explStr)    

    var out = {
      fullTreeRaw: fullTreeRaw,
      explFlat: explFlat,
      explSerial: explSerial,
      explStr: explStr
    }

    //console.log(out)

    return out;
  }
/*
    return this.treeData.map((item) => {
      console.log(item)

      var text = item[0];
      var highlight = item[1];
      var taskid = item[2];
      

      if (highlight == true) {
        //return <ParaTextHighlight> {text} </ParaTextHighlight>          
        //return {text}
        if (taskid.startsWith("block") || taskid.startsWith("marker")) {
          return (<DivInline> <BRSmall /> <SpanHighlight> {sanitizedText} </SpanHighlight> </DivInline>)
        } else {
          return (<SpanHighlight> {sanitizedText} </SpanHighlight> )
        }
      } else {                    
        //return <SpanNormal> {text} </SpanNormal>          
        var bgcolor="white";
        if (taskid.startsWith("disc"))  bgcolor = "#f0ebfa";
        if (taskid.includes("marker"))  bgcolor = "lightblue";
        if (taskid.startsWith("block")) bgcolor = "#E5E4E2";
        if (taskid.startsWith("write")) bgcolor = "#ffdb99";

        if (taskid.startsWith("block") || taskid.startsWith("marker")) {
          return (<DivInline> <BRSmall /> <SpanCustom backgroundcolor={bgcolor}> {sanitizedText} </SpanCustom> </DivInline> )
        } else {
          return (<SpanCustom backgroundcolor={bgcolor}> {sanitizedText} </SpanCustom>)
        }
        //return {text}
        //outText += text
      }

    })
   }
   */


  /*
   *  Rendering
   */
  render(state) {
    console.log("####### RENDER")
    //## console.log(this);

    // First initialization
    if (this.initialized == false) {
      this.initializeFirst();
    }

    //this.lastRender = this.getTimeMilliseconds();
    //this.useEffect();

    this.orderedText = "default"
    if (state === undefined) {
      this.orderedText = this.getOrderedText()
    } else {
      this.orderedText = this.getOrderedTextHelper(state)
    }

    //## console.log("!!!!!: " + this.orderedText);
    
    //out += <ParaTextHighlight> Highlight </ParaTextHighlight>
    //out += <ParaText> Two </ParaText>

    //{this.orderedText} {(Math.random())} 

    //## console.log(this.orderedText)

    //var questionText = "A student placed an ice cube on a plate in the sun. Ten minutes later, only water was on the plate. Which process caused the ice cube to change to water?"
    //var answerText = "melting"

    var discourseOptions = this.mkDiscourseOptionsList();
    if (this.curDiscourseList === undefined) {
      // If the current selection is undefined (e.g. on start-up), then select the first element (which is what Column should default to)
      this.curDiscourseList = discourseOptions[0]
    }

    var topicsStr = ""
    if (this.topics !== undefined) topicsStr = this.topics.join("  ")

    var isDoneStr = ""
    if (this.isDone == true) {
      isDoneStr = "done"
    }


    //<button onClick={this.resaveAll.bind(this)}> SALL </button> 

    //## react-sortable-tree
    const getNodeKey = ({ treeIndex }) => treeIndex;
    console.log("treeData:")
    console.log(this.treeData)
        
    console.log("this.connectives:")
    console.log(this.connectives)
    console.log("this.discourseMarkersTree")
    console.log(this.discourseMarkersTree)

    // Auto populate flags based on tree content
    this.autoPopulateMinorEditsFlag(this.treeData)


    return (    
      <div>
     <style>
        {`.button:hover {            
            background: green;
            color: blue;
        }
        `}
      </style>        
        <TopNav> 
          <div>
            <div style={{width:"40%",display:"inline"}}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button onClick={this.movePrevQuestion100}> <i class="fas fa-angle-left"></i><i class="fas fa-angle-double-left"></i> </button> &nbsp;
              <button onClick={this.movePrevQuestion25}> <i class="fas fa-angle-double-left"></i> </button> &nbsp;
              <button onClick={this.movePrevQuestion}> <i class="fas fa-angle-left"></i> </button> &nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Question  &nbsp;&nbsp; {this.curQuestion} / {this.sampleData.length}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button onClick={this.moveNextQuestion}> <i class="fas fa-angle-right"></i> </button> &nbsp;             
              <button onClick={this.moveNextQuestion25}> <i class="fas fa-angle-double-right"></i> </button> &nbsp; 
              <button onClick={this.moveNextQuestion100}> <i class="fas fa-angle-double-right"></i><i class="fas fa-angle-right"></i> </button> &nbsp;                      

              &nbsp;&nbsp;
              <SpanGray>
              {this.countQuestionsWithFlag("thumbsup")} <i class="far fa-thumbs-up"></i> &nbsp;&nbsp;&nbsp;&nbsp;
              {this.countQuestionsWithFlag("done")} <i class="fas fa-user-check"></i> &nbsp;&nbsp;&nbsp;&nbsp;              
              {this.countQuestionsWithFlag("minoredits")} <i class="far fa-edit"></i> &nbsp;&nbsp;&nbsp;&nbsp;
              {this.countQuestionsWithFlag("help")} <i class="far fa-question-circle"></i> &nbsp;&nbsp;&nbsp;&nbsp;
              {this.countQuestionsWithFlag("hard")} <i class="fas fa-exclamation-triangle"></i> &nbsp;&nbsp;&nbsp;&nbsp;
              {this.countQuestionsWithSomeAnnotationTree()} <i class="fas fa-file"></i> &nbsp;&nbsp;&nbsp;&nbsp;
              {(100*this.countQuestionsWithFlag("done")/this.sampleData.length).toFixed(2)}%              
              </SpanGray>
            </div>


            <div style={{width:"20%",display:"inline"}}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              
              <button onClick={() => {this.toggleStatusStrFlag("thumbsup")}} style={{"background-color":this.checkForStatusFlag("thumbsup") == true ? '#b2df8a' : ''}}> <i class="far fa-thumbs-up"></i> </button>                             
              <button onClick={() => {this.toggleStatusStrFlag("done")}} style={{"background-color":this.checkForStatusFlag("done") == true ? '#33a02c' : ''}}> <i class="fas fa-user-check"></i> </button>              
              <button onClick={() => {}} style={{"background-color":this.checkForStatusFlagTree(this.treeData, "minoredits") == true ? '#ffBf0e' : ''}}> <i class="far fa-edit"></i> </button>
              <button onClick={() => {this.toggleStatusStrFlag("help")}} style={{"background-color":this.checkForStatusFlag("help") == true ? '#ff7f0e' : ''}}> <i class="far fa-question-circle"></i> </button>                             
              <button onClick={() => {this.toggleStatusStrFlag("hard")}} style={{"background-color":this.checkForStatusFlag("hard") == true ? '#d62728' : ''}}> <i class="fas fa-exclamation-triangle"></i> </button>                             
              <button onClick={() => {this.toggleStatusStrFlag("tree-legacy")}} style={{"background-color":this.checkForStatusFlag("tree-legacy") == true ? '#9467bd' : ''}}> <i class="fas fa-tree"></i> </button>                                         

              &nbsp;
              <SpanGreen> {isDoneStr} </SpanGreen>
              &nbsp;&nbsp;&nbsp;&nbsp; <SpanGray> {this.doneTimestamp} </SpanGray>
            </div>

            <div style={{width:"25%",display:"inline", float:"right"}}>
              <button onClick={() => {this.cloneTreeFromExistingQuestion()}}> <i class="fas fa-clone"></i> </button>  
              <button onClick={() => {this.addPhantomNodeToRefreshHeight()}}> <i class="fas fa-wrench"></i> </button>  
                           
              &nbsp;&nbsp;
              <button onClick={this.saveJsonServerDataCurrentQuestion.bind(this)}> <i class="far fa-save"></i> </button>               
              &nbsp;&nbsp;
              <button onClick={this.loadJsonServerDataAll.bind(this)}> <i class="fas fa-sync-alt"></i> </button> 
              &nbsp;&nbsp;
              <button onClick={this.generateStatistics.bind(this)}> <i class="fas fa-chart-line"></i> </button>
              &nbsp;&nbsp;
              <button onClick={this.exportAllToJSON_all.bind(this)}> <i class="fas fa-file-download">A </i> </button>
              <button onClick={this.exportAllToJSON_readyonly.bind(this)}> <i class="fas fa-file-download">F </i> </button>
              
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input size="4" type="text" name="annotator-name" placeholder="Initials" value={this.annotatorName} onChange={this.annotatorInitialUpdate}></input>
              &nbsp;&nbsp; <SpanGray> {this.annotators} </SpanGray>
            </div>


          </div>
        </TopNav>
      <TextBox>          
          <table>
            <tr>
              <td style={{width:"60px"}}> QID: </td>
              <td> {this.qid} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {topicsStr} </td>
            </tr>
            <tr>
              <td style={{width:"60px"}}> Question: </td>
              <td> {this.questionText} </td>
            </tr>
            <tr>
              <td style={{width:"60px" }}> Answer: </td>
              <td> {this.answerText} </td>
            </tr>            
            <tr>
              <td style={{width:"60px"}}> Explanation: </td>
              <td>                 
                { this.mkExplanationStringTree()}
              </td>
            </tr>

          </table>
      </TextBox>

        <div>
          <DndProvider backend={HTML5Backend}>
            <div>
              <div style={{ height: 750, width: '74%', float:'left', border:"1px solid lightgrey", "border-radius":"2px" }}>                
                <SortableTree
                  treeData={this.treeData}
                  dndType={externalNodeType}                  
                  //rowHeight={55}
                  rowHeight = {({treeIndex, node, path}) => (this.calculateRowHeight(node))}
                  onChange={treeData => {                                    
                      this.treeData = treeData
                      //this.isModified = true;
                      this.markQuestionAsModifiedByAnnotator()
                      this.giveNodesUniqueNumbers(this.treeData);                      
                      this.removeOldFreshlyClonedFlags(this.treeData);
                      this.forceUpdate();
                      console.log("TREE-UPDATE!");
                    }
                  }
                  generateNodeProps={({ node, path }) => ({
                    //style: { 'backgroundColor': 'blue'},                    
                    className: node.className,                                         
                    title: (
                      <div>
                        {(node.connectiveID == 'disc-auto') ? this.addExtraInferenceTreeText(node, true) : ''}                        
                      <div>
                        <div style={{display:"inline", float: "left"}}>                          
                          <RowListBox uniqueName={node.uniqueName} selectedConnective={node.connective} connectives={this.connectives} connectivesLUT={this.connectivesLUT} connectivesReverseLUT={this.connectivesReverseLUT} selectCallback={this.updateSelectBoxSelection.bind(this)}> </RowListBox>
                        </div>
                        <div style={{display:"inline", float: "left"}}>
                          &nbsp;&nbsp;  
                          <TextCell> {this.separateTextSquareBrackets(node.name).mainStr} </TextCell> 
                          <TextCellGrey> {this.separateTextSquareBrackets(node.name).greyedStr} </TextCellGrey> 
                          {this.addModifiedMarker(node)}
                          &nbsp;&nbsp;  
                        </div>
                        <div style={{display:"inline", float:"right"}}>
                          <button class="ButtonRound"                            
                            onClick={() => {
                              var originalText = ""
                              if (node.hasOwnProperty('originalText')) originalText = node.originalText
                              var currentText = node.name
                              var editedText = window.prompt(originalText, currentText)
                              
                              console.log("editedText:")
                              console.log(editedText)

                              if (editedText == null || editedText == "") {
                                // Cancelled
                              } else {             
                                const name = editedText
                                this.treeData = changeNodeAtPath({
                                  treeData: this.treeData,
                                  path,
                                  getNodeKey,
                                  newNode: { ...node, name },
                                })
                                console.log("this.treeData:")
                                console.log(this.treeData)
                                //this.isModified = true;
                                this.markQuestionAsModifiedByAnnotator()
                                this.forceUpdate();
      
                              }
                            }}
                          >
                          <i class="fas fa-pen"></i>
                          </button>                                    

                          &nbsp;&nbsp;

                          <button class="ButtonRound" onClick={() => { 
                              this.setHighlightedNode(this.treeData, node.uniqueName);
                              this.forceUpdate(); 
                            }}>
                            <i class="far fa-eye"></i>
                          </button>                                    

                          &nbsp;&nbsp;

                          <button class="ButtonRound" onClick={() => { 
                              console.log("CLONE NODE")
                              var clonedNode = JSON.parse(JSON.stringify(node))
                              delete clonedNode.children    // Remove any children from the cloned node, so we only clone the node itself
                              clonedNode.uniqueName = clonedNode.uniqueName + "-1"
                              clonedNode.freshlyCloned = true

                              // Add Node
                              this.addNewNodeAtBottom( clonedNode )                            
                              //this.isModified = true;
                              this.markQuestionAsModifiedByAnnotator()

                              this.forceUpdate(); 
                            }}>
                            <i class="fas fa-clone"></i>
                          </button>


                          &nbsp;&nbsp;

                          <button class="ButtonRound" onClick={() => { 
                              //this.setHighlightedNode(this.treeData, node.uniqueName);
                              console.log("NOTE: Marking as needs edits")
                              this.toggleStatusStrFlagNode(this.treeData, node.uniqueName, "minoredits")
                              console.log("statuscheck - node", node)

                              this.forceUpdate(); 
                            }} style={{"background-color":this.checkForStatusFlagNode(node, "minoredits") == true ? '#ffBf0e' : ''}}>
                            <i class="far fa-edit"></i>
                          </button>    

                          &nbsp;&nbsp;                          

                          <button class="ButtonRound"
                            onClick={() => {
                              console.log("node:")
                              console.log(node)
                              var assembledStr = ""


                              if (window.confirm(this.getNodeRemovalConfirmationStr(node) )) {        
                                
                                // Remove example
                                this.treeData = removeNodeAtPath({
                                  treeData: this.treeData,
                                  path,
                                  getNodeKey,
                                  });
                                //this.isModified = true;
                                this.markQuestionAsModifiedByAnnotator()
                                this.forceUpdate();
                                console.log("REMOVED NODE")
                              }
                            }}
                          >
                          <i class="fas fa-minus-square"></i>
                          </button>    

                          {this.addNodeScoreText(node)}
                          {this.addClonedText(node)}

                        </div>  
                      </div>
                      </div>
                    ),                    
                  })}
                />
              </div>
              <div style={{ height: 750, width: '5px', float:'left'}}>
              </div>
              <div style={{ height: 750, width: '24%', float:'left', "overflow-y":"auto", border:"1px solid lightgrey", "border-radius":"2px" }}>
                <Title>Facts</Title>        
                <div style={{margin: "2px", padding: "2px", border:"1px solid lightgrey", "border-radius":"2px", display:"inline"}}>
                  &nbsp;Filter: <button onClick={this.buttonFactFilterAll}> All </button>  <button onClick={this.buttonFactFilterMarkers}> Markers </button>  <button onClick={this.buttonFactFilterFacts}> Facts </button>
                </div> 
                <div style={{margin: "10px", padding: "2px", border:"1px solid lightgrey", "border-radius":"2px", display:"inline"}}>
                  &nbsp;Add: <button onClick={this.onAddDiscElemTree}>+M</button> <button onClick={this.onAddConnectiveElemTree}>+C</button>
                </div> 
                
                <FactList factOptions={this.state.tasks} factFilter={this.factFilter} markerList={this.discourseMarkersTree}></FactList>
                
              </div>
            </div>
          </DndProvider>
        </div>
    

    
      </div>      
    );
  }
}


class App1 extends React.Component {
  counter = 1;

  render() {
    this.counter += 1;
    

    return (      
        <div>
        <TextBox />
        <App />      
        </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'));

/*
// Conversion buttons
              <button onClick={() => {this.convertFromColumnToTreeFormatAll()}}> <i class="fas fa-dice-d6"></i> </button>               
              <button onClick={() => {this.resaveConvertedData()}}> <i class="far fa-save"></i> all </button>   
              <button onClick={() => {this.convertFromColumnToTreeFormatSpecificQuestion(this.curQuestion)}}> <i class="fas fa-exchange-alt"></i> </button>               
*/

/*
  // Column-based explanation
            <tr>
              <td style={{width:"60px"}}> Explanation: </td>
              <td> 
                { this.mkExplanationStringColumns() }                
              </td>
            </tr>


  // This is the bulk of the main column-based interface
      <div>
        <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate}>             
          <Container>
            {this.state.ColumnOrder.map((columnId, index) => {
              const column = this.state.columns[columnId];
              const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

              // Only allow dropping to columns that are left
              //const isDropDisabled = index > this.state.homeIndex;
              var isDropDisabled = false;
              //if ((this.state.homeIndex == 2) && (index < 2)) isDropDisabled = false; // From DISC to either FACTS or MOD
              //if ((this.state.homeIndex == 0) && (index == 1)) isDropDisabled = false;  // From MOD to FACTS
              //if (this.state.homeIndex == index) isDropDisabled = false;
              if ((this.state.homeIndex < 2) && (index == 2)) isDropDisabled = true;


              return <Column key={column.id} column={column} tasks={tasks} isDropDisabled={isDropDisabled} rerender={this} 
                      exampleOptions={this.exampleOptions} exampleSelected={this.exampleOptions[this.curExample]} onExampleChange={this.onExampleChange.bind(this)}
                      onAdd={this.onPressAdd.bind(this)} 
                      onRemove={this.onPressRemove.bind(this)}
                      onGranularityLow={this.onPressGranularityLow.bind(this)}
                      onGranularityMed={this.onPressGranularityMed.bind(this)}
                      onGranularityHigh={this.onPressGranularityHigh.bind(this)}
                      onAddDiscElem={this.onAddDiscElem.bind(this)}
                      onAddDiscList={this.onAddDiscList.bind(this)}
                      onRemoveDiscElem={this.onRemoveDiscElem.bind(this)}
                      discourseOptions={discourseOptions}
                      discourseSelectionCallback={this.getCurrentDiscourseSelectionCallback.bind(this)}
                      discourseMarkers={this.discourseMarkers}
                      />;
            })}
          </Container>
        </DragDropContext>   
      </div>   

*/

/*
                      <input                  
                        style={{ fontSize: '0.75rem', 'minWidth': '800px', 'fontFamily': ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'] }}
                        value={node.name}
                        onChange={event => {
                          const name = event.target.value;

                          this.treeData = changeNodeAtPath({
                            treeData: this.treeData,
                            path,
                            getNodeKey,
                            newNode: { ...node, name },
                          })
                          console.log("this.treeData:")
                          console.log(this.treeData)
                          this.isModified = true;
                          this.forceUpdate();
                          console.log("TREE-UPDATE-NODE!");

                        }}
                      />                      

*/


/*
                <YourExternalNodeComponent node={{ className:"icon-a", name: 'Baby Rabbit' }} />
                <YourExternalNodeComponent node={{ className:"icon-b", name: 'heat has a ( great / big ) impact on weather' }} />
                <YourExternalNodeComponent node={{ name: 'the tilt of Earths axis causes certain latitudes of Earth to be heated at a greater rate' }} />
                <YourExternalNodeComponent node={{ name: 'the Earth rotates on its tilted axis' }} />
                <YourExternalNodeComponent node={{ name: 'latitude is a property of a ( location / place ) on Earth' }} />
                <YourExternalNodeComponent node={{ name: 'greater means ( higher / more ) in value' }} />
*/

/*
// One that I modified to work, pre-external-dnd


        <div style={{ height: 1500 }}>
          <SortableTree
            treeData={this.treeData}
            onChange={treeData => {
              this.treeData = treeData
              this.forceUpdate();}
            }
            generateNodeProps={({ node, path }) => ({
              title: (
                <div>
                  <RowListBox> </RowListBox>
                <input                  
                  style={{ fontSize: '0.75rem', 'minWidth': '800px', 'fontFamily': ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'] }}
                  value={node.name}
                  onChange={event => {
                    const name = event.target.value;

                    this.treeData = changeNodeAtPath({
                      treeData: this.treeData,
                      path,
                      getNodeKey,
                      newNode: { ...node, name },
                    })
                    console.log("this.treeData:")
                    console.log(this.treeData)

                    this.forceUpdate();

                  }}
                />
                <button> test </button>                
                </div>
              ) ,
            })}
          />
        </div>
*/


/*
// Original
        <div style={{ height: 1500 }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            generateNodeProps={({ node, path }) => ({
              title: (
                <input                  
                  style={{ fontSize: '1.0rem', 'minWidth': '800px' }}
                  value={node.name}
                  onChange={event => {
                    const name = event.target.value;

                    this.setState(state => ({
                      treeData: changeNodeAtPath({
                        treeData: state.treeData,
                        path,
                        getNodeKey,
                        newNode: { ...node, name },
                      }),
                    }));
                  }}
                />
              ),
            })}
          />
        </div>
*/
