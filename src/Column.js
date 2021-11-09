import React from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Select from 'react-select';
import Task from './Task'
//import discourseMarkers from './discourseMarkers'


const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
  width: 50%;
  height: 5000px;       // Large enough for a list of ~30-50 "tasks"

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transition background-color .2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
`;

const Table = styled.div`
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
  
  flex-grow; 1;
  min-height: 100px;
`;

/*
const discourseOptions = [
  { value: 'general', label: 'General' },
  { value: 'list1', label: 'List 1' },
  { value: 'list2', label: 'List 2' }
]
*/

/*
const exampleOptions = [
  { value: 'example1', label: 'Example 1' },
  { value: 'example2', label: 'Example 2' },
  { value: 'example3', label: 'Example 3' }
]
*/

export default class Column extends React.Component {
  // Constructor  
  constructor() {    
    super()    

  }

  // Handle change of discourse selector dropdown
  handleChange = (event) => {    
    console.log("CHANGE")
    console.log(event)
    //this.setState({selectedTodo: event})
    console.log("this:")
    console.log(this)
    var listName = event.value;
    console.log("#######" + listName)
    this.currentSelection = this.discourseOptions.filter(obj => {return obj.value == listName})[0];
    console.log("(handleChange) this.currentSelection: ")
    console.log(this.currentSelection)

    // Let index.js know what element is currently selected
    this.discourseSelectionCallback123(this.currentSelection)

    this.forceUpdate();
  };

  

  // TODO: Remove this block
  // ----------------------------------------------
  onPressGranularityHigh = result => {
    console.log("onPressGranularityHigh()")
  }

  onPressGranularityMed = result => {
    console.log("onPressGranularityMed()")
  }

  onPressGranularityLow = result => {
    console.log("onPressGranularityLow()")
  }

  onPressAdd = result => {
    console.log("onPressAdd()")
  }

  onPressRemove = result => {
    console.log("onPressRemove()")

    console.log(result)
    console.log(this)
  }
  // ----------------------------------------------



  DropDownConditional(props) {
    if (props.column.id == "column-2") {      
      // Discourse column
      props.this.discourseSelectionCallback123 = props.discourseSelectionCallback

      return (
            <div>
              <div style={{width:"60%",display:"inline-block"}}>
                <Select options={props.this.discourseOptions} onChange={props.this.handleChange} value={props.this.currentSelection} />
              </div>
              <div style={{width:"40%",display:"inline-block"}}>
                &nbsp;&nbsp;
                &nbsp;<button onClick={props.onAddDiscElem}>+ Elem</button>                
                &nbsp;<button onClick={props.onAddDiscList}>+ List</button>                
                &nbsp;&nbsp;
                &nbsp;<button onClick={props.onRemoveDiscElem}>-E</button>                                
              </div>
            </div>          
            )      

    } else if (props.column.id == "column-1") {
      // Explanation facts column
    return (<div>
            <div style={{width:"60%",display:"inline-block"}}>
              <Select options={props.exampleOptions} value={props.exampleSelected} onChange={props.onExampleChange}/>
            </div>
            <div style={{width:"40\%",display:"inline-block"}}>
              &nbsp;&nbsp;
              &nbsp;<button onClick={props.onGranularityLow}>L</button>
              &nbsp;<button onClick={props.onGranularityMed}>M</button>
              &nbsp;<button onClick={props.onGranularityHigh}>H</button>

              &nbsp;&nbsp;&nbsp;<button onClick={props.onAdd}>+</button>
              &nbsp;&nbsp;&nbsp;<button onClick={props.onRemove}>-</button>
            </div>
            </div>
            )

    } else if (props.column.id == "column-3") {
      // Modifier column
      return <Select />          

    } else {
      return null;
    }

    // &nbsp;&nbsp;&nbsp;<button onClick={props.this.onPressAdd}>+</button>
  }
  
  PopulationConditional(props) {
    if (props.column.id == "column-2") {
      // Discourse column
      var listName = props.this.currentSelection['value']; //'list1'
      //var listName = 'list1'
      //## console.log("listName1: " + props.this.currentSelection)
      var listElems = props.discourseMarkers[listName]
      //## console.log("listElems: ")
      //## console.log(listElems)

      var newTaskIds = []
      var newTasks = []
      //## console.log("listName: " + listName)      
      for (const key in props.discourseMarkers[listName]) {
        var taskObj = props.discourseMarkers[listName][key]
        newTasks.push(taskObj);
        newTaskIds.push(taskObj.id);
        //console.log(key)
      }
  
      //return props.this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)
      return newTasks.map((task, index) => <Task key={task.id} task={task} index={index} rerender={props.this.props.rerender}/>)

    } else if (props.column.id == "column-1") {      
      // Main column
      return props.this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} rerender={props.this.props.rerender}/>)

    } else if (props.column.id == "column-3") {
      // Modifier column
      return props.this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} rerender={props.this.props.rerender}/>)

    } else {
      // Else
      return props.this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} rerender={props.this.props.rerender}/>)
    }

  }

  TableHeadConditional(props) {
    if (props.column.id == "column-1") {
      // Main column
      return(
        <tr>
          <th style={{width:"5%"}}> Relevance </th>
          <th style={{width:"5%"}}> Score </th>
          <th style={{width:"90%"}}> Fact </th>
        </tr>
      )

    } else if (props.column.id == "column-2") {
      // Discourse column
      return (
        <tr>
          <th style={{width:"5%"}}>  </th>
          <th style={{width:"5%"}}>  </th>
          <th style={{width:"90%"}}> Connective Phrase </th>
        </tr>
      )

    } else if (props.column.id == "column-3") {
      // Modifier column
      return (
        <tr>
          <th style={{width:"5%"}}>  </th>
          <th style={{width:"5%"}}>  </th>
          <th style={{width:"90%"}}> Modifier </th>
        </tr>
      )

    } else {
      return null;
    }

  }


  render() {
    // Retrieve discourse options passed in from index.js
    this.discourseOptions = this.props.discourseOptions;

    if (this.currentSelection === undefined) {
      this.currentSelection = this.discourseOptions[0];//['value'];
    }

    //console.log("this.props2:")
    //console.log(this.props)
 

    //## console.log("(render) this.currentSelection: ");
    //## console.log(this.currentSelection)
    
// <Select options={options} onChange={this.handleChange} />      
    return (
      <Container>
        <Title>{this.props.column.title}</Title>        
        
        <this.DropDownConditional column={this.props.column} this={this} 
              onAdd={this.props.onAdd}
              onRemove={this.props.onRemove}
              onGranularityLow={this.props.onGranularityLow}
              onGranularityMed={this.props.onGranularityMed}
              onGranularityHigh={this.props.onGranularityHigh}
              exampleOptions={this.props.exampleOptions} exampleSelected={this.props.exampleSelected} onExampleChange={this.props.onExampleChange}
              onAddDiscElem={this.props.onAddDiscElem}
              onAddDiscList={this.props.onAddDiscList}
              onRemoveDiscElem={this.props.onRemoveDiscElem}
              discourseSelectionCallback={this.props.discourseSelectionCallback}              
              />
        <Droppable droppableId={this.props.column.id} isDropDisabled={this.props.isDropDisabled}>
          {(provided, snapshot) => (
            <Table
              innerRef={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              <thead>
              <this.TableHeadConditional column={this.props.column} this={this}/>
              </thead>              
              <this.PopulationConditional column={this.props.column} this={this} discourseMarkers={this.props.discourseMarkers}/>
              {provided.placeholder}              
            </Table>
          )}
        </Droppable>
      </Container>
    )

    //{this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}

    /*
    return (
      <Container>
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <TaskList
              innerRef={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    )
    */
  }
}