import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { useState } from "react";
import Button from "./Button";
import HeartIcon from "./HeartIcon";
import LocationMarker from "./LocationMarker";
import PhoneIcon from "./PhoneIcon";
import ShareIcon from "./ShareIcon";
import StarIcon from "./StarIcon";

const MapContainer = ({google, height = 500, stores}) => {
  const [selectedStore, setSelectedStore] = useState(null);
  
  return <Map
    google={google}
    zoom={12}
    containerStyle={{
      position: 'relative',  
      width: '100%',
      height: `${height}px`,
    }}
    initialCenter={{lat: -34.605349, lng: -58.478619}}
  >
    {stores?.map((store, i) => <Marker
      key={i}
      title={store.name}
      position={store.latLng}
      onClick={() => setSelectedStore(store)}
    />)}

    {selectedStore && <div className="absolute right-0 top-0 w-64 h-full p-4 bg-white">
      <div className="flex justify-center relative">
        <img
          src={selectedStore.imgSrc}
          alt={selectedStore.imgAlt}
          className="w-40 h-40"
        />
        <button
          className="absolute right-0 w-6 h-6 inline-flex items-center justify-center text-3xl bg-gray-200 hover:bg-gray-300 rounded focus:outline-none"
          onClick={() => setSelectedStore(null)}
        >
          &times;
        </button>
      </div>
      
      <div className="flex flex-col space-y-5 mt-3">
        <h4 className="font-semibold">{selectedStore.name}</h4>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(n => <StarIcon
            key={n}
            className="w-5 h-5 text-yellow-400"
          />)}
        </div>

        <div className="flex justify-around text-blue-500">
          <a href="/#" className="inline-flex flex-col items-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 border border-blue-500 rounded-full">
              <ShareIcon
                className="w-5 h-5"
              />
            </div>
            <span>Compartir</span>
          </a>
          
          <a href="/#" className="inline-flex flex-col items-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 border border-blue-500 rounded-full">
              <HeartIcon
                className="w-5 h-5"
              />
            </div>
            <span>Favoritos</span>
          </a>
        </div>

        <div className="flex items-center space-x-2">
          <LocationMarker className="w-5 h-5 text-blue-500" />
          <span className="text-xs">Av. Rivadavia 5730, 1406 CABA</span>
        </div>

        <div className="flex items-center space-x-2">
          <PhoneIcon className="w-5 h-5 text-blue-500" />
          <span className="text-xs">+54 11 68647086</span>
        </div>

        <Button
          color="main"
          className="w-full"
          to="/stores/nombre-de-la-tienda"
        >
          Ir a la tienda
        </Button>
      </div>
    </div>}
  </Map>;
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);