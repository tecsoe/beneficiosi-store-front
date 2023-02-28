import { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import MenuLinks from '../util/menu-link';
import MenuLinksEvents from '../util/menu-link-events';
import {
    IoChevronBack,
    IoChevronForwardSharp,
    IoLogOutOutline,
    IoStorefrontOutline,
    IoNotificationsOutline,
    IoPersonCircle,
    IoChevronUp
} from "react-icons/io5";
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import useNotifications from '../hooks/useNotifications';
import SystemInfo from '../util/SystemInfo';
import useAxios from '../hooks/useAxios';
import NotificationsComponent from './notifications/NotificationsComponent';

const PanelLayout = ({ children }) => {

    const [actualMenu, setActualMenu] = useState(null);
    const [actualPath, setActualPath] = useState(null);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);

    const history = useHistory();

    const { user, setAuthInfo } = useAuth();

    const [{ notifications: newNotifications, error: notificationsError, loading: notificationsLoading }, getNotifications] = useNotifications({ options: { manual: true, useCache: false }, axiosConfig: { params: { sort: "createdAt,DESC" } } });
    const [{ data: seenNotificationsData, error: seenNotificationsError, loading: seenNotificationsLoading }, notificationsMarkAsSeen] = useAxios({ url: "/notifications/mark-all-as-seen", method: "DELETE" }, { manual: true, useCache: false });

    const [notificationInterface, setNotificationInterface] = useState(io(`${process.env.REACT_APP_API_URL}`, { transports: ['websocket'] }));

    const [notifications, setNotification] = useState([]);
    const [notificationsNumber, setNotificationsNumber] = useState(0);

    useEffect(() => {
        setNotificationsNumber(notifications?.filter((notification) => !notification?.userToNotification?.seen).length);
    }, [notifications]);

    useEffect(() => {
        if (notificationsNumber > 0) {
            document.title = `(${notificationsNumber}) ${SystemInfo.name}`
        } else {
            document.title = `${SystemInfo.name}`
        }
    }, [notificationsNumber])

    useEffect(() => {
        setNotification((oldNotifications) => {
            return [...oldNotifications, ...newNotifications]
        });
    }, [newNotifications]);

    useEffect(() => {
        if (user && notificationInterface) {
            notificationInterface.on(`user.${user?.id}`, handleNotification);
            getNotifications({ params: { sort: "createdAt,DESC" } });
        }
    }, [user, notificationInterface]);

    useEffect(() => {
        history.listen((path) => {
            setActualPath(path.pathname);
            console.log(path.pathname);
        })
    }, []);

    const handleNotification = (notification) => {
        setNotification((oldNotifications) => {
            return [notification, ...oldNotifications];
        })
    }

    const handleClick = (link) => {
        if (link.children) {
            setShowSubMenu(true);
        } else {
            setShowSubMenu(false);
        }
        setActualMenu(link);
    }

    const toggleMenu = () => {
        setShowSubMenu((value) => !value);
    }

    const toggleOpen = () => {
        setOpen((oldOpen) => !oldOpen);
    }

    const toggleShow = () => {
        setShow((oldShow) => !oldShow);
    }

    const handleCloseNotifications = () => {
        setOpen(false);
        setNotificationsNumber(0);
        notificationsMarkAsSeen();
    }

    const logOut = () => {
        setShow(false);
        setAuthInfo({ isAuthenticated: false, user: null, token: null });
    }

    return (
        <div className="bg-gray-200 flex">
            <div className="min-h-screen w-16 z-10 bg-white py-2 px-1">
                <Link to={'/dashboard'}>
                    <img className="w-8/12 m-auto mb-12" src={Logo} alt="" />
                </Link>

                {
                    user?.storeCategory?.id === 2 || user?.storeCategory?.id === 4 ?
                        MenuLinksEvents.map((link, i) => {
                            return (
                                <div key={i} className="text-gray-500 flex w-full justify-center text-4xl my-4">
                                    <Link
                                        to={link.url}
                                        className={clsx(["hover:text-main transition duration-300"], {
                                            'text-main': actualPath?.split('/')?.includes(link.url.substr(1))
                                        })}
                                        onClick={() => { handleClick(link) }}
                                    >
                                        {link.icon}
                                    </Link>
                                </div>
                            )
                        })
                        :
                        MenuLinks.map((link, i) => {
                            return (
                                <div key={i} className="text-gray-500 flex w-full justify-center text-4xl my-4">
                                    <Link
                                        to={link.url}
                                        className={clsx(["hover:text-main transition duration-300"], {
                                            'text-main': actualPath?.split('/')?.includes(link.url.substr(1))
                                        })}
                                        onClick={() => { handleClick(link) }}
                                    >
                                        {link.icon}
                                    </Link>
                                </div>
                            )
                        })
                }
                <div className="text-gray-500 flex w-full justify-center text-4xl my-4">
                    <button className="hover:text-main transition duration-300" onClick={logOut}>
                        <IoLogOutOutline />
                    </button>
                </div>
                <div className="text-center">
                    <button className="bg-main m-auto p-3 rounded text-white" onClick={toggleMenu}>
                        {
                            actualMenu?.children && showSubMenu ?
                                <IoChevronBack />
                                :
                                <IoChevronForwardSharp />
                        }
                    </button>
                </div>
            </div>
            {
                actualMenu?.children && showSubMenu ?
                    <div className="min-h-screen w-2/12 bg-white border-l border-gray-200 animate__animated animate__fadeInLeft">
                        <div className="p-4 flex flex-col text-gray-500 justify-center w-full">
                            <p className="m-auto text-4xl">
                                {actualMenu.icon}
                            </p>
                            <p className="text-2xl text-center">
                                {actualMenu.name}
                            </p>
                        </div>


                        {
                            actualMenu.children ?
                                <div className="px-4">
                                    {
                                        actualMenu.children.map((subLink, i) => {
                                            return (
                                                <Link key={i} to={subLink.url}>
                                                    <div className={clsx(["flex transition duration-500 items-center my-4 p-2 rounded hover:text-main hover:bg-red-100"], {
                                                        'text-main bg-red-100': subLink.url == actualPath,
                                                        "text-gray-500": subLink.url !== actualPath,
                                                    })}>
                                                        <p className="text-xl mr-2">
                                                            {subLink.icon}
                                                        </p>
                                                        <p>
                                                            {subLink.name}
                                                        </p>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                                :
                                null
                        }


                    </div>
                    :
                    null
            }
            <div className="w-full overflow-x-hidden transition duration-500 min-w-0">
                <div className="bg-main px-4 py-4 flex items-center justify-end text-white space-x-4">
                    <div className="text-xl">
                        <a className="flex items-center" target="_blank" href={`${process.env.REACT_APP_HOST}stores/${user?.slug}`}>
                            <IoStorefrontOutline className="mr-2 text-2xl" />
                            <p>Ver Tienda</p>
                        </a>
                    </div>
                    <NotificationsComponent />

                    <div className="relative">
                        {
                            user?.storeProfile?.logo ?
                                <img onClick={toggleShow} className="rounded-full w-12 h-12 transition duration-500 hover:shadow-2xl cursor-pointer" src={`${process.env.REACT_APP_API_URL}/${user?.storeProfile?.logo}`} alt="" />
                                :
                                <IoPersonCircle className="w-12 h-12 transition duration-500 hover:shadow-2xl cursor-pointer" />
                        }
                        {
                            show ?
                                <ul className="bg-white w-64 shadow-xl absolute top-full right-0 animate__animated animate__fadeInUp">
                                    <li className="p-2">
                                        <Link to={`/my-account`} className="flex items-center text-gray-500 font-bold hover:text-main">
                                            <IoPersonCircle className="mr-2" />
                                            Mi cuenta
                                        </Link>
                                    </li>
                                    <li onClick={logOut} className="p-2 flex items-center text-gray-500 font-bold cursor-pointer hover:text-main">
                                        <IoLogOutOutline className="mr-2" />
                                        cerrar sesion
                                    </li>
                                    <li onClick={toggleShow} className="p-2 text-right text-gray-500 font-bold transition duration-500 cursor-pointer hover:bg-main hover:text-white">
                                        <IoChevronUp className="m-auto"></IoChevronUp>
                                    </li>
                                </ul>
                                :
                                null
                        }
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default PanelLayout;