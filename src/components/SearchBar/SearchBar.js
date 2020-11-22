import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event) {
       this.setState({term: event.target.value});
    }

    handleEnterKey(event) {
        if(event.keyCode === 13 ) {
            this.props.onSearch(this.state.term);        
        };
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={this.handleEnterKey} />
                <button className="SearchButton" onClick={this.search} >SEARCH</button>
            </div>
        )
    }
};

export default SearchBar;