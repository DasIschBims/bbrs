import ReactDOM from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ServerStats from "./pages/ServerStats.tsx";
import FrontPage from "./pages/FrontPage.tsx";
import ServerList from "./pages/ServerList.tsx";
import {Slide, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <ToastContainer
            position={"top-right"}
            autoClose={2500}
            hideProgressBar={false}
            transition={Slide}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={"dark"}
        />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FrontPage/>}/>
                <Route path="/stats" element={<ServerStats/>}/>
                <Route path="/list" element={<ServerList/>}/>
            </Routes>
        </BrowserRouter>
    </>
)
