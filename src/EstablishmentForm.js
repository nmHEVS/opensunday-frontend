import React, {useEffect, useState} from "react";
import "./App.css";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Map from "./Map";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints.json";

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
            latitude: 'undefined',
            longitude: 'undefined',
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
                .min(4, 'Must be 2 characters or more')
                .max(10, 'Must be 20 characters or less'),
            location: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .max(20, 'Must be 20 characters or less'),
            address: Yup.string()
                .min(5, 'Must be 5 characters or more')
                .max(20, 'Must be 20 characters or less'),
            url: Yup.string()
                .min(3, 'Must be 2 characters or more')
        }),

        onSubmit: async values => {
            //Parse String to Int for the fk
            values.establishmentTypeId = Number(values.establishmentTypeId);
            values.locationId = Number(values.locationId);
            // alert(JSON.stringify(values, null, 2));

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
            // alert(JSON.stringify(locations[1], null, 2));

            //Test if the location already exists and saved the id if yes (for the if after the for)
            for(let i=0; i<locations.length; i++){
                if(locations[i].npa === postLocation.npa && locations[i].city === postLocation.city){
                    locationExists = true;
                    locationIdSaved = locations[i].id;
                    console.log(locationExists);
                }
            }

            //According to the test, make the post of the location or not
            if(locationExists){
                //Put the locationId for the post
                values.locationId = locationIdSaved;
                //Post the establishment
                postEstablishment(values);
            //If the location doesn't exist post the new location
            } else{
                await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFlekliQXpkUlhKbDFFMFBpNjF2NCJ9.eyJpc3MiOiJodHRwczovL29wZW5zdW5kYXkuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVmNzZlYzc1YTZhZjY0MDA3MWQ4OTgxYSIsImF1ZCI6Imh0dHBzOi8vb3BlbnN1bmRheS5laGVhbHRoLmhldnMuY2giLCJpYXQiOjE2MDIxNDg4NzgsImV4cCI6MTYwNDU2ODA3OCwiYXpwIjoiNWYwSFkyYm1ZaVdwZTlFQWVXWDdtV1lHS2NqUXZ5NWwifQ.F3nIuFnWBfJXqH8C4cOuLSOg_OhUUDrWaEW4ClZv1moE1RlwwHWwQ_n9M2YkJEa4PXd-7czUSj28lypb6JyXeeVavFdJ0DptLEcq3Qim2nBUMA8QhZAW49UfpIAZwlVkR6RKs9sd8LRUqva2m8DjQft4Bzslev69yGqBrPysgxUtyhKI4VQLSTGArvq3zREhS_ktGLZMvfB6OLKX_RXQPCRbcc18aHQRluj5Z_0CkSLQyimZs_FxlBIAdklnPn29qDEgde-c0pXH5FbvF9JMSU6fZ8eNoW8lsF6hVuyltNwkbapiDS6w-2UEbHZCSMikAzsrqjn6QaO-Jg_BTo0ffg'
                    },
                    body: JSON.stringify(postLocation),
                });
                postEstablishment(values);
            }

            formik.handleReset();
        }
    });

    //Function to post an establishment according to the values in parameter
    async function postEstablishment(values) {
        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFlekliQXpkUlhKbDFFMFBpNjF2NCJ9.eyJpc3MiOiJodHRwczovL29wZW5zdW5kYXkuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVmNzZlYzc1YTZhZjY0MDA3MWQ4OTgxYSIsImF1ZCI6Imh0dHBzOi8vb3BlbnN1bmRheS5laGVhbHRoLmhldnMuY2giLCJpYXQiOjE2MDIxNDg4NzgsImV4cCI6MTYwNDU2ODA3OCwiYXpwIjoiNWYwSFkyYm1ZaVdwZTlFQWVXWDdtV1lHS2NqUXZ5NWwifQ.F3nIuFnWBfJXqH8C4cOuLSOg_OhUUDrWaEW4ClZv1moE1RlwwHWwQ_n9M2YkJEa4PXd-7czUSj28lypb6JyXeeVavFdJ0DptLEcq3Qim2nBUMA8QhZAW49UfpIAZwlVkR6RKs9sd8LRUqva2m8DjQft4Bzslev69yGqBrPysgxUtyhKI4VQLSTGArvq3zREhS_ktGLZMvfB6OLKX_RXQPCRbcc18aHQRluj5Z_0CkSLQyimZs_FxlBIAdklnPn29qDEgde-c0pXH5FbvF9JMSU6fZ8eNoW8lsF6hVuyltNwkbapiDS6w-2UEbHZCSMikAzsrqjn6QaO-Jg_BTo0ffg'
            },
            body: JSON.stringify(values),
        });
    }

    //API to get the postcode and the locality according to the lat and long (GEOCODING)
    function getLocationWithAPI(lat, lng){
        //API to get the locality and the postcode according to the latitude and the longitude
        async function getLocationByLatLong() {
            let getLocation = await request(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=fr`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            // alert(JSON.stringify(getLocation.locality, null, 2));
            formik.setFieldValue('npa', getLocation.postcode);
            formik.setFieldValue('location', getLocation.locality);
        }
        // await getLocationByLatLong();
    }

    const updateCoordinates = async (lat, lng) => {
        formik.setFieldValue('latitude', lat);
        formik.setFieldValue('longitude', lng);
        getLocationWithAPI(lat, lng);
    }

    return (
        <div>
            <text>Click on the map to get the coordinate of your establishment</text>
            <div id="up">
                <Map updateCoordinates={updateCoordinates}></Map>
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
                    {formik.touched.address && formik.errors.address ? (
                        <div id="error">{formik.errors.address}</div>
                    ) : null}
                    <input
                        id="url"
                        name="url"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.url}
                        placeholder="www.establishment.ch"
                    />
                    {formik.touched.url && formik.errors.url ? (
                        <div id="error">{formik.errors.url}</div>
                    ) : null}
                    {/*Button managing (if the user didn't click on the map no submission possible)*/}
                    {
                        formik.values.latitude=='undefined' && formik.values.longitude=='undefined' ?
                            <button id="buttonDisable" type="submit" disabled={true}>Submit</button>
                            : <button id="buttonEnable" type="submit">Submit</button>
                    }
                </form>
            </div>
        </div>
    );

};