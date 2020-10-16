import React from "react";


export default function Establishment(props) {
    const { id, name, latitude, longitude, address, url, estType, locId } = props;

    return (
        <div className="establishment">
            <h2>{name}</h2>
            <div>{address}</div>
            <a href={url}>{url}</a>
        </div>
    );
}