import React, {Component} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import {geolocated} from "react-geolocated";





class MapContainer extends Component {

    constructor() {
        super()

        this.state = {
            latitude: 46.2324104309082,
            longitude:  7.358489990234375,


        };

        this.getLocation = this.getLocation.bind(this)
        this.getCoordinates = this.getCoordinates.bind(this)
        this.getCoords= this.getCoords.bind(this)


    }

    getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates);
        }else {
            alert("Geolaction is not supported by this browser");
        }

    }

    getCoordinates(position) {
        const location = window.navigator && window.navigator.geolocation
        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            }, (error) => {
                this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
            })
        }

    }

    getCoords(e){

        const {lat,lng} = e.latlng

        this.props.updateCoordinates(lat,lng)


    }


    render() {

        const {latitude ,longitude} = this.state

        const long = this.props.coords? this.props.coords.longitude: longitude;
        const lat = this.props.coords? this.props.coords.latitude: latitude;



        return (

            <Map onClick={this.getCoords} center={[ lat , long]} zoom={16}>
                {console.log("lat : "+lat)}
                {console.log("long : "+long)}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>

                {
                    !this.props.coords ?
                        <div className="loading">Loading</div>
                        :
                        <Marker 
                            position={[lat, long]}
                            >
                            <Popup>
                                You are here!
                            </Popup>
                        </Marker>
                }



        </Map>

        )

    }
}

export default geolocated({
    positionOptions:{
        enableHighAccuracy: false
    },
    userDecisionTimeout: 1000
    })(MapContainer);

