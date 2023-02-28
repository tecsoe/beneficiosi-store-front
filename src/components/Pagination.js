import { IoChevronForwardSharp, IoChevronBack } from "react-icons/io5";
import clsx from "clsx";
import { useEffect, useState } from "react";

const PaginationButton = ({ children, active, onClick }) => {
  return <div

    onClick={onClick}
    className={clsx([
      `inline-flex items-center justify-center cursor-pointer
      w-6 h-6
      font-semibold hover:bg-main hover:text-white
      border border-gray-300
      transition duration-300
      p-5
      rounded-full`,
      {
        'bg-main text-white': active,
        'text-gray-700': !active,
      }
    ])}
  >
    {children}
  </div>;
};

const NavigationButton = ({ icon, color, className, onClick, canNext, hidden }) => {
  return (
    <button hidden={hidden} onClick={onClick} className={`text-${color} ${className}`} disabled={canNext}>
      {icon}
    </button>
  )
};


const Pagination = (props) => {

  const { pages, onChange, activePage, className } = props;

  const [canNext, setCanNext] = useState(true);
  const [canBack, setCanBack] = useState(false);

  const nextPage = (page) => {
    console.log(page);
    if (page <= pages) {
      onChange(page);
    }
  }
  const backPage = (page) => {
    if (page >= 1) {
      onChange(page);
    }
  }

  useEffect(() => {
    if (activePage >= pages) {
      setCanNext(false);
    } else {
      setCanNext(true);
    }


    if (activePage > 1) {
      setCanBack(true);
    } else {
      setCanBack(false);
    }
  }, [activePage])

  return <ul className={`flex items-center space-x-2 ${className}`}>
    <li>
      <NavigationButton hidden={!canBack} disable={!canBack} onClick={() => { backPage(activePage - 1) }} color="main" className="text-xl hover:text-gray-500 transition duraion-500 transform hover:scale-150" icon={<IoChevronBack />}></NavigationButton>
    </li>
    {
      pages ?
        Array.from(Array(pages).keys()).map(n =>
          <li key={n}>
            <PaginationButton active={n + 1 === activePage} onClick={() => { onChange(n + 1) }}>{n + 1}</PaginationButton>
          </li>
        )
        :
        null
    }
    <li>
      <NavigationButton hidden={!canNext} disable={!canNext} onClick={() => { nextPage(activePage + 1) }} color="main" className="text-xl hover:text-gray-500 transition duraion-500 transform hover:scale-150" icon={<IoChevronForwardSharp />}></NavigationButton>
    </li>
  </ul>;
};

export default Pagination;