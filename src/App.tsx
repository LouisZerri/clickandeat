import * as React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Order from "./pages/Order.tsx";
import Title from "./components/Title.tsx";
import OrdersList from "./pages/OrdersList.tsx";
import './assets/css/styles.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <main className="jumbotron jumbotron-fluid">
                <Title />

                <ToastContainer position="top-right" autoClose={3000} theme="light" />

                <div className="container">
                    <div className="row">
                        <div className="col-md-10 offset-md-1">
                                <Routes>
                                    <Route path="/" element={<Navigate to="/commande" replace />} />
                                    <Route path="/commande" element={<Order />}/>

                                    <Route path="/commandes" element={<OrdersList />}/>
                                </Routes>
                        </div>
                    </div>
                </div>
            </main>
        </BrowserRouter>
    )
}

export default App