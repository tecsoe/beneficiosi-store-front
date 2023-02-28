import { Redirect, Switch } from "react-router";
import PanelLayout from "./components/PanelLayout";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Carts from "./pages/orders/carts/Carts";
import Categories from "./pages/catalog/categories/Categories";
import CategoriesCreate from "./pages/catalog/categories/CategoriesCreate";
import ClientService from "./pages/ClientService";
import Dashboard from "./pages/Dashboard";
import DeliveryMethods from "./pages/delivery-methods/DeliveryMethods";
import DeliveryMethodsCreate from "./pages/delivery-methods/DeliveryMethodsCreate";
import DeliveryNotes from "./pages/DeliveryNotes";
import Discounts from "./pages/catalog/discounts/Discounts";
import Hours from "./pages/Hours";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import MyAccount from "./pages/MyAccount";
import Orders from "./pages/orders/orders/Orders";
import OrdersEdit from "./pages/orders/orders/OrdersEdit";
import Products from "./pages/catalog/products/Products";
import ProductsCreate from "./pages/catalog/products/ProductsCreate";
import ProductsEdit from "./pages/catalog/products/ProductsEdit";
import QuestionAnswers from "./pages/QuestionAnswers";
import Register from "./pages/Register";
import CartsEdit from "./pages/orders/carts/CartsEdit";
import DiscountsCreate from "./pages/catalog/discounts/DiscountsCreate";
import DiscountsEdit from "./pages/catalog/discounts/DiscountsEdit";
import SelectCategoryToRegister from "./pages/SelectCategoryToRegister";
import ForgotPassword from "./pages/ForgotPassword";
import RenewPassword from "./pages/RenewPassword";
import DeliveryMethodsEdit from "./pages/delivery-methods/DeliveryMethodsEdit";
import Places from "./pages/places/Places";
import CreatePlaces from "./pages/places/CreatePlaces";
import EditPlaces from "./pages/places/EditPlaces";
import Shows from "./pages/shows/Shows";
import CreateShows from "./pages/shows/CreateShows";
import EditShows from "./pages/shows/EditShows";
import PrivateRouteEvents from "./components/PrivateRouteEvents";
import PrivateRouteStores from "./components/PrivateRouteStores";
import NewsCreate from "./pages/news/NewsCreate";
import NewsEdit from "./pages/news/NewsEdit";
import News from "./pages/news/News";


const Routes = () => {
    return (
        <Switch>
            <PublicRoute exact path="/"><Login /></PublicRoute>
            <PublicRoute exact path="/login"><Login /></PublicRoute>
            <PublicRoute exact path="/select-category"><SelectCategoryToRegister /></PublicRoute>
            <PublicRoute exact path="/register"><Register /></PublicRoute>
            <PublicRoute exact path="/forgot-password"><ForgotPassword /></PublicRoute>
            <PublicRoute exact path="/renew-password"><RenewPassword /></PublicRoute>

            <PanelLayout>
                <PrivateRoute exact path="/dashboard"><Dashboard /></PrivateRoute>

                {/*MY ORDERS */}
                <PrivateRoute exact path="/my-orders"><Redirect to={'/my-orders/orders'} exact /></PrivateRoute>
                <PrivateRoute exact path="/my-orders/orders"><Orders /></PrivateRoute>
                <PrivateRoute exact path="/my-orders/orders/:id"><OrdersEdit /></PrivateRoute>
                <PrivateRoute exact path="/my-orders/carts"><Carts /></PrivateRoute>
                <PrivateRoute exact path="/my-orders/carts/:id"><CartsEdit /></PrivateRoute>
                <PrivateRoute exact path="/my-orders/invoices"><Invoices /></PrivateRoute>
                <PrivateRoute exact path="/my-orders/delivery-notes"><DeliveryNotes /></PrivateRoute>

                {/*Rooms*/}
                <PrivateRouteEvents exact path="/places"><Places /></PrivateRouteEvents>
                <PrivateRouteEvents exact path="/places/create"><CreatePlaces /></PrivateRouteEvents>
                <PrivateRouteEvents exact path="/places/:id/edit"><EditPlaces /></PrivateRouteEvents>

                {/*Movies*/}
                <PrivateRouteEvents exact path="/shows"><Shows /></PrivateRouteEvents>
                <PrivateRouteEvents exact path="/shows/create"><CreateShows /></PrivateRouteEvents>
                <PrivateRouteEvents exact path="/shows/:id/edit"><EditShows /></PrivateRouteEvents>

                {/*CATALOG*/}
                <PrivateRouteStores exact path="/catalog"><Redirect to={'/catalog/products'} exact /></PrivateRouteStores>
                <PrivateRouteStores exact path="/catalog/products"><Products /></PrivateRouteStores>
                <PrivateRouteStores exact path="/catalog/products/create"><ProductsCreate /></PrivateRouteStores>
                <PrivateRouteStores exact path="/catalog/products/edit/:id"><ProductsEdit /></PrivateRouteStores>
                <PrivateRoute exact path="/catalog/categories"><Categories /></PrivateRoute>
                <PrivateRoute exact path="/catalog/categories/create"><CategoriesCreate /></PrivateRoute>
                <PrivateRoute exact path="/catalog/discounts"><Discounts /></PrivateRoute>
                <PrivateRoute exact path="/catalog/discounts/create"><DiscountsCreate /></PrivateRoute>
                <PrivateRoute exact path="/catalog/discounts/:id/edit"><DiscountsEdit /></PrivateRoute>

                {/*MY ACCOUNT*/}
                <PrivateRoute exact path="/my-account"><MyAccount /></PrivateRoute>
                <PrivateRoute exact path="/news"><News /></PrivateRoute>
                <PrivateRoute exact path="/news/create"><NewsCreate /></PrivateRoute>
                <PrivateRoute exact path="/news/:id/edit"><NewsEdit /></PrivateRoute>

                {/*THREADS*/}
                <PrivateRoute exact path="/threads"><Redirect to={'/threads/client-services'} exact /></PrivateRoute>
                <PrivateRoute exact path="/threads/client-services"><ClientService /></PrivateRoute>
                <PrivateRoute exact path="/questions-answers"><QuestionAnswers /></PrivateRoute>

                {/*CONFIGURATION*/}
                <PrivateRoute exact path="/configuration"><Redirect to={'/configuration/hours'} exact /></PrivateRoute>
                <PrivateRoute exact path="/configuration/hours"><Hours /></PrivateRoute>
                <PrivateRouteStores exact path="/configuration/delivery-methods"><DeliveryMethods /></PrivateRouteStores>
                <PrivateRouteStores exact path="/configuration/delivery-methods/create"><DeliveryMethodsCreate /></PrivateRouteStores>
                <PrivateRouteStores exact path="/configuration/delivery-methods/:id/edit"><DeliveryMethodsEdit /></PrivateRouteStores>
            </PanelLayout>
        </Switch>
    )
};

export default Routes;