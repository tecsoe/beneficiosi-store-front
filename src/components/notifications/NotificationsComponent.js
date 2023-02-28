import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import clsx from 'clsx';
import NotificationsList from './NotificationsList';
import useNotifications from '../../hooks/useNotifications';
import useAxios from '../../hooks/useAxios';
import SystemInfo from "../../util/SystemInfo";
import { useAuth } from '../../contexts/AuthContext';

import { IoNotificationsSharp } from "react-icons/io5";

const notificationInterface = io(`${process.env.REACT_APP_API_URL}`, { transports: ['websocket'], autoConnect: false });

const NotificationsComponent = () => {

    const { user } = useAuth();

    const [open, setOpen] = useState(false);

    const [filters, setFilters] = useState({ page: 1, sort: "createdAt,DESC" });

    const [{ notifications: oldNotifications, numberOfPages, error, loading, total }, getNotifications] = useNotifications({ options: { manual: true, useCache: false }, axiosConfig: { params: { ...filters } } });
    const [{ data: seenNotificationsData }, notificationsMarkAsSeen] = useAxios({ url: "/notifications/mark-all-as-seen", method: "DELETE" }, { manual: true, useCache: false });

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
    }, [notificationsNumber]);

    useEffect(() => {
        setNotification((oldNotificationsActual) => {
            return [...oldNotificationsActual, ...oldNotifications]
        });
    }, [oldNotifications]);

    useEffect(() => {
        if (user && notificationInterface) {
            notificationInterface.on(`user.${user?.id}`, handleNotification);
            getNotifications({ params: { ...filters } });
        }
    }, [user, notificationInterface]);

    useEffect(() => {
        getNotifications({ params: { ...filters } });
    }, [filters])

    const handleNotification = (notification) => {
        setNotification((oldNotificationsActual) => {
            return [notification, ...oldNotificationsActual];
        })
    }

    const handleCloseNotifications = () => {
        setOpen(false);
        setNotificationsNumber(0);
        notificationsMarkAsSeen();
    }

    const toggleOpen = () => {
        setOpen((oldOpen) => !oldOpen);
    }

    const handleScrollEnd = () => {
        if (numberOfPages > filters.page) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    page: oldFilters.page + 1
                }
            });
        }
    }

    return (
        <div className="relative">

            <button onClick={toggleOpen} className={clsx(["text-xl p-3 rounded-full relative transition flex items-center"], {
            })}>
                <IoNotificationsSharp />
                Notificaciones ({notificationsNumber})
            </button>
            <NotificationsList
                page={filters.page}
                numberOfPages={numberOfPages}
                loading={loading}
                open={open}
                notifications={notifications}
                onClose={handleCloseNotifications}
                onScrollEnd={handleScrollEnd} />

        </div>
    )
}

export default NotificationsComponent;