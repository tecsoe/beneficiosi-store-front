import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import NotificationRow from "./NotificationRow";

const NotificationsList = ({ notifications, open, onClose, onScrollEnd, numberOfPages, page, loading, ...rest }) => {

    const modalRef = useRef();

    const observer = useRef();

    const lastNotificationRef = useCallback((notification) => {
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                onScrollEnd();
            }
        })
        if (notification) observer?.current?.observe?.(notification)
    }, [numberOfPages, page]);

    useEffect(() => {
        const listener = (e) => {
            if (e.target !== modalRef?.current && !modalRef?.current?.contains(e.target) && open) {
                onClose();
            }
        };
        window.addEventListener("click", listener);
        return () => window.removeEventListener('click', listener);
    }, [open])

    if (!open) {
        return null
    }

    return (
        <div {...rest} ref={modalRef} style={{ top: "110%" }} className={clsx(["absolute right-0 z-50 animate__animated animate__fadeInUp"])}>
            <div style={{ height: "70vh", width: 350, overflowY: "auto" }} className="relative text-gray-500 p-2 rounded bg-white shadow-xl custom-scrollbar">
                <h3 className="text-2xl font-bold">
                    Notificaciones
                </h3>
                {
                    notifications?.map((notification, i) => {
                        return (
                            <NotificationRow
                                key={i}
                                ref={i + 1 === notifications.length ? lastNotificationRef : null}
                                onClick={onClose}
                                notification={notification} />
                        )
                    })
                }
                {
                    loading &&
                    <div className="text-center">
                        Obteniendo mas...
                    </div>
                }
            </div>
        </div >
    )
};

export default NotificationsList;