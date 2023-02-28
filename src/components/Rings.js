import clsx from "clsx";

const Rings = ({ color, size, value, title }) => {
    return (
        <div className="inline-block text-center">

            <div className={clsx(["border rounded-full flex"], {
                'h-28 w-28 text-[25px] border-[10px]': size == 'small',
                'h-48 w-48 text-[40px] border-[20px]': size == 'medium',
                'h-72 w-72 text-[60px] border-[30px]': size == 'large',
                'border-red-500': color == 'main',
                'border-yellow-500': color == 'warning',
                'border-green-500': color == 'success',
                'border-purple-500': color == 'purple',
                'border-black': color == 'dark',
            })}>
                <p className="m-auto">{value}</p>
            </div>
            <h1 className={clsx({
                'text-[25px]': size == 'small',
                'text-[40px]': size == 'medium',
                'text-[60px]': size == 'large',
            })}>
                {title}
            </h1>
        </div>
    )
}

export default Rings;