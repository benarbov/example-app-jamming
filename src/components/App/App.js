import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js' ;
import Spotify from '../../util/Spotify.js';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [], 
      playlistName: 'My Playlist',
      playlistTracks: []
      
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  
  addTrack(track) {
    //There could be a mistake here!  
    let check = false ;
    const playlistTracks = this.state.playlistTracks;
    let i;
    for (i = 0 ; i < playlistTracks.length ; i++ ) {
      if (playlistTracks[i].id === track.id ) {
        check = true;
      };
    };
    if (check === false) {
      playlistTracks.push(track);
      this.setState({playlistTracks: playlistTracks})
    };
  }

  removeTrack(track) {
    let check = false ;
    const playlistTracks = this.state.playlistTracks;
    let indices = playlistTracks.map(item => item.id);
    console.log(indices);
    let index = indices.indexOf(track.id);
    playlistTracks.splice(index, 1);
    this.setState({playlistTracks: playlistTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => `spotify:track:${track.id}`);
    console.log('playlist saved');
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=> {
      this.setState({playlistName: 'New Playlist', playlistTracks: []})
    });
    
  }

  search(term) {
    console.log('searching for ' + term);
    Spotify.search(term).then(results => {
      this.setState({searchResults: results});
    })
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}  />
            <Playlist 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack} 
            onNameChange={this.updatePlaylistName} 
            onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
