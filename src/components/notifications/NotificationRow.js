import { forwardRef } from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const NotificationRow = forwardRef(({ notification, ...rest }, ref) => {

    const { type, message, id, additionalData, createdAt } = notification;

    if (type === "ORDER_STATUS_CHANGE" || type === "ORDER_CREATED") {
        return (
            <Link {...rest} ref={ref} to={`/my-orders/orders/${additionalData?.orderId}`}>
                <div className="my-2 flex items-center justify-between rounded hover:text-main p-1 notificationRow">
                    <div className="flex items-center space-x-2">
                        <div style={{ backgroundColor: additionalData.color + "4d", }} className="w-10 h-10 rounded-full flex bg-opacity-10">
                            <IoNotificationsSharp style={{ color: additionalData.color }} className="m-auto text-lg" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xs">{message}</h3>
                            <p className="text-xs">{createdAt}</p>
                        </div>
                    </div>
                    {
                        !notification?.userToNotification?.seen &&
                        < span className="rounded-full h-4 w-4 bg-main" />
                    }
                </div>
            </Link>
        )
    }

    return (null)
})

export default NotificationRow;