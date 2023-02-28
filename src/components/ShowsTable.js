import { IoClose, IoSearch, IoPencil } from "react-icons/io5";
import { Link } from "react-router-dom";

const ShowsTable = ({ shows, className, onFiltersChange, filters, onDelete, findData }) => {

    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full items-center font-bold text-center px-4">
                <div className="w-2/12 p-2">
                    <p>ID</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="id"
                        value={filters?.id}
                        className="w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-4/12 p-2">
                    <p>Nombre</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="name"
                        value={filters?.name}
                        className="w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-4/12 p-2">
                    <p>categorias</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="name"
                        value={filters?.place}
                        className="w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-2/12 p-2">
                    <button onClick={findData}>
                        <IoSearch /> Buscar
                    </button>
                </div>
            </div>
            <div className="w-full text-center px-4">
                {
                    shows?.length > 0 ?
                        shows.map((show, i) => {
                            return (
                                <div key={i} className="flex flex-wrap bg-white my-4 p-6 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
                                    <div className="text-center w-2/12 p-2">
                                        <p>{show.id}</p>
                                    </div>
                                    <div className="text-center w-4/12 p-2">
                                        <Link to={`/shows/${show?.id}/edit`} className="hover:text-main">
                                            {
                                                show?.productImages?.[0].path &&
                                                <img className="w-24 h-28 m-auto rounded shadow-xl mb-4" src={`${process.env.REACT_APP_API_URL}/${show?.productImages?.[0].path}`} alt="" />

                                            }
                                            <p>{show.name}</p>
                                        </Link>
                                    </div>
                                    <div className="text-center w-4/12 p-2">
                                        <p>{show?.categories?.map(category => category?.name).join(', ')}</p>
                                    </div>
                                    <div className="text-center w-2/12 p-2 flex items-center space-x-4 justify-center">
                                        <Link to={`/shows/${show?.id}/edit`} className="text-yellow-500 text-2xl">
                                            <IoPencil />
                                        </Link>
                                        <button onClick={() => { onDelete(show) }} className="text-red-500 text-2xl">
                                            <IoClose />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <p className="text-red-500 py-8">
                            No hay shows.
                        </p>
                }
            </div>
        </div>
    )
}

export default ShowsTable;