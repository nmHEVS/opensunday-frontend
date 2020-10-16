import React, { useState } from "react";
import "./App.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Map from "./Map";

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
const SignupForm = () => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            establishmentType: '',
            name: '',
            npa: '',
            location: '',
            latitude: '2',
            longitude: '40',
            address: '',
            url: '',
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
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const updateCoordinates = (lat, lng) => {
        formik.setFieldValue('latitude', lat);
        formik.setFieldValue('longitude', lng);
    }

    console.log(formik)

    return (
        <div>
            <div id="up">
                <Map updateCoordinates={updateCoordinates}></Map>
            </div>
            <div>
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
                    <input
                        id="npa"
                        name="npa"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.npa}
                        placeholder="NPA"
                        required
                    />
                    {formik.touched.location && formik.errors.location ? (
                        <div id="error">{formik.errors.location}</div>
                    ) : null}
                    <input
                        id="location"
                        name="location"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.location}
                        placeholder="Location"
                        required
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
                    <input
                        id="url"
                        name="url"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.url}
                        placeholder="Establishment url"
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};