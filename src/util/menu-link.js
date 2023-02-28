import {
    IoHomeOutline,
    IoBasketSharp,
    IoDocumentTextSharp,
    IoCartOutline,
    IoReceiptOutline,
    IoClipboardSharp,
    IoStorefrontOutline,
    IoPricetagsOutline,
    IoArrowDown,
    IoPersonCircleSharp,
    IoChatboxEllipsesOutline,
    IoChatbubbleEllipsesOutline,
    IoAlarmOutline,
    IoFastFoodSharp,
    IoSettings,
    IoNewspaperSharp
} from "react-icons/io5";

import { FiTruck } from "react-icons/fi";


export const createLink = (name, icon, url, children) => ({ name, icon, url, children });

const MenuLinks = [
    createLink('Dashboard', <IoHomeOutline />, '/dashboard'),

    createLink('Mis Pedidos', <IoBasketSharp />, '/my-orders', [
        createLink('Mis Ordenes', <IoDocumentTextSharp />, '/my-orders/orders'),
        createLink('Carritos', <IoCartOutline />, '/my-orders/carts'),
        /* createLink('Facturas', <IoReceiptOutline />, '/my-orders/invoices'), */
        /* createLink('Albaranes de entrega', <IoClipboardSharp />, '/my-orders/delivery-notes') */
    ]),

    createLink('Catálogo', <IoStorefrontOutline />, '/catalog', [
        createLink('Mis Productos', <IoFastFoodSharp />, '/catalog/products'),
        createLink('Categorias', <IoPricetagsOutline />, '/catalog/categories'),
        createLink('Descuetos', <IoArrowDown />, '/catalog/discounts'),
    ]),

    createLink('Perfil', <IoPersonCircleSharp />, '/my-account', [
        createLink('Mi cuenta', <IoPersonCircleSharp />, '/my-account'),
        createLink('Post de noticias', <IoNewspaperSharp />, '/news'),
    ]),

    createLink('Preguntas y respuestas', <IoChatboxEllipsesOutline />, '/questions-answers'),

    createLink('Configuración', <IoSettings />, '/configuration', [
        createLink('Horarios', <IoAlarmOutline />, '/configuration/hours'),
        createLink('Empresas de envio', <FiTruck />, '/configuration/delivery-methods'),
    ]),
]


export default MenuLinks;