import React, { Component } from 'react'
import socketIoClient from 'socket.io-client'
// import firebase from 'firebase'
import styled from 'styled-components'
import PropTypes from 'prop-types'


import FlipCard from 'react-flipcard'
import data from '../data/songs.json'

import SongInfo from './SongInfo'
import SongImage from './SongImage'
import MultiTrack from './MultiTrack'
import Music from './Music'
import Vinyl from './Vinyl'

const Content = styled.section`
    padding: 1em;
    position: relative;
    margin-top: -1em;
`

const Text = styled.p`
    margin-top: 1em;
`
const Button = styled.button`
    appearance: none;
    background-color: #000;
    color: #fff;
    border: none;
    outline: none;
    font-size: .8rem;
    padding: .31em .62em;
    position: absolute;
    top: 12em;
    left: .62em;
    cursor: pointer;
`

class Player extends Component {
  constructor() {
    super()
    this.state = {
      index: null,
      songs: {},
      flipped: false,
      playing: false,
    }
    this.showBack = this.showBack.bind(this)
    this.showFront = this.showFront.bind(this)
  }

  componentWillMount() {
    const that = this
    that.setState({
      songs: data.songs,
    })
    that.socket = socketIoClient('http://localhost:9091')
    that.socket.on('objectTouched', (object) => {
      const index = object.toString()
      that.setState({
        index,
        playing: true,
      })
    })
  }

  showBack() {
    this.setState({
      flipped: true,
      playing: false,
      index: null,
    })
  }

  showFront() {
    this.setState({
      flipped: false,
      playing: false,
      index: null,
    })
  }

  render() {
    const {
      songs, index, playing,
    } = this.state
    return (
      <section>
        <FlipCard
          disabled
          flipped={this.state.flipped}
        >
          <Content>
            {(index === null) ?
              <Text>No song playing :-(</Text>
                        : <SongInfo
                          song={songs[index]}
                        />
                    }
            {(index != null) ?
              <SongImage song={songs[index]} />
                        : ''
                    }
            {(index != null) ?
              <Music song={songs[index]} volume={this.props.volume} playing={playing} />
                        : ''
                    }
            <Button type="button" onClick={this.showBack}>Go to multitrack mode</Button>
          </Content>
          <Content>
            <MultiTrack playing={playing} />
            <Button type="button" ref="backButton" onClick={this.showFront}>Go to single track mode</Button>
          </Content>
        </FlipCard>
        <Vinyl playing={playing} />
      </section>
    )
  }
}

export default Player

Player.propTypes = {
  volume: PropTypes.number,
}
