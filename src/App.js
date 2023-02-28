import { useEffect, useState } from "react";
import {
  BrowserRouter as Router, useHistory,
} from "react-router-dom";
import Routes from './Routes';

import CustomAlert from "./components/CustomAlert";
import { useAuth } from "./contexts/AuthContext";

function App() {

  const history = useHistory();

  const { customLoading, customAlert, setCustomAlert } = useAuth();

  const [dots, setDots] = useState("");

  useEffect(() => {
    let id;

    if (customLoading.show) {
      id = setInterval(() => {
        setDots((oldDots) => oldDots.length < 3 ? oldDots + "." : "");
      }, 500);
    }

    return () => {
      if (id) clearInterval(id);
    }
  }, [customLoading]);

  useEffect(() => {
    history?.listen((location, action) => {
      document?.querySelector('body')?.scrollTo(0, 0)
    });
  }, [history]);

  const handleClose = () => {
    setCustomAlert({ show: false, message: "", severity: null })
  }


  return (
    <Router>
      {
        customLoading.show ?
          <div className="w-full h-full bg-white flex bg-opacity-80 fixed" style={{ zIndex: 60 }}>
            <div className="m-auto">
              <div className="spinner">
                <div className="double-bounce1 bg-main"></div>
                <div className="double-bounce2 bg-main"></div>
              </div>
              <div className="text-gray-700 text-2xl">{customLoading.message}{dots}</div>
            </div>

          </div>
          :
          null
      }

      <CustomAlert show={customAlert.show} message={customAlert.message} duration={5000} onClose={handleClose} severity={customAlert.severity} />

      <Routes />
    </Router>
  );
}

export default App;
