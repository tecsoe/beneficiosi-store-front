import { useParams } from 'react-router-dom';
import { IoCartOutline, IoDocumentTextOutline, IoCloudDownloadSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import useAxios from '../../../hooks/useAxios';
import Button from '../../../components/Button';
import OptionsModal from '../../../components/OptionsModal';
import useOrdersStatuses from '../../../hooks/useOrdersStatuses';
import PrintOrderComponent from '../../../components/PrintOrderComponent';
import DeliveryNoteModal from '../../../components/DeliveryNoteModal';
import SubjectErrorModal from '../../../components/SubjectErrorModal';

const OrderEdit = () => {

    const params = useParams();

    const { setLoading, setCustomAlert } = useAuth();

    const [deliveryError, setDeliveryError] = useState({ status: null, open: false });

    const [print, setPrint] = useState(false);

    const [order, setOrder] = useState(null);

    const [open, setOpen] = useState(false);

    const [openDeliveryNoteModal, setOpenDeliveryNoteModal] = useState({ open: false, deliveryMethod: null });

    const [{ data: orderData, error: orderError, loading: orderLoading }, getOrder] = useAxios({ url: `/orders/${params?.id}` }, { useCache: false });

    const [{ data: updateData, error: updateError }, updateOrder] = useAxios({ url: `/orders/${params?.id}/status`, method: "PUT" }, { manual: true, useCache: false });

    const [{ data: deliveryNoteData, error: deliveryNoteError }, createDeliveryNote] = useAxios({ url: "delivery-notes", method: "POST" }, { useCache: false, manual: true });

    const [{ ordersStatuses, error: ordersStatusesError, loading: orderStatusesLoading }, getOrdersStatuses] = useOrdersStatuses({ axiosConfig: { params: { allowedByCodeAndRole: `${order?.orderStatus?.code},STORE` } }, options: { manual: true, useCache: false } });

    useEffect(() => {
        if (order) {
            getOrdersStatuses({ params: { allowedByCodeAndRole: `${order?.orderStatus?.code},STORE` } })
            console.log(order);
        }
    }, [order])

    useEffect(() => {
        if (deliveryNoteData) {
            console.log(deliveryNoteData);
        }
    }, [deliveryNoteData])

    useEffect(() => {
        if (updateData) {
            setLoading?.({ show: false, message: "" });
            setOrder(updateData);
            setCustomAlert?.({ show: true, message: "El estado ha sido actualizado exitosamente.", severity: "success" });
        }
    }, [updateData])


    useEffect(() => {
        if (orderError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${orderError?.response?.status === 400 ? orderError?.response?.data.message[0] : orderError?.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }

        if (ordersStatusesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${ordersStatusesError?.response?.status === 400 ? ordersStatusesError?.response?.data.message[0] : ordersStatusesError?.response?.data.message}.`, severity: "error" });
        }

        if (deliveryNoteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deliveryNoteError?.response?.status === 400 ? deliveryNoteError?.response?.data.message[0] : deliveryNoteError?.response?.data.message}.`, severity: "error" });
        }
    }, [orderError, ordersStatusesError, updateError, deliveryNoteError]);

    useEffect(() => {
        setLoading?.({ show: orderLoading, message: "Obteniendo informacion del pedido" });
    }, [orderLoading])

    useEffect(() => {
        if (orderData) {
            setOrder(orderData);
        }
    }, [orderData]);

    const handleClose = async (e) => {
        setOpen(false);
        if (e) {
            if (e.code === "ors-005") {
                setOpenDeliveryNoteModal({ deliveryMethod: e, open: true });
                return;
            }

            if (e.code === "ors-006") {
                setDeliveryError({ status: e, open: true });
                return;
            }


            setLoading?.({ show: true, message: "Actualizando orden" });
            await updateOrder({ data: { orderStatusCode: e.code } })
            setLoading?.({ show: false, message: "" });
        }
    }

    const handleCloseDeliveryNoteModal = (e) => {
        setOpenDeliveryNoteModal({ open: false, deliveryMethod: null });
        if (e) {
            setLoading({ show: true, message: "Actualizando el estado." });
            Promise.all([
                updateOrder({ data: { orderStatusCode: e.code } }),
                createDeliveryNote({
                    data: {
                        url: e.url,
                        trackingNumber: e.trackingNumber,
                        orderId: params?.id
                    }
                })
            ]).then((values) => {
                setLoading({ show: false, message: "" });
            })
        }
    }

    const handleCloseSubjectModal = async (e) => {
        setDeliveryError((oldDeliveryError) => {
            return {
                ...oldDeliveryError,
                open: false
            }
        });

        if (e) {
            setLoading?.({ show: true, message: "Actualizando orden" });
            await updateOrder({ data: { orderStatusCode: deliveryError?.status?.code, reason: e } })
            setLoading?.({ show: false, message: "" });
        }
    }

    const handlePrint = () => {
        setPrint((oldPrint) => !oldPrint);
    }

    return (
        <div className="p-8">
            <div>
                <h1 className="text-4xl text-gray-500 font-bold">Detalles de la Orden</h1>
                <div className="text-right">
                    <Button onClick={handlePrint}>
                        Imprimir
                    </Button>
                </div>

                {/*Referencia. */}
                <div className="bg-white rounded text-xl p-4 my-4 text-gray-500">
                    Referencia de la orden <span className="font-bold">{order?.orderNumber}</span> - Realizado el {order?.createdAt}
                </div>

                {/*Tipo de envio y tipo de pago. */}
                <div className="bg-white rounded text-xl p-4 my-4 text-gray-500">
                    <div className="flex items-center space-x-2">
                        <p className="my-2">Metodo de Envio: <b>{order?.deliveryMethod?.name}</b></p>
                        {
                            order?.deliveryMethod?.imgPath &&
                            <img className="w-12 h-12 rounded" src={`${process.env.REACT_APP_API_URL}/${order?.deliveryMethod?.imgPath}`} />
                        }
                    </div>

                    <div className="flex items-center space-x-2">
                        <p className="my-2">Metodo de Pago: <b className="capitalize">{order?.paymentMethod?.name}</b></p>
                        {
                            order?.deliveryMethod?.imgPath &&
                            <img className="w-12 h-12 rounded" src={`${process.env.REACT_APP_API_URL}${order?.paymentMethod?.imgPath}`} />
                        }
                    </div>
                </div>

                {/*Informacion de Pago */}
                <div className="flex items-start justify-between bg-white rounded text-lg p-8 my-4 text-gray-500">
                    <div>
                        <h2>Historial de la orden:</h2>
                        {
                            order?.orderStatusHistory?.map((status, i) => {
                                return (
                                    <div key={i} className="space-x-4 flex items-center">
                                        <div
                                            style={{ backgroundColor: status?.newOrderStatus?.color }}
                                            className="px-4 text-white my-1 py-1 capitalize rounded">
                                            {status?.newOrderStatus?.name}
                                        </div>
                                        <div>
                                            {status?.createdAt}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            order?.orderRejectionReason &&
                            <div className="text-gray-500 mt-8">
                                <span className="text-gray-500 font-bold">Razon del rechazo:</span> {order?.orderRejectionReason?.reason}
                            </div>
                        }
                        <div>

                        </div>
                    </div>
                    <div>
                        {
                            order?.orderStatus?.code === "ors-001" && order?.paymentMethod?.code === "pym-002" ?
                                <div className="text-gray-500 font-bold">
                                    Espere a que BeneficioSi confirme el pago.
                                </div>
                                :
                                orderStatusesLoading ?
                                    "Cargando..."
                                    :
                                    ordersStatuses.length > 0 && order?.orderStatus?.code !== "ors-008" && order?.orderStatus?.code !== "ors-005" ?
                                        <Button className="mt-2" onClick={() => { setOpen(true) }}>
                                            Cambiar estado
                                        </Button>
                                        :
                                        null
                        }
                    </div>
                </div>

                <div className="bg-white rounded text-lg p-8 my-4 text-gray-500 flex items-center space-x-4">
                    <h2>Cliente:</h2>
                    <div className="text-center">
                        {
                            order?.user?.imgPath &&
                            <img className="m-auto h-16 w-16 rounded-full" src={`${process.env.REACT_APP_API_URL}/${order?.user?.imgPath}`} alt="" />
                        }
                        <p>
                            {order?.user?.name}
                        </p>
                    </div>
                </div>


                {/*Direccion de Envio */}
                <div className="bg-white rounded text-lg p-4 my-4 text-gray-500">
                    <h1>Direccion de envio:</h1>
                    <div className="flex items-center space-x-4">
                        <p>
                            <b>{order?.delivery?.profileAddress?.name}</b> - {order?.delivery?.profileAddress?.address}
                        </p>
                    </div>
                </div>

                {/*Productos */}
                <div className="bg-white rounded text-lg p-4 my-4 text-gray-500">
                    <h1 className="flex items-center text-2xl my-4">
                        <IoCartOutline className="mr-2" />  Productos <span className=" ml-4 border rounded-full h-[38px] w-[40px] text-center">{order?.cart?.cartItems?.length}</span>
                    </h1>

                    <table className="w-2/3 text-center">
                        <thead className="border-b">
                            <tr>
                                <th>
                                    imagen
                                </th>
                                <th>
                                    productos
                                </th>
                                <th>
                                    Precio Unitario
                                </th>
                                <th>
                                    Cantidad
                                </th>
                                <th>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                order?.cart?.cartItems?.map((product, i) => {
                                    return (
                                        <tr key={i}>
                                            <th>
                                                <img className="w-[70px] h-[70px] m-auto" src={`${process.env.REACT_APP_API_URL}/${product.productImage}`} alt="" />
                                            </th>
                                            <th>
                                                {product.productName}
                                            </th>
                                            <th>
                                                $ {product.total.toLocaleString()}
                                            </th>
                                            <th>
                                                {product.quantity.toLocaleString()}
                                            </th>
                                            <th>
                                                $ {(product.total * product.quantity).toFixed(2)}
                                            </th>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <div className="text-right my-8 px-8">
                        <p className="my-4"><span className="font-bold">Productos: </span>${order?.cart?.subTotal}</p>
                        <p className="my-4"><span className="font-bold">Envio:</span> {order?.delivery?.total > 0 ? `$${order?.delivery?.total}` : "Gratis"}</p>
                        <p className="my-4"><span className="font-bold">Total:</span> $ {order?.total}</p>
                    </div>
                </div>

                <div className="bg-white rounded text-lg p-4 my-4 text-gray-500 space-y-4">
                    <h1>Datos de envio: </h1>
                    {
                        order?.deliveryNote ?
                            <div>
                                <p>
                                    <b>Numero de traking:</b> {order?.deliveryNote?.trackingNumber ? order?.deliveryNote?.trackingNumber : 'No posee'}
                                </p>
                                <p>
                                    <b>Url de seguimiento: </b> {order?.deliveryNote?.url ? <a href={order?.deliveryNote?.url}>{order?.deliveryNote?.url}</a> : 'No posee'}
                                </p>
                            </div>
                            :
                            <div className="text-center text-red-500">
                                Esta orden aun no tiene información de envio.
                            </div>
                    }
                </div>

                <div className="bg-white rounded text-lg p-8 my-4 text-gray-500">
                    <h1 className="font-bold">
                        Documentos:
                    </h1>
                    <div className="flex w-full justify-around">
                        <div className="flex items-center my-4">
                            <IoDocumentTextOutline />
                            <p>Orden:</p>
                            <span onClick={handlePrint} className="ml-4 cursor-pointer text-main">
                                descargar <IoCloudDownloadSharp className="inline" />
                            </span>
                        </div>
                        {
                            order?.orderStatus?.name === "pagada" &&
                            <div className="flex items-center my-4">
                                <IoDocumentTextOutline />
                                <p>Factura:</p>
                                <span className="ml-4 cursor-pointer text-main">
                                    descargar <IoCloudDownloadSharp className="inline" />
                                </span>
                            </div>
                        }
                        {
                            order?.orderStatus?.name === "enviada" &&
                            <div className="flex items-center my-4">
                                <IoDocumentTextOutline />
                                <p>Albaran de entrega:</p>
                                <span className="ml-4 cursor-pointer text-main">
                                    descargar <IoCloudDownloadSharp className="inline" />
                                </span>
                            </div>
                        }
                    </div>
                </div>
                <OptionsModal
                    onClose={handleClose}
                    open={open}
                    values={ordersStatuses}
                    title="Por favor asigne un estado a la orden"
                />

                <DeliveryNoteModal
                    onClose={handleCloseDeliveryNoteModal}
                    open={openDeliveryNoteModal.open}
                    deliveryMethod={openDeliveryNoteModal.deliveryMethod}
                />
            </div >
            <PrintOrderComponent print={print} onFinalizePrint={() => { setPrint(false) }} order={order} />
            <SubjectErrorModal open={deliveryError.open} onClose={handleCloseSubjectModal} title={"Por favor coloque el motivo del error."} />
        </div>
    )
}

export default OrderEdit;