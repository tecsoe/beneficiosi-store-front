import clsx from "clsx";
import { useState } from "react";
import { IoChatboxEllipsesOutline, IoChevronDownSharp, IoChevronUp, IoArrowRedoSharp, IoCheckmarkCircleSharp } from "react-icons/io5";
import useQuestions from "../hooks/useQuestions";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import AnswerFormModal from "../components/AnswerFormModal";
import useAxios from "../hooks/useAxios";


const tabsLink = [
    {
        value: 1,
        title: 'Preguntas',
        icon: <IoChatboxEllipsesOutline />
    }
]

const TabBody = ({ children, show, className }) => {
    return (
        <div hidden={!show} className={`${className} p-4 animate__animated animate__fadeIn`}>
            {children}
        </div>
    )
}

const QuestionAnswers = () => {

    const { setLoading, setCustomAlert, user } = useAuth();

    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const [show, setShow] = useState(false);

    const [showAnswer, setShowAnswer] = useState(null);

    const [activeTab, setActiveTab] = useState(1);
    const [filters, setFilters] = useState({
        page: 1,
        sort: "createdAt,DESC",
        storeId: user.storeId
    });

    const [{ data: updateData, error: updateError, loading: updateLoading }, updateQuestion] = useAxios({ url: `/questions/${selectedQuestion?.id}`, method: "PUT" }, { useCache: false, manual: true });

    const [{ questions, numberOfPages, error, loading }, getQuestions] = useQuestions({
        axiosConfig: {
            params: {
                ...filters
            }
        }
    });

    useEffect(() => {
        if (updateData) {
            setLoading({ show: false, message: "" });
            getQuestions({ params: { ...filters } }).then(() => {
                setCustomAlert({ show: true, message: "Tu respuesta ha sido enviada.", severity: "success" });
            });
        }
    }, [updateData])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }
        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [error, updateError]);

    useEffect(() => {
        console.log(questions);
    }, [questions])

    useEffect(() => {
        setLoading({ show: loading, message: "Cargando preguntas" })
    }, [loading])


    const handleShowAnswer = (i) => {
        setShowAnswer((oldShowAnswer) => {
            return oldShowAnswer === i ? null : i
        });
    }

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            if (e.target.name !== "page") {
                return {
                    ...oldFilters,
                    [e.target.name]: e.target.value,
                    page: 1
                }
            }
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleAnswer = (question) => {
        setSelectedQuestion(question);
        setShow(true);
    }

    const handleClose = async (answer) => {
        setShow(false);
        if (answer) {
            setLoading({ show: true, message: "Enviando respuesta" });
            await updateQuestion({ data: { answer } });
            setLoading({ show: false, message: "" });
        }
        setSelectedQuestion(null);
    }

    return (
        <div className="p-4">
            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoChatboxEllipsesOutline />
                <p>Preguntas y respuestas</p>
            </div>
            <div className="bg-white rounded">
                <div>
                    <div className="flex items-center justify-between">
                        {
                            tabsLink.map((tab, i) => {
                                return (
                                    <div className={clsx([`flex justify-center w-full text-xl text-gray-500 items-center cursor-pointer p-2`],
                                        {
                                            'text-main border-b border-main': tab.value === activeTab
                                        }
                                    )} key={i} onClick={() => { setActiveTab(tab.value) }}>
                                        {tab.icon}
                                        <h1 className="ml-2">{tab.title}</h1>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <TabBody show={activeTab === 1}>
                            {
                                questions?.length > 0 ?
                                    questions.map((question, i) => {
                                        return (
                                            <div key={i} className="border-b py-4">
                                                {
                                                    question?.answer &&
                                                    <div className="flex justify-end items-center text-xl text-green-500">
                                                        Respondida < IoCheckmarkCircleSharp />
                                                    </div>
                                                }
                                                <div className="flex items-center">
                                                    <div className="w-1/2">
                                                        <div className="flex items-center">
                                                            {/* <b>{i + 1}</b> */}
                                                            <img className="w-1/12 rounded-full" src={`${process.env.REACT_APP_API_URL}/${question?.product?.productImages?.[0].path}`} alt="" />
                                                            <a href={`${process.env.REACT_APP_HOST}products/${question?.product?.slug}`} className="text-blue-500 text-xl">
                                                                {question?.product?.name}
                                                            </a>
                                                        </div>
                                                        <div className="text-gray-500 mt-4">
                                                            {question?.question ? question?.question : <span className="text-red-500">No hay pregunta.</span>} - <b>{question.createdAt.toLocaleString()}</b>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/2">
                                                        <div className="font-bold text-gray-500">
                                                            Cliente:
                                                        </div>
                                                        <div className="text-right">
                                                            <img className="ml-auto rounded-full w-16 h-16 shadow-lg" src={`${process.env.REACT_APP_API_URL}/${question?.askedBy?.imgPath}`} alt="" />
                                                            {question?.askedBy?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    question?.answer ?
                                                        <div className="text-right">
                                                            <button className="flex items-center ml-auto text-main" onClick={() => { handleShowAnswer(i) }}>
                                                                Ver respuesta {showAnswer === i ? <IoChevronUp /> : <IoChevronDownSharp className="ml-2" />}
                                                            </button>
                                                            {
                                                                showAnswer === i &&
                                                                <div className="animate__animated animate__fadeInLeft animate__faster text-left text-gray-500">
                                                                    {question?.answer} - <b>{question?.answeredAt.toLocaleString()}</b>
                                                                </div>
                                                            }
                                                        </div>
                                                        :
                                                        <div className="text-right mt-4 flex items-center justify-end text-red-500">
                                                            <p className="mx-2">No has respondido aun.</p>

                                                            <Button onClick={() => { handleAnswer(question) }} className="items-center">
                                                                <p>
                                                                    Responder
                                                                </p>
                                                                <IoArrowRedoSharp className="ml-2" />
                                                            </Button>
                                                        </div>
                                                }
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="text-red-500 text-center mt-8">
                                        No tienes preguntas actualmente.
                                    </div>
                            }
                        </TabBody>
                    </div>
                </div>
                <div className="py-4">
                    <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
                </div>
                <AnswerFormModal question={selectedQuestion?.question} show={show} onClose={handleClose} />
            </div>
        </div>
    )
}

export default QuestionAnswers;