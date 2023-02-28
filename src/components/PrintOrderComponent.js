import { useRef } from "react";
import Button from "./Button";
import { useReactToPrint } from 'react-to-print';
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";



const PrintOrderComponent = ({ order, togglePrintMode, print, onFinalizePrint }) => {

    const { setLoading, setCustomAlert } = useAuth();

    const componentRef = useRef();

    useEffect(() => {
        if (print) {
            handlePrint();
        }
    }, [print])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onBeforeGetContent: () => setLoading?.({ show: true, message: "Generando documento" }),
        onAfterPrint: () => { setLoading?.({ show: false, message: "" }); onFinalizePrint() },
        documentTitle: `Order - ${order?.orderNumber}`,
        pageStyle: `
        
          
          @media print {
            html, body {
              height: initial !important;
              overflow: initial !important;
              -webkit-print-color-adjust: exact;
            }
          }
          
          @media print {
            .page-break {
              margin-top: 1rem;
              display: block;
              page-break-before: auto;
            }
          }
          
          @page {
            size: auto;
            margin: 7mm;
          }
      `
    });

    return (
        <div className="animate__animated animate__fadeInUp text-gray-500 hidden">
            <div ref={componentRef}>
                <div className="bg-white p-8 text-gray-500">
                    <h1 className="text-center text-3xl my-1">
                        Orden de Compra
                    </h1>
                    <div className="mb-2 flex justify-between">
                        <div>
                            <img className="m-auto" style={{ height: 60, width: 60 }} src={`${process.env.REACT_APP_API_URL}/${order?.store?.storeProfile?.logo}`} alt="" />
                            <p>{order?.store?.name}</p>
                        </div>
                        <div>
                            <p>Fecha: {order?.createdAt}</p>
                            <p className="font-bold text-right capitalize" style={{ color: order?.orderStatus?.color }}>{order?.orderStatus?.name}</p>
                        </div>
                    </div>

                    <div className="flex space-x-4" container>
                        <div className="w-1/2">
                            <div className="mb-1">
                                <b>Nro de orden:</b> {order?.orderNumber}
                            </div>
                            <div className="mb-1">
                                <b>Nombre del cliente:</b> {order?.user?.name}
                            </div>
                            <div className="mb-1">
                                <b>Metodo de pago:</b> <span style={{ textTransform: "capitalize" }}>{order?.paymentMethod?.name}</span>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="mb-1">
                                <b>Dirección de envio:</b> {order?.delivery?.profileAddress?.address ? order?.delivery?.profileAddress?.address : "Retira en tienda."}
                            </div>
                            <div className="mb-1">
                                <b>Empresa de envio:</b> {order?.deliveryMethod?.name ? order?.deliveryMethod?.name : "Retiro en tienda."}
                            </div>
                            <div className="mb-1">
                                <b>Costo de envio:</b> {order?.delivery?.total > 0 ? `$${order?.delivery?.total}` : "Gratis"}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl mb-4 font-bold text-center">
                            Detalle de orden
                        </h2>
                        <table style={{ borderSpacing: 10 }} className="w-full">
                            <tbody>
                                <tr className="border-b">
                                    <th>
                                        <div className="text-center">
                                            Nombre
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text-center">
                                            Imagen
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text-center">
                                            Precio
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text-center">
                                            Cantidad
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text-center">
                                            Total
                                        </div>
                                    </th>
                                </tr>
                                {
                                    order?.cart?.cartItems?.map((product, i) => {
                                        return (
                                            <tr className={`border-b`} key={i}>
                                                <td style={{ padding: i === 4 && order?.cart?.cartItems.length > 5 ? "1rem 1rem 2.5rem 1rem" : "1rem" }}>
                                                    <div className="text-center">
                                                        {product.productName}
                                                    </div>
                                                </td>
                                                <td style={{ padding: i === 4 && order?.cart?.cartItems.length > 5 ? "1rem 1rem 2.5rem 1rem" : "1rem" }}>
                                                    <div className="text-center">
                                                        <img className="m-auto" style={{ width: 80, height: 80 }} src={`${process.env.REACT_APP_API_URL}/${product.productImage}`} alt="" />
                                                    </div>
                                                </td>
                                                <td style={{ padding: i === 4 && order?.cart?.cartItems.length > 5 ? "1rem 1rem 2.5rem 1rem" : "1rem" }}>
                                                    <div className="text-center">
                                                        ${product.productPrice}
                                                    </div>
                                                </td>
                                                <td style={{ padding: i === 4 && order?.cart?.cartItems.length > 5 ? "1rem 1rem 2.5rem 1rem" : "1rem" }}>
                                                    <div className="text-center">
                                                        {product.quantity}
                                                    </div>
                                                </td>
                                                <td style={{ padding: i === 4 && order?.cart?.cartItems.length > 5 ? "1rem 1rem 2.5rem 1rem" : "1rem" }}>
                                                    <div className="text-center">
                                                        ${product.total}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <th className="p-4" colSpan={5}>
                                        <div className="text-right">
                                            <span>SubTotal:</span> <span className="text-gray-500">${order?.cart?.subTotal}</span>
                                        </div>
                                        <div className="text-right">
                                            <span>Envio:</span> <span className="text-gray-500">{order?.delivery?.total > 0 ? `$${order?.delivery?.total}` : "Gratis"}</span>
                                        </div>
                                        <div className="text-right">
                                            <span>Total:</span> <span className="text-green-500">${order?.delivery?.total + order?.cart?.subTotal}</span>
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <div className="text-center space-x-2 mt-4">
                <Button className="bg-main" onClick={togglePrintMode}>
                    Cancelar
                </Button>
                <Button className="bg-main items-center" onClick={handlePrint}>
                    <span>Imprimir</span>
                </Button>
            </div>
        </div>
    )
}

export default PrintOrderComponent;