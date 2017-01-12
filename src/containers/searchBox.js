import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateMap } from '../actions/index';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.locateUser = this.locateUser.bind(this);
  }

  componentDidMount() {
    this.initAutocomplete();
  }
  /**
   * TODO: Submit first entry of auto complete when enter is pressed.
  * Prevent submitting page when the user presses enter in the searchbar
  * User should only search via autocomplete selection
  * @param  {Object} event
  */
  onFormSubmit(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }
  /**
   * Create autocomplete object to search geographical location types only
   */
  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        { types: ['geocode'] });
    autocomplete.addListener('place_changed', () => this.props.updateMap(autocomplete.getPlace()));
  }
  /**
   * Use browser geolocation to locate user, then pan to user location
   */
  locateUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Format locationData in proper format to be read by google map
        const locationData = {
          geometry: {
            location: new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            ),
          },
        };
        this.props.updateMap(locationData);
      });
    } else {
      console.log('This Browser doesnt support HTML5 geolocation');
    }
  }

  render() {
    this.locateUser();
    return (
      <div className="form-group">
        <input
          id="autocomplete"
          type="text"
          className="form-control"
          onKeyDown={this.onFormSubmit}
        />
        <img
          src="../../assets/enable_location.png"
          className="enable-location-img"
          onClick={this.locateUser}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateMap }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBox);