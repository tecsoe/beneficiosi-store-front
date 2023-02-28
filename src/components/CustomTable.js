import { IoEye, IoPrintOutline } from "react-icons/io5";
import { Link } from "react-router-dom";


const CustomTable = ({ values, className, type }) => {
    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full items-center font-bold">
                <div className="w-2/12 p-2">
                    <p>ID</p>
                    <input type="text" className="max-w-full border-gray-200 mt-2 rounded p-1" />
                </div>
                <div className="w-3/12 p-2">
                    <p>Cliente</p>
                    <input type="text" className="max-w-full border-gray-200 mt-2 rounded p-1" />
                </div>
                <div className="w-3/12 p-2">
                    {
                        type == "deliveryNotes" ?
                            <p>Direccion</p>
                            :
                            <p>Total</p>
                    }
                    <input type="text" className="max-w-full border-gray-200 mt-2 rounded p-1" />
                </div>
                <div className="w-3/12 p-2">
                    <p>Fecha</p>
                    <input type="text" className="max-w-full border-gray-200 mt-2 rounded p-1" />
                </div>
                <div className="w-1/12 p-2">
                    <button>
                        Buscar
                    </button>
                </div>
            </div>
            <div className="w-full text-center">
                {
                    values.map((value, i) => <div className="flex bg-white my-4 p-6 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
                        <div className="w-2/12">
                            {value.id}
                        </div>
                        <div className="w-3/12">
                            <Link to={`/users/${value.client.id}`} className="text-blue-500">
                                {value.client.name}
                            </Link>
                        </div>
                        <div className="w-3/12">
                            {
                                type == "deliveryNotes" ?
                                    <p>{value.client.address.address}</p>
                                    :
                                    <p>{value.currency.symbol} {value.products.reduce((total, product) => (product.price * product.quantity) + total, 0)}</p>
                            }
                        </div>
                        <div className="w-3/12">
                            {value.createdAt.toLocaleString()}
                        </div>
                        <div className="w-1/12">
                            <Link to={'/orders/12h3j1h'}>
                                {
                                    type == "invoices" ?
                                        <p className="cursor-pointer hover:text-main transition duration-300">
                                            <IoPrintOutline className="m-auto text-2xl" />
                                            Imprimir
                                        </p>
                                        :
                                        type == "carts" ?
                                            <IoEye className="m-auto text-2xl cursor-pointer hover:text-main transition duration-300" />
                                            :
                                            type == "deliveryNotes" ?
                                                <p className="cursor-pointer hover:text-main transition duration-300">
                                                    <IoPrintOutline className="m-auto text-2xl" />
                                                    Imprimir
                                                </p>
                                                :
                                                null
                                }
                            </Link>
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
    )
}

export default CustomTable;