import { IoClose, IoSearch, IoPencil } from "react-icons/io5";
import { Link } from "react-router-dom";

const PlacesTable = ({ places, className, onFiltersChange, filters, onDelete, findData }) => {

    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full items-center font-bold text-center px-4">
                <div className="w-3/12 p-2">
                    <p>ID</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="id"
                        value={filters?.id}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-3/12 p-2">
                    <p>Nombre</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="name"
                        value={filters?.name}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-3/12 p-2">
                    <p>Capacidad Total</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="categoryName"
                        value={filters?.capacity}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-3/12 p-2">
                    <button onClick={findData}>
                        <IoSearch /> Buscar
                    </button>
                </div>
            </div>
            <div className="w-full text-center px-4">
                {
                    places?.length > 0 ?
                        places.map((place, i) => <div key={i} className="flex flex-wrap bg-white my-4 p-6 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
                            <div className="w-3/12 p-2">
                                <p>{place.id}</p>
                            </div>
                            <div className="w-3/12 p-2">
                                <p>{place.name}</p>
                            </div>
                            <div className="w-3/12 p-2">
                                <p>{place?.capacity}</p>
                            </div>
                            <div className="w-3/12 p-2 flex items-center space-x-4 justify-center">
                                <Link to={`/places/${place.id}/edit`} className="text-yellow-500 text-2xl">
                                    <IoPencil />
                                </Link>
                                <button onClick={() => { onDelete(place) }} className="text-red-500 text-2xl">
                                    <IoClose />
                                </button>
                            </div>
                        </div>
                        )
                        :
                        <p className="text-red-500 py-8">
                            No hay lugares o sala
                        </p>
                }
            </div>
        </div>
    )
}

export default PlacesTable;