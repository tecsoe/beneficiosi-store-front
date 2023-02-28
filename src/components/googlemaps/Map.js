import { Loader } from "@googlemaps/js-api-loader"
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";


const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ['drawing', 'geometry', 'places', 'visualization']
});

const Map = ({ searchBox, onClick, markers, options }) => {


    const [mapApi, setMapApi] = useState(null);

    const [map, setMap] = useState(null);

    const [autoCompleteInput, setAutoCompleteInput] = useState(null);

    const [actualMarkers, setActualMarkers] = useState([]);

    const mapRef = useRef(null);

    const searchRef = useRef(null);

    useEffect(() => {
        loader.load().then((response) => {
            setMapApi(response);
        });
    }, []);

    useEffect(() => {
        if (mapApi && mapRef.current) {
            setMap(new mapApi.maps.Map(mapRef.current, {
                center: options.center,
                zoom: options.zoom,
            }))
        }
    }, [mapApi, mapRef.current]);

    useEffect(() => {
        if (mapApi && searchRef.current) {
            setAutoCompleteInput(new mapApi.maps.places.Autocomplete(searchRef.current, {
                types: ['geocode'],
                componentRestrictions: { country: 'ar' },
                fields: ['geometry', 'formatted_address']
            }));

        }
    }, [mapApi, searchRef.current])

    useEffect(() => {
        if (autoCompleteInput) {
            autoCompleteInput.addListener("place_changed", () => {
                const { geometry, formatted_address } = autoCompleteInput.getPlace();
                const position = {
                    lat: geometry.location.lat(),
                    lng: geometry.location.lng(),
                };

                searchBox.onChange({ target: { value: formatted_address, name: searchBox.name, type: "text" } });
                onClick({ lat: geometry.location.lat(), lng: geometry.location.lng() });
            });
        }
    }, [autoCompleteInput])


    useEffect(() => {
        if (map) {
            map.setZoom(options.zoom);
            map.setCenter(options.center);
        }
    }, [options, map])

    useEffect(() => {
        if (map) {
            map.addListener('click', (e) => {
                onClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            })
        }
    }, [map]);

    useEffect(() => {
        if (markers && mapApi && map) {
            actualMarkers.map((actualMarker, i) => {
                actualMarker.setMap(null);
            });
            setActualMarkers([]);
            markers.map((marker, i) => {
                let newMarker = new mapApi.maps.Marker({
                    animation: mapApi.maps.Animation.DROP,
                    position: new mapApi.maps.LatLng(marker.lat, marker.lng)
                });
                newMarker.setMap(map)
                setActualMarkers([...actualMarkers, newMarker]);
            });
        }
    }, [markers, mapApi, map]);


    return (
        <div>
            {
                mapApi ?
                    <div>
                        {searchBox ?
                            <div>
                                <div>
                                    {searchBox.label}
                                </div>
                                <input
                                    className="w-full rounded"
                                    ref={searchRef}
                                    onChange={searchBox.onChange}
                                    value={searchBox.value}
                                    name={searchBox.name}
                                    type="text" />
                            </div>

                            :
                            null
                        }
                        <div className="cursor-pointer rounded shadow-xl h-[50vh] w-full mt-4" ref={mapRef}>

                        </div>
                    </div>
                    :
                    <div>
                        Cargando el mapa...
                    </div>
            }
        </div>
    )
}

export default Map;