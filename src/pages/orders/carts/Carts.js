import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoCartOutline, IoCashOutline } from "react-icons/io5";
import CartsTable from "../../../components/CartsTable";
import Pagination from "../../../components/Pagination";
import { useAuth } from "../../../contexts/AuthContext";
import useCarts from "../../../hooks/useCarts";



const Carts = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({
        page: 1,
        id: "",
        clientName: "",
        minTotal: "",
        maxTotal: "",
        minDate: "",
        maxDate: "",
        isProcessed: "",
        isDirectPurchase: "",
    });

    const [{ carts, error: cartsError, loading, numberOfPages }, getCarts] = useCarts({ axiosConfig: { params: { ...filters } } });

    const [{ data: cartSummary, error: cartSummaryError, loading: cartSummaryLoading }] = useAxios({ url: `/carts/summary` }, { useCache: false });



    useEffect(() => {
        console.log(carts);
        console.log(cartSummary);
    }, [carts, cartSummary])

    useEffect(() => {
        if (cartsError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cartsError?.response?.status === 400 ? cartsError?.response?.data.message[0] : cartsError?.response?.data.message}.`, severity: "error" });
        }
    }, [cartsError]);

    useEffect(() => {
        setLoading({ show: loading, message: "Obteniendo tus carritos" })
    }, [loading])

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            if (e.target.name !== "page") {
                return {
                    ...oldFilters,
                    [e.target.name]: e.target.value === 'null' ? '' : e.target.value,
                    page: 1
                }
            }
            return {
                ...oldFilters,
                [e.target.name]: e.target.value === 'null' ? '' : e.target.value,
            }
        })
    }

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            id: "",
            clientName: "",
            minTotal: "",
            maxTotal: "",
            minDate: "",
            maxDate: "",
            isProcessed: "",
            isDirectPurchase: "",
        })
    }
    return (
        <div className="p-4">

            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoCartOutline />
                <p>Carritos</p>
            </div>

            <div className="bg-white rounded p-4">
                <div className="flex">
                    <div className="w-1/3">
                        <div className="flex items-center mb-4 text-gray-500 text-xl">
                            <IoCashOutline className="mr-4" />
                            <h1>Valor promedio de los carritos</h1>
                        </div>
                        <p className="text-green-500 text-4xl">${cartSummary?.totalAverage}</p>
                    </div>
                    <div className="w-1/3">
                        <div className="flex items-center mb-4 text-gray-500 text-xl">
                            <IoCashOutline className="mr-4" />
                            <h1>Valor promedio de los carritos con descuento</h1>
                        </div>
                        <p className="text-green-500 text-4xl">${cartSummary?.totalAverageWithDiscount}</p>
                    </div>
                    <div className="w-1/3">
                        <div className="flex items-center mb-4 text-gray-500 text-xl">
                            <IoCartOutline className="mr-4" />
                            <h1>Carritos de esta semana</h1>
                        </div>
                        <p className="text-main text-4xl">{cartSummary?.numberOfCartsThisWeek}</p>
                    </div>
                </div>
            </div>

            <CartsTable
                onClearFilters={handleClearFilters}
                values={{ ...filters }}
                onFiltersChange={handleChange}
                carts={carts}
                className="w-full my-12 text-gray-500 text-center bg-white" />

            {
                numberOfPages > 0 ?
                    <Pagination
                        pages={numberOfPages}
                        activePage={filters.page}
                        onChange={e => { handleChange({ target: { name: "page", value: e } }) }}
                    />
                    :
                    null
            }
        </div>
    )
}

export default Carts;