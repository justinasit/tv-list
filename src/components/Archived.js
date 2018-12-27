import React from 'react';
import Storage from '../Storage';
import { Button } from 'reactstrap';

export default class ListResults extends React.Component {
  
  state = {
    archivedShows: [],
  };
  storage = new Storage();

  componentDidMount() {
    this.setState({
      archivedShows: this.storage.getItem('archivedShows')
    });
  }

  render() {
    return ( 
      <div>
        <h2>Archived Shows</h2><br/>
        { (this.state.archivedShows.length === 0) ? <p>Nothing here!</p> : ''}
        { this.state.archivedShows.map((item, index) => 
            <p key={index}> 
              <li>{`${item.name} (Seasons - ${item.number_of_seasons})`} 
              <Button size="sm" id={'unarchive-button-'+index} onClick={(e) => this.unArchiveShow(e, 'active', item.id, index)}>Un-Archive</Button>
                <br/><br />  
              </li>
        </p>)}
      </div>
    )
  }
}