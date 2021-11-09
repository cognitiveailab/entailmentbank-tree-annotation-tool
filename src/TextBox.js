import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;  
  //background-color: ${props => console.log(props)};
  background-color: ${props => (props.isDragging ? 'lightgreen' : (props.isRemoved ? '#f0ebfa' : 'white'))};
`;

export default class TextBox extends React.Component {
    text = "Hello World";

    render() {

        return (
              <Container>                              
                {this.text}
              </Container>
            )        
      }    
}