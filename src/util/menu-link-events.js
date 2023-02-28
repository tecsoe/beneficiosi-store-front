import {
    IoHomeOutline,
    IoBasketSharp,
    IoDocumentTextSharp,
    IoCartOutline,
    IoPricetagsOutline,
    IoArrowDown,
    IoPersonCircleSharp,
    IoChatboxEllipsesOutline,
    IoAlarmOutline,
    IoSettings,
    IoGridOutline,
    IoPlayCircleOutline,
    IoStar,
    IoNewspaperSharp
} from "react-icons/io5";


import { FiTruck } from "react-icons/fi";


export const createLink = (name, icon, url, children) => ({ name, icon, url, children });

const MenuLinksEvents = [
    createLink('Dashboard', <IoHomeOutline />, '/dashboard'),

    createLink('Mis Pedidos', <IoBasketSharp />, '/my-orders', [
        createLink('Mis Ordenes', <IoDocumentTextSharp />, '/my-orders/orders'),
        createLink('Carritos', <IoCartOutline />, '/my-orders/carts'),
    ]),

    createLink('Salas/Lugares', <IoGridOutline />, '/places'),

    createLink('Shows o Peliculas', <IoStar />, '/shows', [
        createLink('Shows o Peliculas', <IoStar />, '/shows'),
        createLink('Categorias', <IoPricetagsOutline />, '/catalog/categories'),
        createLink('Descuetos', <IoArrowDown />, '/catalog/discounts'),
    ]),

    createLink('Perfil', <IoPersonCircleSharp />, '/my-account', [
        createLink('Mi cuenta', <IoPersonCircleSharp />, '/my-account'),
        createLink('Post de noticias', <IoNewspaperSharp />, '/news'),
    ]),

    createLink('Preguntas y respuestas', <IoChatboxEllipsesOutline />, '/questions-answers'),

    createLink('Configuración', <IoSettings />, '/configuration', [
        createLink('Horarios', <IoAlarmOutline />, '/configuration/hours')
    ]),
]


export default MenuLinksEvents;