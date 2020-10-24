import React, {useEffect} from "react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import {Map, Marker, TileLayer} from "react-leaflet";


export default function Establishment(props) {

    const { id, name, latitude, longitude, address, url, establishmentTypeId, locationId} = props;
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();
    let estTypeName;


    useEffect(() => {
        async function getEstablishmentTypes() {
            console.log("type id : "+establishmentTypeId)
            let establishmentType = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentType}${establishmentTypeId}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            estTypeName = establishmentType.establishmentTypeName;
            console.log("estTypeName : "+estTypeName);
        }
        getEstablishmentTypes();

    }, []);



    return (
        <div className="establishment">
            <div>Id : {id}</div>
            <h2>Name : {name}</h2>
            <div>Latitude : {latitude}</div>
            <div>Longitude : {longitude}</div>
            <div>Address : {address}</div>
            <a href={url}>url : {url}</a>
            <div>Est type id : {establishmentTypeId}</div>
            <div>Loc id : {locationId}</div>
            <div>Est Type name : {estTypeName}</div>
            <Map id="establishmentListMap" center={[ latitude , longitude]} zoom={16}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                    <Marker
                        position={[latitude, longitude]}
                    >
                    </Marker>
            </Map>
        </div>
    );
}