import React, {useContext, useEffect, useState} from "react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import {
    EmailShareButton,
    EmailIcon,
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon
} from "react-share";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {useFormik} from "formik";
import * as Yup from "yup";
import OurMap from "../OurMap";
import {BsFiles} from "react-icons/all";
import {Link, useHistory} from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import RateReviewIcon from '@material-ui/icons/RateReview';
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import swal from 'sweetalert';
import {ThemeContext, themes} from "../ThemeContext";
import Error404 from "../pages/Error404";
import L from "leaflet";
import leafPosition from "../assets/navigation .png";

export default function Establishment(props) {
    const {id, name, latitude, longitude, address, url, establishmentType, establishmentTypeId, location, locationId} = props;
    const [editMode, setEditMode] = useState(false);
    let history = useHistory();
    let [isAdmin, setIsAdmin] = useState(false);
    let {
        user,
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    function switchToEdit() {
        setEditMode(!editMode);
    }

    async function deleteEstablishment() {
        let token = await getAccessTokenSilently();
        let result = await swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this establishment !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}/${props.id}`, {
                    method: 'DELETE',
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                // let data = await response.json();
                swal("Delete done.", "The establishment has been deleted.", "success");
                history.push("/list/establishment");
            } else {
                swal("The deletion has been cancelled.");
            }
        });

        return result;
    }

    useEffect(() => {
        //Get if user is an admin or not
        async function getUserIdByEmail(user) {
            let userConnected = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.userByEmail}${user.name}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if (userConnected.userTypeId == 1) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        }
        getUserIdByEmail(user);
    }, []);

    return (
        <div className="establishment">
            {
                editMode ?
                    <EditOn {...props}/>
                    // <EditOff {...props}/>
                    :
                    <EditOff {...props}/>
                // <EditOn {...props}/>
            }
            {
                isAdmin ?
                    <div>
                        <Button
                            id="buttonEdit"
                            variant="contained"
                            color="secondary"
                            startIcon={<EditIcon/>}
                            onClick={switchToEdit}
                        >
                            Edit
                        </Button>
                        <Button
                            id="buttonDelete"
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon/>}
                            onClick={deleteEstablishment}
                            tag={Link} to="/list/establishment"
                        >
                            Delete
                        </Button>
                    </div>
                    :
                    <span/>
            }
        </div>
    );
}

function EditOff(props) {
    const pageUrl = window.location.href;
    let [dist, setDist] = useState();
    let [averageRate, setAverageRate] = useState(0);
    let [totalReview, setTotalReview] = useState(0);
    let [isRating, setIsRating] = useState(false);
    let currentLat;
    let currentLong;
    let history = useHistory();
    let [newRate, setNewRate] = useState(0);
    let [latitude, setLatitude] = useState(0);
    let [longitude, setLongitude] = useState(0);
    let [currentUser, setCurrentUser] = useState([]);

    let {
        user,
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    useEffect(() => {


        const location = window.navigator && window.navigator.geolocation;

        function getDistanceFromLatLonInKm() {

            if (location) {
                location.getCurrentPosition((position) => {


                    let R = 6371; // Radius of the earth in km
                    let dLat = deg2rad(props.latitude - position.coords.latitude);  // deg2rad below
                    let dLon = deg2rad(props.longitude - position.coords.longitude);
                    let a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(deg2rad(position.coords.latitude)) * Math.cos(deg2rad(props.latitude)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2)
                    ;
                    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    let d = R * c; // Distance in km
                    d = (Math.round(d * 1000)) / 1000;
                    setDist(d);
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);

                }, (error) => {
                    console.error("Error Code = " + error.code + " - " + error.message);
                })
            }

        }

        async function getAverageRate() {
            //The request return -1 if there is no rate for the establishment
            let rate = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.averageRate}${props.id}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setAverageRate(rate);
        }

        async function getTotalReviews() {
            //The request return -1 if there is no rate for the establishment
            let totalReview = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.totalReview}${props.id}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setTotalReview(totalReview);
        }

        //Get if user is an admin or not
        async function getUserIdByEmail(user) {
            let userConnected = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.userByEmail}${user.name}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            await setCurrentUser(userConnected);
        }

        getUserIdByEmail(user);
        getTotalReviews();
        getAverageRate();
        getDistanceFromLatLonInKm();
    }, []);

    try {
        let test = props.establishmentType.establishmentTypeName;
    } catch (e) {
    }

    let themeContext = useContext(ThemeContext);

    let handleToRate = () => {
        setIsRating(!isRating);
    }

    let handleHasRated = async (e) => {

        let newRateHere = Number(e.target.value);
        let idEstReview = props.id;
        let idUserReview = currentUser.id;
        let idExistingReview;
        let postReview;
        let token = await getAccessTokenSilently();

        // does the review exist ?
        idExistingReview = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.reviews}/${idUserReview}/${idEstReview}`,
            getAccessTokenSilently,
            loginWithRedirect
        );

        if (idExistingReview < 0) {
            //review doesn't exist : create it
            postReview = {
                rate: newRateHere,
                userId: idUserReview,
                establishmentId: idEstReview
            }

            if (newRateHere >= 0) {
                let response = await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.reviews}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postReview),
                });
                let data = await response.json();
            }
        } else {
            //review exist : upload it
            postReview = {
                id: idExistingReview,
                rate: newRateHere,
                userId: idUserReview,
                establishmentId: idEstReview
            }

            if (newRateHere >= 0) {
                await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.reviews}/${idExistingReview}`, {
                    method: 'PUT',
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postReview),
                });
            }
        }

        let rate = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.averageRate}${props.id}`,
            getAccessTokenSilently,
            loginWithRedirect
        );
        setAverageRate(rate);

        let totalReview = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.totalReview}${props.id}`,
            getAccessTokenSilently,
            loginWithRedirect
        );
        setTotalReview(totalReview);


        setIsRating(!isRating);
    }

    function RatingStars() {
        return (
            <div>
                {isRating ? (
                    <div>
                        <span>Add your rate</span>
                        <Rating
                            name="simple-controlled"
                            onClick={handleHasRated}
                            emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                        />
                        {/*<button onClick={handleHasRated}>Rate</button>*/}
                    </div>

                ) : (
                    <div>
                        <Rating
                            name="simple-controlled"
                            value={averageRate} precision={0.5}
                            emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                            readOnly/>
                        <span id="totalReview">({totalReview})</span>
                        <Button
                            id="rateButton"
                            onClick={handleToRate}
                            variant="contained"
                            color="secondary"
                            startIcon={<RateReviewIcon/>}
                        >
                            Rate
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    //Function to copy url in clipboard
    function copyCodeToClipboard() {
        swal("Link copied !", "Url copied to the clipboard.", "success");
        document.execCommand("copy");
    }

    const PositionIcon = new L.icon({
        iconUrl: leafPosition,
        iconSize: [30, 34],
        iconAnchor: [12, 35],
        popupAnchor: [3, -35]
    });

    const EstablishmentIcon = new L.icon({
        iconUrl: 'https://www.flaticon.com/svg/static/icons/svg/1397/1397898.svg',
        iconSize: [40, 40],
        iconAnchor: [12, 35],
        popupAnchor: [8, -35]
    });

    try {
        return (
            <div style={{color: themes[themeContext.theme].foreground}}>
                <h1>{props.establishmentType.establishmentTypeName}</h1>
                <hr></hr>
                <h2>{props.name}</h2>
                <RatingStars/>
                {/*<div>*/}
                {/*    <Rating*/}
                {/*        name="simple-controlled"*/}
                {/*        value={averageRate} precision={0.5}*/}
                {/*        emptyIcon={<StarBorderIcon fontSize="inherit"/>}*/}
                {/*        readOnly/>*/}
                {/*    <span id="totalReview">({totalReview})</span>*/}
                {/*</div>*/}
                <div>{props.address}</div>
                <div>{props.location.npa} {props.location.city}</div>
                <div>Distance from me : {dist} Km</div>
                <div>
                    <EmailShareButton
                        subject={props.name}
                        body={"Hi,\nI just discovered this amazing establishment : " + props.name + ", on the app OpenSunday \nIt's open on Sunday !\n\n"}
                        url={pageUrl}
                        id="shareButton">
                        <EmailIcon size={50} round/>
                    </EmailShareButton>
                    <FacebookShareButton
                        url={pageUrl}
                        quote={props.name}
                        id="shareButton"
                    >
                        <FacebookIcon size={50} round/>
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={pageUrl}
                        title={props.name}
                        id="shareButton"
                    >
                        <TwitterIcon size={50} round/>
                    </TwitterShareButton>
                    <BsFiles id="copyLinkButton" size={40} onClick={copyCodeToClipboard}/>
                </div>
                <a href={props.url}>{props.url}</a>
                <Map id="up" center={[props.latitude, props.longitude]} zoom={16}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                    <Marker
                        position={[props.latitude, props.longitude]}
                        icon={EstablishmentIcon}
                    >
                        <Popup>
                            <p>Establishment position</p>
                        </Popup>
                    </Marker>
                    <Marker
                        position={[latitude, longitude]}
                        icon={PositionIcon}
                    >
                        <Popup>
                            <h5>You are here!</h5>
                        </Popup>
                    </Marker>
                </Map>
            </div>
        )
    } catch (e) {
        return (
            // history.push("/error404")
            window.location.href = "/error404"
        )
    }


}

function EditOn(props) {
    const pageUrl = window.location.href;
    let [establishmentsTypes, setEstablishmentsTypes] = useState([]);
    let locationExists = false;
    let locationIdSaved;
    let history = useHistory();
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
            id: props.id,
            name: props.name,
            latitude: props.latitude,
            longitude: props.longitude,
            address: props.address,
            url: props.url,
            establishmentTypeId: props.establishmentType.id,
            locationId: props.location.id,
            npa: props.location.npa,
            city: props.location.city,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .max(30, 'Must be 30 characters or less'),
            npa: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(10, 'Must be 10 characters or less'),
            location: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .max(50, 'Must be 50 characters or less'),
            address: Yup.string()
                .min(5, 'Must be 5 characters or more')
                .max(50, 'Must be 50 characters or less'),
            url: Yup.string()
                .min(3, 'Must be 3 characters or more')
        }),

        onSubmit: async values => {
            //Parse String to Int for the fk
            values.establishmentTypeId = Number(values.establishmentTypeId);
            values.locationId = Number(values.locationId);

            //Test if the type is not changed on submit to avoid undefined type !
            if (values.establishmentTypeId == '') {
                values.establishmentTypeId = props.establishmentTypeId;
            }

            //Extract the npa and city value for the location table
            let postLocation = {
                npa: values.npa,
                city: values.city,
            }

            //Get all the locations of the db
            let locations = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            //Check/test if the location already exists and saved the id if yes (for the if after the for)
            for (let i = 0; i < locations.length; i++) {
                if (locations[i].npa === postLocation.npa && locations[i].city === postLocation.city) {
                    locationExists = true;
                    locationIdSaved = locations[i].id;
                }
            }

            let token = await getAccessTokenSilently();
            //According to the test, make the post of the location or not
            if (locationExists) {
                //Put the locationId for the post
                values.locationId = locationIdSaved;
                //Post the establishment
                try {
                    let newEstablishment = await putEstablishment(values, token);
                } catch (e) {
                }
                //If the location doesn't exist post the new location
            } else {
                let response = await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postLocation),
                });
                let location = await response.json();
                values.locationId = location.id;
                try {
                    let newEstablishment = await putEstablishment(values, token);
                } catch (e) {
                }
            }
            await swal("Edit done.", "Modifications has been saved !", "success");
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
                    defaultValue={props.establishmentTypeId}
                >
                    <option value={props.establishmentTypeId}>{props.establishmentType.establishmentTypeName}</option>
                    {establishmentsTypes.map((establishmentsType) => {
                        //Test to not display 2 times the type of the establishment the user is editing
                        if (props.establishmentTypeId != establishmentsType.id)
                            return <option key={establishmentsType.id} value={establishmentsType.id}>
                                {establishmentsType.establishmentTypeName}
                            </option>
                    })}
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
                <Button
                    type="submit"
                    id="buttonSave"
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveIcon/>}
                >
                    Save
                </Button>
                {/*<button type="submit" to="/list/establishment">Save</button>*/}
                {/*<button type="submit" onClick={history.goBack()}>Save</button>*/}
                {/*<button type="submit" onClick=onClick={() =>  {window.location.href='/list/establishment'}}>Save</button>*/}
            </form>
        </div>
    )
}

//Function to post an establishment according to the values in parameter
async function putEstablishment(values, token) {
    let response = await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}/${values.id}`, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    let data = await response.json();
    return data;
}