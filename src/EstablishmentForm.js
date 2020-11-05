import React, {useEffect, useState} from "react";
import "./App.css";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints.json";
import BackupIcon from '@material-ui/icons/Backup';
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import swal from 'sweetalert';
import OurMap from "./OurMap";

export class EstablishmentForm extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <>
                <SignupForm></SignupForm>
            </>
        );
    }
}

// New establishment form
function SignupForm() {
    let [establishmentsTypes, setEstablishmentsTypes] = useState([]);
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();
    let locationExists = false;
    let locationIdSaved ;

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

    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            name: '',
            latitude: '',
            longitude: '',
            address: '',
            url: '',
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
            //Parse String to Int for the fk
            values.establishmentTypeId = Number(values.establishmentTypeId);
            values.locationId = Number(values.locationId);

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
            for(let i=0; i<locations.length; i++){
                if(locations[i].npa === postLocation.npa && locations[i].city === postLocation.city){
                    locationExists = true;
                    locationIdSaved = locations[i].id;
                }
            }

            //According to the test, make the post of the location or not
            if(locationExists){
                //Put the locationId for the post
                values.locationId = locationIdSaved;
                //Post the establishment
                let newEstablishment = await postEstablishment(values);
                //If the location doesn't exist post the new location
            } else{
                let token = await getAccessTokenSilently();
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
                await postEstablishment(values);
            }
            swal("Submit done.", "The establishment has been submitted.", "success");
            //Reset the form
            formik.handleReset();
        }
    });

    //Function to post an establishment according to the values in parameter
    async function postEstablishment(values) {
        let token = await getAccessTokenSilently();
        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });
        let data = await response.json();
        console.log(values);
        return data;
    }

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
            <p>Click on the map to get the coordinate of your establishment</p>
            <div id="up">
                <OurMap updateCoordinates={updateCoordinates}></OurMap>
            </div>
            <div id="down">
                <form onSubmit={formik.handleSubmit}>
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
                    <br/>
                    <select
                        id="establishmentTypeId"
                        name="establishmentTypeId"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.establishmentTypeId}
                        placeholder="Establishment type"
                        required
                    >
                        <option value="">Choose a type</option>
                        {establishmentsTypes.map((establishmentsType) => (
                            <option value={establishmentsType.id}>
                                {establishmentsType.establishmentTypeName}
                            </option>
                        ))}
                    </select>
                    <br/>
                    {formik.touched.name && formik.errors.name ? (
                        <div id="error">{formik.errors.name}</div>
                    ) : null}
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        placeholder="Establishment name"
                        required
                    />
                    <br/>
                    {formik.touched.npa && formik.errors.npa ? (
                        <div id="error">{formik.errors.npa}</div>
                    ) : null}
                    {formik.touched.location && formik.errors.location ? (
                        <div id="error">{formik.errors.location}</div>
                    ) : null}
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
                    <Button
                        type="submit"
                        id="buttonReset"
                        variant="contained"
                        color="secondary"
                        startIcon={<RotateLeftIcon />}
                        onClick={formik.handleReset}
                    >
                        Reset
                    </Button>
                    {/*Button managing (submit button disable if fields are empty)*/}
                    {
                        formik.values.latitude==''
                        || formik.values.establishmentTypeId==''
                        || formik.values.name==''
                        || formik.values.npa==''
                        || formik.values.city==''
                        || formik.values.address==''
                        || formik.values.url=='' ?
                            <Button
                                id="buttonDisable"
                                type="submit"
                                disabled={true}
                                variant="contained"
                                color="secondary"
                                startIcon={<BackupIcon />}
                            >
                                Submit
                            </Button>
                            :
                            <Button
                                id="buttonEnable"
                                type="submit"
                                disabled={false}
                                variant="contained"
                                color="secondary"
                                startIcon={<BackupIcon />}
                            >
                                Submit
                            </Button>
                    }
                </form>
            </div>
        </div>
    );

};