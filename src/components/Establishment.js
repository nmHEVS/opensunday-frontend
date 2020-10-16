import React from "react";


export default function Establishment(props) {
    const { id, name, latitude, longitude, address, url, estType, locId } = props;

    return (
        <div className="establishment">
            <h2>{name}</h2>
            <div>id : {id}</div>
            <div>{address}</div>
            <div>{latitude}</div>
            <div>{longitude}</div>
            <a href={url}>{url}</a>
        </div>
    );
}