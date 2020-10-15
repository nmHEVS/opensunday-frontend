import React from "react";


export default function Establishment(props) {
    const { id, name, lat, long, address, url, estType, locId } = props;

    return (
        <div className="establishment">
            <h2>{name}</h2>
            <div>{address}</div>
            <div>{url}</div>
            <div>{estType}</div>
        </div>
    );
}