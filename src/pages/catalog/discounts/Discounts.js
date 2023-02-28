import { useEffect, useState } from "react";
import { IoFastFoodSharp, IoTime, IoArrowDownOutline, IoCheckmarkDoneSharp, IoBagCheckSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import CustomModal from "../../../components/CustomModal";
import DiscountsTable from "../../../components/DiscountsTable";
import Pagination from "../../../components/Pagination";
import { useAuth } from "../../../contexts/AuthContext";
import useDiscounts from "../../../hooks/useDiscounts";
import useAxios from "../../../hooks/useAxios";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const Discounts = () => {

    const { setLoading, setCustomAlert, user } = useAuth();

    const [filters, setFilters] = useState({
        page: 1,
        id: "",
        name: "",
        minValue: "",
        maxValue: "",
        minDate: "",
        maxDate: "",
        storeIds: [user?.storeId]
    });

    const [open, setOpen] = useState(false);

    const [discountToDelete, setDiscountToDelete] = useState(null);

    const [{ discounts, error: discountsError, loading: discountsLoading, numberOfPages }, getDiscounts] = useDiscounts({
        params: {
            ...filters,
            minDate: filters.minDate ? format(new Date(filters.minDate), "yyyy-MM-dd H:mm:ss") : "",
            maxDate: filters.maxDate ? format(new Date(filters.maxDate), "yyyy-MM-dd H:mm:ss") : "",
            storeIds: filters.storeIds.join(",")
        }
    });

    const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteDiscount] = useAxios({ url: `discounts/${discountToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    const [{data: discountsSummaryData}] = useAxios({url: `/summaries/store-discounts`}, {useCache: false});

    useEffect(() => {
        console.log(discountsSummaryData);
    }, [discountsSummaryData])

    useEffect(() => {
        if (deleteData !== undefined) {
            setCustomAlert({ show: true, message: "El descuento fue eliminado exitosamente.", severity: "success" });
            getDiscounts();
            setDiscountToDelete(null);
        }
    }, [deleteData])

    useEffect(() => {
        setLoading?.({ show: discountsLoading, message: "Cargando descuentos" });
    }, [discountsLoading]);

    useEffect(() => {
        if (discountsError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${discountsError?.response?.status === 400 ? discountsError?.response?.data.message[0] : discountsError?.response?.data.message}.`, severity: "error" });
        }

        if (deleteLoading) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteLoading?.response?.status === 400 ? deleteLoading?.response?.data.message[0] : deleteLoading?.response?.data.message}.`, severity: "error" });
        }
    }, [discountsError, deleteLoading]);

    const handleClearFilters = () => {
        setFilters({
            id: "",
            name: "",
            minValue: "",
            maxValue: "",
            minDate: "",
            maxDate: "",
            storeIds: [user?.storeId]
        })
    }

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

    const handleDelete = (discount) => {
        setDiscountToDelete(discount);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        setOpen(false);

        if (e) {
            setLoading({ show: true, message: "Eliminando descuento" });
            await deleteDiscount();
            setLoading({ show: false, message: "" });
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoArrowDownOutline />
                <p>Descuentos</p>
            </div>

            <div className="text-right mb-4">
                <Link to={`/catalog/discounts/create`}>
                    <Button>
                        Crear Descuento
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded p-4 mb-4">
                <h1 className="text-3xl">Mejor descuento:</h1>

                <div className="flex mt-4">
                    <div className="w-1/3">
                        <h1 className="text-2xl mb-4 text-gray-500">{discountsSummaryData?.bestDiscount?.name}</h1>
                        <img className="w-1/3" src={`${process.env.REACT_APP_API_URL}/${discountsSummaryData?.bestDiscount?.imgPath}`} alt={discountsSummaryData?.bestDiscount?.name} />
                    </div>
                    <div className="w-1/3">
                        <h1 className="mb-4 text-gray-500"><IoTime className="inline text-xl text-main" /> Empezó el: {discounts?.[0]?.from ? format(new Date(discountsSummaryData?.bestDiscount?.from), "dd/MM/yyyy") : ""}</h1>
                        <h1 className="mb-4 text-gray-500"><IoCheckmarkDoneSharp className="inline text-xl text-main" /> Finalizó o finalizara el: {discounts?.[0]?.until ? format(new Date(discountsSummaryData?.bestDiscount?.until), "dd/MM/yyyy") : ""}</h1>
                        <h1 className="mb-4 text-gray-500"><IoBagCheckSharp className="inline text-xl text-green-500" /> Compras finalizadas: {discountsSummaryData?.ordersCount}</h1>
                    </div>
                    <div className="w-1/3">
                        <h1 className="my-8  text-main text-3xl">
                            <IoTime className="inline" />Tiempo restante:
                            <span className="ml-2 capitalize">
                                {
                                    discountsSummaryData?.bestDiscount?.until ?
                                        <>
                                            {
                                                formatDistanceToNow(
                                                    new Date(discountsSummaryData?.bestDiscount?.until),
                                                    {
                                                        locale: es
                                                    }
                                                )
                                            }
                                        </>
                                        :
                                        "Sin información"
                                }
                            </span>
                        </h1>
                    </div>
                </div>
            </div>

            <DiscountsTable discounts={discounts} filters={filters} onClearFilters={handleClearFilters} onFiltersChange={handleChange} onDelete={handleDelete} className="bg-white" />

            <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />

            <CustomModal message={`Desea eliminar el descuento ${discountToDelete?.name}`} open={open} onClose={handleConfirmDelete} />
        </div>
    )
}

export default Discounts;