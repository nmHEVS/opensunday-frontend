import React from "react";


export default function EstablishmentType(props) {
    const { id, typeName } = props;

    return (
        <div className="location">
            <div>{typeName}</div>
        </div>
    );
}