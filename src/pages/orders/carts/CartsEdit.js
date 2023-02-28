import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";
import { IoBagHandle } from "react-icons/io5";


const CartsEdit = () => {

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useAuth();

    const [{ data: cart, error: cartError, loading: cartLoading }, getCart] = useAxios({ url: `/carts/${id}` }, { useCache: false })

    useEffect(() => {
        console.log(cart);
    }, [cart]);

    useEffect(() => {
        setLoading({ show: cartLoading, message: "Obteniendo informacion" })
    }, [cartLoading]);

    useEffect(() => {
        if (cartError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cartError?.response?.status === 400 ? cartError?.response?.data.message[0] : cartError?.response?.data.message}.`, severity: "error" });
        }
    }, [cartError]);

    return (
        <div className="p-12">
            <div className="bg-white p-4 text-gray-500">
                <h1 className="text-2xl mb-4">
                    Detalle del Carrito:
                </h1>
                <p className="mb-4">Fecha: {cart?.createdAt?.toLocaleString()}</p>
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-1/2">
                        <p>Comprador:</p>
                        <h2 className="text-xl">
                            {cart?.user?.name}
                        </h2>
                    </div>
                    <div className="w-1/2 space-y-4">
                        <h2 className="text-xl">
                            Estado del carrito:
                        </h2>
                        <p className="text-white text-center p-1 rounded" style={{ backgroundColor: cart?.isProcessed ? "green" : "red" }}>
                            {cart?.isProcessed ? "Procesado" : "No procesado"}
                        </p>
                        <p className="text-white text-center p-1 rounded" style={{ backgroundColor: cart?.isExpired ? "red" : "green" }}>
                            {cart?.isExpired ? "Vencido" : "Activo"}
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="mb-4">
                        <h1 className="text-2xl flex items-center space-x-4">
                            <IoBagHandle></IoBagHandle>
                            <p>Productos</p>
                        </h1>
                    </div>
                    <div className="flex w-full mb-4 items-center">
                        <div className="text-center font-bold w-3/12">
                            Nombre
                        </div>
                        <div className="text-center font-bold w-2/12">
                            Imagen
                        </div>
                        <div className="text-center font-bold w-2/12">
                            Precio
                        </div>
                        <div className="text-center font-bold w-2/12">
                            Cantidad
                        </div>
                        <div className="text-center font-bold w-2/12">
                            Total
                        </div>
                    </div>
                    {cart?.cartItems?.map((product, i) => {
                        return (
                            <div className="flex border-b w-full items-center">
                                <div className="text-center w-3/12">
                                    {product.productName}
                                </div>
                                <div className="text-center w-2/12">
                                    <img className="m-auto" style={{ width: 80, height: 80 }} src={`${process.env.REACT_APP_API_URL}/${product.productImage}`} alt="" />
                                </div>
                                <div className="text-center w-2/12">
                                    ${product.productPrice}
                                </div>
                                <div className="text-center w-2/12">
                                    {product.quantity}
                                </div>
                                <div className="text-center w-2/12">
                                    ${product.total}
                                </div>
                            </div>
                        )
                    })}
                    <div className="text-right py-4 text-xl">
                        <b>Total:</b> <span className="text-green-500">${cart?.subTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartsEdit;