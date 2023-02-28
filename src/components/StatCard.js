import clsx from "clsx";
import { Link } from "react-router-dom";

const StatCard = ({ icon, iconColor = 'primary', value, title, link, loading }) => {
    const Icon = icon;

    return <Link to={link}>
        <div className="inline-block">
            <div className="min-w-[250px] m-h-[120px] items-center flex justify-between bg-white p-5 hover:shadow-2xl transition duration-500">
                <div className={clsx('h-full text-2xl w-1/2 flex', {
                    ['text-main']: iconColor === 'primary',
                    ['text-yellow-500']: iconColor === 'info',
                    ['text-green-500']: iconColor === 'success',
                    ['text-red-500']: iconColor === 'warning',
                    ['text-purple-700']: iconColor === 'purple',
                })}>
                    <Icon fontSize="inherit" color="inherit" className="m-auto text-[50px]" />
                </div>

                <div className="text-right break-words w-1/2 text-gray-500">
                    {
                        loading ?
                            <p className="ml-auto h-10 w-10 custom-skeleton rounded"></p>
                            :
                            <p className="text-4xl font-bold">{value}</p>
                    }
                    <p className="text-md">{title}</p>
                </div>
            </div>
        </div>
    </Link>;
};

export default StatCard;