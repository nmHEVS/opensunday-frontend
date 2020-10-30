import React, {useEffect, useState} from "react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import {Map, Marker, TileLayer} from "react-leaflet";
import {EmailShareButton, EmailIcon, TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon} from "react-share";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {useFormik} from "formik";
import * as Yup from "yup";
import OurMap from "../OurMap";



export default function Establishment(props) {
    const { id, name, latitude, longitude, address, url, establishmentTypeId, locationId} = props;
    const pageUrl = window.location.href

    const [editMode, setEditMode] = useState([]);

    useEffect(() => {
        setEditMode(false);
    }, []);

    function switchToEdit() {
        setEditMode(!editMode);
        console.log(editMode);
    }

    return (
        <div className="establishment">
            {
                editMode === true ?
                    <EditOn {...props}/>
                    // <EditOff {...props}/>
                    :
                    <EditOff {...props}/>
                // <EditOn {...props}/>
            }
            <button
                type="button"
                title="Switch Theme"
                onClick={switchToEdit}
            >
                {
                    editMode===true ? "Cancel" : "Switch to edit mode"
                }
            </button>
        </div>
    );
}

function EditOff(props) {
    const pageUrl = window.location.href;
    let [dist, setDist] = useState();
    let [estTypeName, setEstTypeName] = useState();
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    useEffect(() => {
        const currentLat = 46.282725;
        const currentLong = 7.538253;

        function getDistanceFromLatLonInKm() {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(props.latitude-currentLat);  // deg2rad below
            var dLon = deg2rad(props.longitude-currentLong);
            var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(currentLat)) * Math.cos(deg2rad(props.latitude)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            d = (Math.round(d*1000))/1000;
            setDist(d);
        }
        async function getEstablishmentTypes() {
            console.log("type id : "+props.establishmentTypeId)
            let establishmentType = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentType}${props.establishmentTypeId}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setEstTypeName(establishmentType.establishmentTypeName);
        }
        getEstablishmentTypes();
        getDistanceFromLatLonInKm();
    }, []);

    return (
        <div>
            <div>Id : {props.id}</div>
            <h2>Name : {props.name}</h2>
            <CopyToClipboard text={pageUrl}>
                <button>Copy URL to the clipboard</button>
            </CopyToClipboard>
            <div>
                <EmailShareButton
                    subject={props.name}
                    body={"Hi,\nI just discovered this amazing establishment : " + props.name + ", on the app OpenSunday \nIt's open on Sunday !\n\n" }
                    url={pageUrl}
                    className={"shareButton"}>
                    <EmailIcon size={32} round/>
                </EmailShareButton>
                <FacebookShareButton
                    url={pageUrl}
                    quote={props.name}
                    className="Demo__some-network__share-button"
                >
                    <FacebookIcon size={32} round/>
                </FacebookShareButton>
                <TwitterShareButton
                    url={pageUrl}
                    title={props.name}
                    className="shareButton"
                >
                    <TwitterIcon size={32} round/>
                </TwitterShareButton>
            </div>
            <div>Latitude : {props.latitude}</div>
            <div>Longitude : {props.longitude}</div>
            <div>Address : {props.address}</div>
            <div>Distance from me : {dist} Km</div>
            <a href={props.url}>url : {props.url}</a>
            <div>Est Type name : {estTypeName}</div>
            <Map id="up" center={[props.latitude, props.longitude]} zoom={16}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                <Marker
                    position={[props.latitude, props.longitude]}
                >
                </Marker>
            </Map>
        </div>
    )
}

function EditOn(props) {
    const pageUrl = window.location.href;
    let [establishmentsTypes, setEstablishmentsTypes] = useState([]);
    let [estTypeName, setEstTypeName] = useState();
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            name: props.name,
            latitude: props.latitude,
            longitude: props.longitude,
            address: props.address,
            url: props.url,
            establishmentTypeId: '',
            locationId: '',
            npa: '',
            city: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .max(30, 'Must be 30 characters or less'),
            npa: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(10, 'Must be 20 characters or less'),
            location: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .max(20, 'Must be 20 characters or less'),
            address: Yup.string()
                .min(5, 'Must be 5 characters or more')
                .max(20, 'Must be 20 characters or less'),
            url: Yup.string()
                .min(3, 'Must be 3 characters or more')
        }),

        onSubmit: async values => {

        }
    });

    useEffect(() => {
        async function getEstablishmentsTypes() {
            let establishmentsTypes = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentsTypes}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if (establishmentsTypes && establishmentsTypes.length > 0) {
                setEstablishmentsTypes(establishmentsTypes);
            }

            let establishmentType = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentType}${props.establishmentTypeId}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setEstTypeName(establishmentType.establishmentTypeName);
        }

        getEstablishmentsTypes();
    }, []);

    //API to get the postcode and the locality according to the lat and long (GEOCODING)
    async function getLocationWithAPI(lat, lng) {
        //API to get the locality and the postcode according to the latitude and the longitude
        async function getLocationByLatLong() {
            let getLocation = await request(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=fr`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            // alert(JSON.stringify(getLocation.locality, null, 2));
            formik.setFieldValue('npa', getLocation.postcode);
            formik.setFieldValue('city', getLocation.locality);
        }
        await getLocationByLatLong();
    }

    const updateCoordinates = async (lat, lng) => {
        formik.setFieldValue('latitude', lat);
        formik.setFieldValue('longitude', lng);
        await getLocationWithAPI(lat, lng);
    }

    console.log(props.longitude);
    console.log(props.latitude);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <select
                    id="establishmentTypeId"
                    name="establishmentTypeId"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.establishmentTypeId}
                    placeholder="Establishment type"
                    required
                >
                    <option value="">{estTypeName}</option>
                    {establishmentsTypes.map((establishmentsType) => (
                        <option value={establishmentsType.id}>
                            {establishmentsType.establishmentTypeName}
                        </option>
                    ))}
                </select>
                <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    placeholder="Establishment name"
                    required
                />
                <input
                    id="npa"
                    name="npa"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.npa}
                    placeholder="NPA"
                    required
                />
                <input
                    id="city"
                    name="city"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.city}
                    placeholder="City"
                    required
                />
                <br/>
                {formik.touched.address && formik.errors.address ? (
                    <div id="error">{formik.errors.address}</div>
                ) : null}
                <input
                    id="address"
                    name="address"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    placeholder="Establishment address"
                    required
                />
                <br/>
                {formik.touched.url && formik.errors.url ? (
                    <div id="error">{formik.errors.url}</div>
                ) : null}
                <input
                    id="url"
                    name="url"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.url}
                    placeholder="www.establishment.ch"
                />
                <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.latitude}
                    placeholder="Establishment latitude"
                    readOnly="readonly"
                    disabled="disabled"
                    required
                />
                <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.longitude}
                    placeholder="Establishment longitude"
                    readOnly="readonly"
                    disabled="disabled"
                    required
                />
                <div id="up">
                    <OurMap updateCoordinates={updateCoordinates}></OurMap>
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}