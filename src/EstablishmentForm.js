import React, {useEffect, useState} from "react";
import "./App.css";
import { useFormik } from 'formik';
import Map from "./Map";

export class EstablishmentForm extends React.Component {
    render() {
        return (
            <>
                <SignupForm></SignupForm>
            </>
        );
    }
}

const SignupForm = () => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            establishmentType: '',
            name: '',
            npa: '',
            location: '',
            latitude: '',
            longitude: '',
            address: '',
            url: '',
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            fetch(process.env.REACT_APP_SERVER_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstParam: values.location,
                    secondParam: values.npa,
                })
            })
        },
    });

    return (
        <div>
            <div id="up">
                <Map></Map>
            </div>
            <div id="down">
                <form onSubmit={formik.handleSubmit}>
                    <select
                        id="establishmentType"
                        name="establishmentType"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.establishmentType}
                        placeholder="Establishment type"
                    >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Museum">Museum</option>
                        <option value="Bar">Bar</option>
                        <option value="Theater">Theater</option>
                    </select>
                    <br/>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        placeholder="Establishment name"
                    />
                    <br/>
                    <input
                        id="npa"
                        name="npa"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.npa}
                        placeholder="NPA"
                    />
                    <input
                        id="location"
                        name="location"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.location}
                        placeholder="Location"
                    />
                    <br/>
                    <input
                        id="latitude"
                        name="latitude"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.latitude}
                        placeholder="Establishment latitude"
                        readOnly="readonly"
                    />
                    <input
                        id="longitude"
                        name="longitude"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.longitude}
                        placeholder="Establishment longitude"
                        readOnly="readonly"
                    />
                    <br/>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address}
                        placeholder="Establishment address"
                    />
                    <br/>
                    <input
                        id="url"
                        name="url"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.url}
                        placeholder="Establishment url"
                    />
                    <br/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};