import React, {Component, useEffect, useState} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import {geolocated} from "react-geolocated";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints.json";
import L from 'leaflet';
import leafPosition from './assets/navigation .png'
import leafRestaurant from './assets/dish.png'
import {Link} from "react-router-dom";


class MapContainer extends Component {

    constructor() {
        super()

        this.state = {
            latitude: 46.2324104309082,
            longitude: 7.358489990234375,


        };

        this.getLocation = this.getLocation.bind(this)
        this.getCoordinates = this.getCoordinates.bind(this)
        this.getCoords = this.getCoords.bind(this)


    }


    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getCoordinates);
        } else {
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
                this.setState({latitude: 'err-latitude', longitude: 'err-longitude'})
            })
        }

    }

    getCoords(e) {

        const {lat, lng} = e.latlng

        try {
            this.props.updateCoordinates(lat, lng)
        } catch (error) {

        }

    }


    render() {

        const {latitude, longitude} = this.state

        const long = this.props.coords ? this.props.coords.longitude : longitude;
        const lat = this.props.coords ? this.props.coords.latitude : latitude;

        const PositionIcon = L.icon({
            iconUrl: leafPosition,
            iconSize: [30, 34],
            iconAnchor: [12, 35],
            popupAnchor: [3, -35]

        });

        return (

            <Map onClick={this.getCoords} center={[lat, long]} zoom={16}>

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>

                {
                    !this.props.coords ?
                        <div className="loading">Loading</div>
                        :
                        <Marker icon={PositionIcon}
                                position={[lat, long]}
                        >
                            <Popup>
                                <h4>You are here!</h4>
                            </Popup>
                        </Marker>


                }

                <Points/>


            </Map>

        )

    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false
    },
    userDecisionTimeout: 1000
})(MapContainer);


export function Points() {

    let [establishments, setEstablishments] = useState([]);
    let restaurantIcon = leafPosition;
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();


    useEffect(() => {

        //get all establishment to display a complete list
        async function getEstablishments() {
            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if (establishments && establishments.length > 0) {
                // console.log(establishments);
                setEstablishments(establishments);
            }
        }

        getEstablishments();
    }, []);

    function createIcon(url) {
        return new L.Icon({
            iconUrl: url,
            iconSize: [30, 34],
            iconAnchor: [12, 35],
            popupAnchor: [0, -35],
        });
    }

    function getMarkerIcon(type) {
        switch(type){
            case "Other":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/67/67533.svg');
            case "Restaurant":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/685/685352.svg');
            case "Museum":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/3706/3706629.svg');
            case "Bar":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/3144/3144974.svg');
            case "Bank":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/662/662622.svg');
            case "Cinema":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/633/633600.svg');
            case "Theater":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/860/860331.svg');
            case "Pharmacy":
                return createIcon('https://www.flaticon.com/svg/static/icons/svg/883/883407.svg');
        }
        return createIcon('https://www.flaticon.com/svg/static/icons/svg/1476/1476223.svg');
    }

    return (
        <>
            {
                establishments.map((establishment) => {
                    const point = [establishment.latitude, establishment.longitude];
                    return (
                        <Marker position={point} key={establishment.id}
                                icon={getMarkerIcon(establishment.establishmentType.establishmentTypeName)}
                        >
                            <Popup>
                                <h3>{establishment.establishmentType.establishmentTypeName}</h3>
                                <h5>{establishment.name}</h5>
                                <div>{establishment.address}</div>
                                <div>{establishment.location.npa} {establishment.location.city}</div>
                                <div>
                                    <Link
                                        className="App-link"
                                        to={`/establishment/${establishment.id}`}
                                    >
                                        More details
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })
            }
        </>
    )
}