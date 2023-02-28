import { useEffect } from "react";
import { useState } from "react";
import { IoClipboardSharp } from "react-icons/io5";
import CustomTable from "../components/CustomTable";
import Pagination from "../components/Pagination";
import useDeliveryNotes from "../hooks/useDeliveryNotes";
import { UserCarts } from "../util/user-carts";


const DeliveryNotes = () => {

    const [activePage, setActivePage] = useState(1);

    const [{ deliveryNotes, error, loading, total, size, numberOfPages }, getDeliveryNotes] = useDeliveryNotes();

    useEffect(() => {
        console.log(deliveryNotes);
    }, [deliveryNotes])

    return (
        <div className="p-4">

            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoClipboardSharp />
                <p>Albaranes de entrega</p>
            </div>

            <div className="bg-white rounded p-4">
                <form action="">
                    <div className="flex items-center text-gray-500 mb-4">
                        <label className="w-3/12" htmlFor="invoice_prefix">Prefijo de la factura:</label>
                        <input className="ml-4 w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" name="invoice_prefix" id="invoice_prefix" type="text" />
                    </div>

                    <div className="flex items-center text-gray-500 mb-4">
                        <label className="w-3/12" htmlFor="invoice_start">Comenzar desde la nro:</label>
                        <input
                            className="ml-4 w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500"
                            name="invoice_start"
                            id="invoice_start"
                            type="number"
                        />
                    </div>
                </form>
            </div>

            <CustomTable type="deliveryNotes" values={UserCarts} className="w-full my-12 text-gray-500 text-center bg-white" />

            <Pagination pages={10} activePage={activePage} onChange={setActivePage}></Pagination>
        </div>
    )
}

export default DeliveryNotes;