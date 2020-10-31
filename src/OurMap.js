

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

        try{
            this.props.updateCoordinates(lat,lng)
        }catch (error){

        }
    }


    render() {

        const {latitude ,longitude} = this.state

        const long = this.props.coords? this.props.coords.longitude: longitude;
        const lat = this.props.coords? this.props.coords.latitude: latitude;

        const PositionIcon = L.icon({
            iconUrl: leafPosition,
            iconSize: [30, 34],
            iconAnchor: [12, 35],
            popupAnchor: [-3, -50]

        });

        return (

            <Map onClick={this.getCoords} center={[ lat , long]} zoom={16}>

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
    positionOptions:{
        enableHighAccuracy: false
    },
    userDecisionTimeout: 1000
})(MapContainer);



export function Points() {

    let [establishments, setEstablishments] = useState([]);
    let [establishmentsTypes, setEstablishmentsTypes] = useState([]);
    let establishmentIcon = leafPosition;
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
                console.log(establishments);
                setEstablishments(establishments);
            }
        }

        async function getEstablishmentsTypes() {
            let establishmentsTypes = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentType}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if (establishmentsTypes && establishmentsTypes.length > 0) {
                console.log(establishmentsTypes);
                setEstablishmentsTypes(establishmentsTypes);
            }
        }

        getEstablishments();
        getEstablishmentsTypes();
    }, []);



    establishmentIcon = L.icon({
        iconUrl: leafRestaurant,
        iconSize: [30, 34],
        iconAnchor: [12, 35],
        popupAnchor: [-3, -50]

    });


    return (
        <>


            {
                establishments.map(establishment => {

                    const point = [establishment.latitude, establishment.longitude];

                    return (
                        <Marker position={point} key={establishment.id}>
                            <Popup>


                                <h3>{establishment.name}</h3><br/>
                                <br/>
                                <span>

                 {/*                   {
                                        establishments.map((establishment)=>{
                                            establishmentsTypes.map((establishmentsType)=>{
                                                if (establishment.id == establishmentsType.establishmentTypeId) {

                                                   {establishmentsType.establishmentTypeName}



                                                }

                                            })


                                        })
                                    }*/}

                                </span>
                                <br/>
                                <span>{establishment.address}</span>
                                <br/>
                                <span>Dimanche: 08:00-22:00</span>
                                <br/>
                                <span>
                                     <Link
                                         className="App-link"
                                         to={`/establishment/${establishment.id}`}
                                     >
                                        More details
                                    </Link>

                                 </span>


                            </Popup>
                        </Marker>

                    )
                })
            }

        </>
    )

}


