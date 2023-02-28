import { useState } from "react";
import { IoReceiptOutline } from "react-icons/io5";
import CustomTable from "../components/CustomTable";
import Pagination from "../components/Pagination";
import { UserCarts } from "../util/user-carts";


const Invoices = () => {

    const [activePage, setActivePage] = useState(1);

    return (
        <div className="p-4">

            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoReceiptOutline />
                <p>Facturas</p>
            </div>

            <div className="bg-white rounded p-4">
                <form action="">
                    <div className="flex items-center text-gray-500 mb-4">
                        <label className="w-3/12" htmlFor="invoice_prefix">Prefijo de la factura:</label>
                        <input className="ml-4 w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" name="invoice_prefix" id="invoice_prefix" type="text" />
                    </div>

                    <div className="flex items-center text-gray-500 mb-4">
                        <label className="w-3/12" htmlFor="year_invoice">Añadir el año actual en el nro de la factura:</label>
                        <select className="ml-4 w-full border border-red-400 rounded p-1 w-full focus:ring-main focus:border-main" name="year_invoice" id="year_invoice" type="text" >
                            <option value={true}>Si</option>
                            <option value={false}>No</option>
                        </select>
                    </div>

                    <div className="flex items-center text-gray-500 mb-4">
                        <label className="w-3/12" htmlFor="legal_text">Texto Legal Libre:</label>
                        <textarea
                            className="ml-4 w-full border-none bg-gray-100 rounded p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500"
                            name="legal_text"
                            id="legal_text"
                            type="number"
                        />
                    </div>

                    <div className="flex items-center text-gray-500 mb-4">
                        <label className="w-3/12" htmlFor="footer_text">Texto del pie de pagina:</label>
                        <textarea
                            className="ml-4 w-full border-none bg-gray-100 rounded p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500"
                            name="footer_text"
                            id="footer_text"
                            type="number"
                        />
                    </div>
                </form>
            </div>

            <CustomTable type="invoices" values={UserCarts} className="w-full my-12 text-gray-500 text-center bg-white" />

            <Pagination pages={10} activePage={activePage} onChange={setActivePage}></Pagination>
        </div>
    )
}

export default Invoices;