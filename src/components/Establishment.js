import React, {useEffect} from "react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import {Map, Marker, TileLayer} from "react-leaflet";
import {EmailShareButton, EmailIcon, TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon} from "react-share";
import {CopyToClipboard} from "react-copy-to-clipboard";



export default function Establishment(props) {
    const { id, name, latitude, longitude, address, url, establishmentTypeId, locationId} = props;
    const pageUrl = window.location.href
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    let [estTypeName, setEstTypeName] = useState();
    let [dist, setDist] = useState();

    const [editMode, setEditMode] = useState([]);

    useEffect(() => {

        const currentLat = 46.282725;
        const currentLong = 7.538253;

        function getDistanceFromLatLonInKm() {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(latitude-currentLat);  // deg2rad below
            var dLon = deg2rad(longitude-currentLong);
            var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(currentLat)) * Math.cos(deg2rad(latitude)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            d = (Math.round(d*1000))/1000;
            setDist(d);
        }

        async function getEstablishmentTypes() {
            console.log("type id : "+establishmentTypeId)
            let establishmentType = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentType}${establishmentTypeId}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setEstTypeName(establishmentType.establishmentTypeName);
        }
        getEstablishmentTypes();
        setEditMode(false);
        getDistanceFromLatLonInKm();
    }, []);

    function switchToEdit() {
        setEditMode(!editMode);
        console.log(editMode);
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
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
            <div>Id : {id}</div>
            <h2>Name : {name}</h2>
            <CopyToClipboard text={pageUrl}>
                <button>Copy URL to the clipboard</button>
            </CopyToClipboard>
            <div>
                <EmailShareButton
                    subject={name}
                    body={"Hi,\nI just discovered this amazing establishment : " + name + ", on the app OpenSunday \nIt's open on Sunday !\n\n" }
                    url={pageUrl}
                    className={"shareButton"}>
                    <EmailIcon size={32} round />
                </EmailShareButton>
                <FacebookShareButton
                    url={pageUrl}
                    quote={name}
                    className="Demo__some-network__share-button"
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={pageUrl}
                    title={name}
                    className="shareButton"
                >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </div>
            <div>Latitude : {latitude}</div>
            <div>Longitude : {longitude}</div>
            <div>Address : {address}</div>
            <div>Distance from me : {dist} Km</div>
            <a href={url}>{url}</a>
            <div>Est type id : {establishmentTypeId}</div>
            <div>Loc id : {locationId}</div>
            <div>Est Type name : {estTypeName}</div>
            <Map id="establishmentListMap" center={[ latitude , longitude]} zoom={16}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                    <Marker
                        position={[latitude, longitude]}
                    >
                    </Marker>
            </Map>
        </div>
    );
}