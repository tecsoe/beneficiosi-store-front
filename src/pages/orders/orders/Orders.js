import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoDocumentTextSharp } from "react-icons/io5";
import OrdersTable from "../../../components/OrdersTable";
import Pagination from "../../../components/Pagination";
import Rings from "../../../components/Rings";
import { useAuth } from "../../../contexts/AuthContext";
import useOrders from "../../../hooks/useOrders";
import useOrdersStatuses from "../../../hooks/useOrdersStatuses";
import usePayMethods from "../../../hooks/usePayMethods";

const Orders = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({
        page: 1,
        orderNumber: "",
        address: "",
        storeName: "",
        minTotal: "",
        maxTotal: "",
        minDate: "",
        maxDate: "",
        orderStatusCode: "",
        paymentMethodCode: "",
        sort: "createdAt,DESC"
    });

    const [{ orders, error: ordersError, loading: ordersLoading, numberOfPages }, getOrders] = useOrders({ axiosConfig: { params: { ...filters } } });

    const [{ payMethods, error: payMethodsError, loading: payMethodsLoading }, getPayMethods] = usePayMethods();

    const [{ ordersStatuses, error: ordersStatusesError, loading: ordersStatusesLoading }, getOrdersStatuses] = useOrdersStatuses();

    const [{ data: ordersCount }] = useAxios({ url: `/orders/orders-count` }, { useCache: false });

    useEffect(() => {
        setLoading({ show: ordersLoading, message: "Obteniendo ordenes" });
    }, [ordersLoading])

    useEffect(() => {

        if (ordersError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${ordersError?.response?.status === 400 ? ordersError?.response?.data.message[0] : ordersError?.response?.data.message}.`, severity: "error" });
        }

        if (payMethodsError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${payMethodsError?.response?.status === 400 ? payMethodsError?.response?.data.message[0] : payMethodsError?.response?.data.message}.`, severity: "error" });
        }

        if (ordersStatusesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${ordersStatusesError?.response?.status === 400 ? ordersStatusesError?.response?.data.message[0] : ordersStatusesError?.response?.data.message}.`, severity: "error" });
        }
    }, [ordersError, payMethodsError, ordersStatusesError]);


    useEffect(() => {
        getOrders();
    }, [filters])

    useEffect(() => {
        console.log(orders);
    }, [orders])

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            if (e.target.name !== "page") {
                return {
                    ...oldFilters,
                    [e.target.name]: e.target.value,
                    page: 1
                }
            }
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            orderNumber: "",
            address: "",
            clientName: "",
            minTotal: "",
            maxTotal: "",
            minDate: "",
            maxDate: "",
            orderStatusCode: "",
            paymentMethodCode: "",
            sort: "createdAt,DESC"
        })
    }

    return (
        <div className="p-4">

            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoDocumentTextSharp />
                <p >Ordenes</p>
            </div>

            <div className="bg-white rounded py-8">
                <div className="flex justify-between px-48">
                    <Rings color="main" title="Canceladas" value={ordersCount?.canceled} size="small"></Rings>
                    <Rings color="warning" title="En Proceso" value={ordersCount?.processing} size="small"></Rings>
                    <Rings color="success" title="Finalizadas" value={ordersCount?.completed} size="small"></Rings>
                </div>
            </div>

            <OrdersTable
                onClearFilters={handleClearFilters}
                options={{ payMethods: payMethods, orderStatuses: ordersStatuses }}
                values={{ ...filters }}
                onFiltersChange={handleChange}
                orders={orders}
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

export default Orders;