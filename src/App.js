import React, { Component } from 'react';
import styled from 'styled-components'
import socketIoClient from 'socket.io-client'

import SystemMessage from './components/SystemMessage'
import MainTitle from './components/MainTitle'
import Player from './components/Player'

const MainContainer = styled.div`
  text-align: center;
`

class App extends Component {
  constructor(){
      super();
      this.state = {
          attention: null,
          signal: null
      }
  }

  componentWillMount() {
    this.socket = socketIoClient("http://localhost:9090");
    this.socket.on("mindEvent", (data) => {
        this.setState({
            attention: data.eSense.attention
        });
        this.setState({
            signal: data.poorSignalLevel
        })
    });
  }

  render() {
    return (
      <MainContainer>
        <SystemMessage signal={this.state.signal} />
        <MainTitle />
        <Player attention={this.state.attention} />
      </MainContainer>
    );
  }
}

export default App;
