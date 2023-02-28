import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoCartOutline, IoChatboxEllipsesOutline, IoClose, IoDocumentTextSharp, IoFastFoodOutline, IoPlayCircleOutline, IoStar } from "react-icons/io5";
import { useLocation } from "react-router";
import LineChart from "../components/charts/LineChart";
import Rings from "../components/Rings";
import StatCard from "../components/StatCard";
import { useAuth } from "../contexts/AuthContext";
import useCarts from "../hooks/useCarts";
import useOrders from "../hooks/useOrders";
import useProducts from "../hooks/useProducts";
import useQuestions from "../hooks/useQuestions";

var values = [10, 41, 35, 51, 49, 62, 69, 91, 148, 54, 71, 63, 42, 85, 16, 12, 45, 75, 63, 52, 78, 95, 52, 24, 35, 45, 54, 74, 500, 12, 0];

const Dashboard = () => {

    const { user } = useAuth();

    const location = useLocation();

    const [message, setMessage] = useState('');

    const [{ total: cartsTotal, error: cartsError, loading: cartsLoading }, getCarts] = useCarts({
        axiosConfig: {
            params: {
                isDirectPurchase: "false"
            }
        }
    });

    const [{ error: ordersError, loading: ordersLoading, total: ordersTotal }, getOrders] = useOrders();

    const [{ error: productsError, loading: productsLoading, total: productsTotal }, getProducts] = useProducts({
        params: {
            storeId: user?.storeId
        }
    });

    const [{ error: questionsError, loading: questionsLoading, total: questionsTotal }, getQuestions] = useQuestions({
        axiosConfig: {
            params: {
                storeId: user.storeId
            }
        }
    });

    const [{ data: ordersCount }] = useAxios({ url: `/orders/orders-count` }, { useCache: false });

    useEffect(() => {
        if (ordersCount) {
            console.log(ordersCount);
            //console.log(ordersCount?.entries());
        }
    }, [ordersCount])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paramsMessage = params.get('message');
        if (paramsMessage) {
            setMessage(paramsMessage);
        }

    }, [location]);

    useEffect(() => {
        console.log(message);
    }, [message])

    return (
        <div className="px-4">
            <h1 className="text-4xl my-6 font-bold text-gray-600">
                Resumen
            </h1>
            {
                message &&
                <div className="text-red-500 bg-white rounded p-4 relative">
                    {message}
                    <IoClose className="absolute right-0 top-0 text-2xl cursor-pointer" onClick={() => { setMessage('') }} />
                </div>
            }
            <div className="flex justify-between my-12">
                <StatCard
                    link="/my-orders/orders"
                    icon={IoDocumentTextSharp}
                    value={ordersTotal}
                    iconColor="info"
                    title={'Ordenes'}
                    loading={ordersLoading}
                ></StatCard>

                <StatCard
                    link="/my-orders/carts"
                    icon={IoCartOutline}
                    value={cartsTotal}
                    iconColor="primary"
                    title={'Carritos'}
                    loading={cartsLoading}
                ></StatCard>

                <StatCard
                    link={user?.storeCategory?.id === 2 || user?.storeCategory?.id === 4 ? '/shows' : "/catalog/products"}
                    icon={user?.storeCategory?.id === 2 || user?.storeCategory?.id === 4 ? IoStar : IoFastFoodOutline}
                    value={productsTotal}
                    iconColor={user?.storeCategory?.id === 2 || user?.storeCategory?.id === 4 ? 'info' : "success"}
                    title={user?.storeCategory?.id === 2 ? 'Funciones' : user?.storeCategory?.id === 4 ? 'Eventos' : 'Productos'}
                    loading={productsLoading}
                ></StatCard>

                <StatCard
                    link="/questions-answers"
                    icon={IoChatboxEllipsesOutline}
                    value={questionsTotal}
                    iconColor="purple"
                    title={'Preguntas'}
                    loading={questionsLoading}
                ></StatCard>
            </div>
            <div className="bg-white rounded px-8">
                <LineChart title={'Ingresos en ARS mes de Mayo: ' + values.reduce((total, n) => total + n, 0)} values={values}></LineChart>
            </div>

            <div className="bg-white rounded my-6 py-4">
                <div className="text-yellow-500 ml-8 mb-8 flex items-center">
                    <IoDocumentTextSharp className="text-4xl font-semibold" />
                    <h1 className="text-xl">
                        Estado de las ordenes Ordenes
                    </h1>
                </div>
                <div className="flex justify-between px-48">
                    <Rings color="main" title="Canceladas" value={ordersCount?.canceled} size="small"></Rings>
                    <Rings color="warning" title="En Proceso" value={ordersCount?.processing} size="small"></Rings>
                    <Rings color="success" title="Finalizadas" value={ordersCount?.completed} size="small"></Rings>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;