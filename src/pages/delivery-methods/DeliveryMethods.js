import { FiTruck } from "react-icons/fi";
import DeliveryTable from "../../components/DeliveryTable";
import Pagination from "../../components/Pagination";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import Button from "../../components/Button";
import useDeliveryMethods from "../../hooks/useDeliveryMethods";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CustomModal from "../../components/CustomModal";
import useDeliveryTypes from "../../hooks/useDelyveryTypes";
import useAxios from "../../hooks/useAxios";

const DeliveryMethods = () => {

    const { setLoading, setCustomAlert, user } = useAuth();

    const [filters, setFilters] = useState({ id: "", name: "", page: 1, storeId: user?.storeId, deliveryMethodTypeCode: "" });
    const [canFilter, setCanFilter] = useState(false);
    const [deleteDeliveryMethod, setDeleteDeliveryMethod] = useState(null);

    const [{ deliveryMethods, loading, size, numberOfPages, error }, getDeliveryMethods] = useDeliveryMethods({ params: { ...filters }, options: { manual: true } });
    const [{ deliveryTypes, error: deliveryTypesError }, getDeliveryTypes] = useDeliveryTypes({ options: { manual: true } });

    const [{ data, error: deleteError }, deleteSelectedDeliveryMethod] = useAxios({ url: `/delivery-methods/${deleteDeliveryMethod?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setLoading({ show: true, message: "Cargando datos" });
        Promise.all([getDeliveryMethods(), getDeliveryTypes()]).then((values) => {
            setLoading({ show: false, message: "" });
            setCanFilter(true);
        })
    }, []);

    useEffect(() => {
        if (canFilter) {
            setLoading({ show: loading, message: "Obteniendo Datos" });
        }
    }, [loading])

    useEffect(() => {
        if (data !== undefined) {
            getDeliveryMethods().then(() => {
                setCustomAlert({ show: true, message: "El metodo de envio ha sido eliminado exitosamente.", severity: "success" });
            })
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (deliveryTypesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deliveryTypesError?.response?.status === 400 ? deliveryTypesError?.response?.data.message[0] : deliveryTypesError?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
        }
    }, [error, deliveryTypesError, deleteError]);

    useEffect(() => {
        if (canFilter) {
            getDeliveryMethods();
        }
    }, [filters.page])

    useEffect(() => {
        console.log(deliveryMethods);
    }, [deliveryMethods])


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

    const handleDelete = (deleteDeliveryMethod) => {
        setDeleteDeliveryMethod(deleteDeliveryMethod);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        if (e) {
            setOpen(false);
            setLoading({ show: true, message: "Eliminando metodo de envio" });
            await deleteSelectedDeliveryMethod();
            setLoading({ show: false, message: "" });
        } else {
            setOpen(false)
            setDeleteDeliveryMethod(null);
        }
    }

    const handleFilter = () => {
        getDeliveryMethods();
    }

    return (
        <div className="p-4">
            <div className="flex items-center text-3xl text-gray-500 mb-18">
                <FiTruck className="mr-4" />
                <p>Empresas de envio</p>
            </div>

            <div className="text-right">
                <Button className="mb-4" to={"/configuration/delivery-methods/create"}>
                    <IoAdd className="text-2xl" />
                    Añadir Nuevo
                </Button>
            </div>

            <DeliveryTable onClickFilter={handleFilter} deliverMethodsTypes={deliveryTypes} onDelete={handleDelete} filtersValues={filters} onFiltersChange={handleChange} className="bg-white mb-4" companies={deliveryMethods} />

            <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />

            <CustomModal message={`Desea eliminar la empresa ${deleteDeliveryMethod?.name}`} open={open} onClose={handleConfirmDelete} />

        </div>
    )
}

export default DeliveryMethods;