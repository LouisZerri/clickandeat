import React, { useEffect, useState } from 'react';
import OrderService from '../services/OrderService';
import { toast } from 'react-toastify';
import {Orders} from "../models/OrderModel.ts";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const OrdersList: React.FC = () => {
    const [orders, setOrders] = useState<Orders[]>([]);

    const navigate = useNavigate();


    const fetchOrders = async () => {
        try {
            const data = await OrderService.getAllOrders();
            setOrders(data);
        } catch (err) {
            console.log(err);
            toast.error("Erreur lors du chargement des commande", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Voulez-vous supprimer cette commande ?')) return;

        try {
            await OrderService.deleteOrder(id);
            setOrders((prev) => prev.filter((order) => order.id !== id));
            toast.success("Commande supprimée avec succès !", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        } catch (err) {
            console.log(err);
            toast.error("Erreur lors de la suppression de la commande", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="mt-5">
            <h2 className="mb-4">Liste des commandes</h2>
            <div className="mb-3">
                <Link to="/commande" className="btn btn-outline-secondary">
                    <i className="fa-solid fa-arrow-left me-2"></i> Nouvelle commande
                </Link>
            </div>
            <table className="table table-bordered table-striped">
                <thead className="table-light">
                <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>Méthode de paiement</th>
                    <th>Total</th>
                    <th className="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <tr key={order.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/commande?id=${order.id}`)}
                        >
                            <td>{order.nb_order}</td>
                            <td>{order.customer.name}</td>
                            <td>{order.payment_method}</td>
                            <td>{order.total.toFixed(2)} €</td>
                            <td className="text-center">
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(order.id)
                                    }}
                                >
                                    <i className="fas fa-trash" /> Supprimer
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center text-muted">
                            Aucune commande trouvée
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersList;
