import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

/*
const Container = styled.div`
  display: flex;
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;  
  background-color: ${props => (props.isDragging ? 'lightgreen' : (props.isRemoved ? '#f0ebfa' : 'white'))};
`;
*/
//background-color: ${props => console.log(props)};

/*
const TableRow = styled.tr`
  display: flex;
  border: 1px solid lightgrey;
  padding: 4px;
  margin-bottom: 8px;
  border-radius: 2px;  
  background-color: ${props => (props.isDragging ? 'lightgreen' : (props.isRemoved ? '#f0ebfa' : 'white'))};
`;
*/
const TableRow = styled.tr`
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
  display: flex;
  width: ${props => (props.width)};  
  align-items:center;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 26px;      
  font-size: 12px;
  user-select: none;
`;

  //color: ${props => (console.log("#################################!!!" + props))}
  //color: ${props => (console.log(props))}

const SmallButton = styled.button`    
`;

const Handle = styled.div`
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 4px;
  margin-right: 8px;
`;

const SpanGray = styled.div`
  color: silver;
`;


export default class Task extends React.Component {
  isHoveredOver = false;
  //this.props.isHoveredOver = false;

  onMouseEnter() {
    console.log("Mouse Over " + this.props.task.content)
    this.isHoveredOver = true;
    this.props.task.isHoveredOver = true;

    //this.forceUpdate();    
    console.log("this.props:")
    console.log(this.props)

    //this.props.rerender();
    this.props.rerender.forceUpdate();
    //this.forceUpdate();
  }

  onMouseLeave() {
    console.log("Mouse Over " + this.props.task.content)
    this.isHoveredOver = false;
    this.props.task.isHoveredOver = false;

    this.forceUpdate();
  }

  buttonClick(name) {
    // NOTE: Not working, fires every time the Draggable is moved, and not when the button is pressed
    //console.log("Click!" + name)
  }


  onDoubleClick() {
    console.log("On Double Click")
    console.log(this.props.task.content)
    //this.isHoveredOver = true;
    //this.props.task.isHoveredOver = true;
    
    console.log("this.props:")
    console.log(this.props)
    
    //this.props.rerender.forceUpdate();

    this.props.rerender.onCustomizeText(this.props.task);
    
  }

  TextContentConditional(props) {
    var isModifiedText = false
    if (props.task.content != props.task.originalText) {
      isModifiedText = true
      console.log("IS MODIFIED: " + props.task.content)
    }

    var contentStr = props.task.content
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


    if (!isModifiedText) {
      return (
        <TableCell width="90%"> {contentMainStr} &nbsp; <SpanGray> {contentGreyedStr} </SpanGray> </TableCell>
      )
/*
      return (
        <TableCell width="90%"> {props.task.content} </TableCell>
      )
*/
    } else {
      return (
        <TableCell width="90%"> {contentMainStr} &nbsp; <SpanGray> {contentGreyedStr} </SpanGray> &nbsp; <font color="lightgrey">&#9899;</font> </TableCell>
      )
/*
      return (
        <TableCell width="90%"> {props.task.content} &nbsp; <font color="lightgrey">&#9899;</font> </TableCell>
      )
*/      
    }
    

  }

  render() {
    //  console.log("this.props.task:")
    //  console.log(this.props.task)

    /*
    if (this.props.task.isRemoved) {
      console.log("###")
    }
    */

   //console.log("this.props1:")
   //console.log(this.props)
   
    if (this.props.task.color === undefined) {
      //this.props.task.bgcolor = "#FFFFFF";
      if (this.props.task.id.startsWith("disc")) {
        this.props.task.bgcolor = '#f0ebfa';
      } else if (this.props.task.id == 'removemarker') {
        this.props.task.bgcolor = '#FFCCCC';      
      } else if (this.props.task.id.includes("marker")) {
        this.props.task.bgcolor = 'lightblue';
      } else if (this.props.task.id.startsWith("block")) {
        this.props.task.bgcolor = '#E5E4E2';      
      } else if (this.props.task.id.startsWith("write")) {
        this.props.task.bgcolor = '#ffdb99';            
      } else {
        this.props.task.bgcolor = '#ffffff';
      }
      
    }    

    //## console.log("test");
    //## console.log(this)

    var scoreText = ""
    if (this.props.task.score !== undefined) scoreText = this.props.task.score.toFixed(2)

    var isModifiedText = false
    if (this.props.task.content != this.props.task.originalText) {
      isModifiedText = true
      //## console.log("IS MODIFIED: " + this.props.task.content)
    }
    
    var textContent = this.props.task.content
    if (isModifiedText) {
      textContent = textContent + " *"
    }


   return (
    <Draggable draggableId={this.props.task.id} index={this.props.index}>
      {(provided, snapshot) => (

        <TableRow
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          isDragging={snapshot.isDragging}
          isRemoved={this.props.task.isRemoved}
          onMouseOver={() => this.onMouseEnter()}
          onMouseLeave={() => this.onMouseLeave()}
          bgcolor={this.props.task.bgcolor}
          taskId={this.props.task.id}
          onDblClick={() => this.onDoubleClick()}
          onClick={() => this.onDoubleClick()}
        > 

          <TableCell width="3%"> {this.props.task.relevance} </TableCell>
          <TableCell width="8%"> {scoreText} </TableCell>                            
          <this.TextContentConditional task={this.props.task} />
                    
        </TableRow>
      )}
    </Draggable>
  );
  
  // <TableCell width="90%"> {this.props.task.content} </TableCell>
          // <TableCell width="5%"> <SmallButton onclick={this.buttonClick(this.props.task.id)}>X</SmallButton> </TableCell>

/*
          <td style={{width:"5%",verticalalign:"middle"}}> {this.props.task.relevance} </td>                             
          <td style={{width:"5%"}}> {this.props.task.score} </td>                             
          <td style={{width:"85%"}}> {this.props.task.content} </td>
          <td style={{width:"5%"}}> <SmallButton onclick={this.buttonClick(this.props.task.id)}>X</SmallButton> </td>
*/
/*
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            innerRef={provided.innerRef}
            isDragging={snapshot.isDragging}
            isRemoved={this.props.task.isRemoved}
            onMouseOver={() => this.onMouseEnter()}
            onMouseLeave={() => this.onMouseLeave()}
          >                              
            {this.props.task.content}
            {this.props.task.relevance}
            {this.props.task.score}
          </Container>
        )}
      </Draggable>
    );
*/    
  }
}

// <Handle  />