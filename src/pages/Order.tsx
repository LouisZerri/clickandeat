import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { OrderItems } from '../models/OrderDetailModel';
import { Customer } from '../models/CustomerModel';
import CustomerService from '../services/CustomerService';
import OrderService from '../services/OrderService';
import AddItemModal from '../components/AddItemModal';
import { InitialOrderValues, UpdateOrderPayload, OrderDetailResponse } from "../models/OrderModel.ts";

const Order: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const editingId = searchParams.get('id');
    const isEditMode = editingId !== null;

    const [nb_order, setNbOrder] = useState<string>(Math.floor(10000 + Math.random() * 900000).toString());
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<InitialOrderValues | null>(null);

    // Charger les clients au démarrage
    useEffect(() => {
        CustomerService.findAllCustomer().then(setCustomers);
    }, []);

    // Recalculer le total quand les aliments changent
    useEffect(() => {
        const totalCommande = orderItems.reduce((acc, item) => acc + item.total, 0);
        setTotal(totalCommande);
    }, [orderItems]);

    // Charger la commande à modifier si on est en mode édition
    useEffect(() => {
        if (editingId) {
            const loadCommande = async () => {
                try {
                    const data = await OrderService.getOrderById(Number(editingId));

                    const items = (data.order_details as OrderDetailResponse[])
                        .filter((d) => d.food_item !== null)
                        .map((d) => ({
                            id: d.id,
                            itemId: d.food_item.id,
                            item_name: d.food_item.name,
                            price: d.food_item_price,
                            quantity: d.quantity,
                            total: d.food_item_price * d.quantity,
                        }));

                    setNbOrder(data.nb_order);
                    setPaymentMethod(data.payment_method);
                    setSelectedCustomerId(data.customer.id);
                    setOrderItems(items);

                    setInitialValues({
                        nb_order: data.nb_order,
                        payment_method: data.payment_method,
                        total: data.total,
                        customerId: data.customer.id,
                        orderItems: items.map(({ itemId, quantity, price }) => ({
                            itemId,
                            quantity,
                            price,
                        })),
                    });

                } catch (error) {
                    console.log(error);
                    toast.error("Erreur lors du chargement de la commande", {
                        position: "top-right",
                        autoClose: 2000,
                        theme: "colored",
                    });
                }
            };

            loadCommande();
        }
    }, [editingId]);

    //  Détection de modification
    const isFormModified = () => {
        if (!initialValues) return true;
        return (
            nb_order !== initialValues.nb_order ||
            paymentMethod !== initialValues.payment_method ||
            total !== initialValues.total ||
            selectedCustomerId !== initialValues.customerId ||
            JSON.stringify(orderItems.map(({ itemId, quantity, price }) => ({ itemId, quantity, price }))) !==
            JSON.stringify(initialValues.orderItems)
        );
    };

    // Supprimer un aliment
    const handleDeleteItem = (itemId: number | undefined) => {
        if (!itemId) return;
        setOrderItems((prev) => prev.filter((item) => item.itemId !== itemId));
    };

    // Valider la commande
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCustomerId || !paymentMethod || orderItems.length === 0) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        const payload: UpdateOrderPayload = {
            nb_order,
            payment_method: paymentMethod,
            total,
            customerId: selectedCustomerId,
            order_details: orderItems
                .filter((i) => i.itemId && i.quantity !== undefined && i.price !== undefined)
                .map((i) => ({
                    id: i.id,
                    food_item_price: i.price,
                    quantity: i.quantity!,
                    fooditemsId: i.itemId!,
                })),
        };

        try {
            if (isEditMode) {
                if (!isFormModified()) {
                    toast.info("Aucune modification detectée", {
                        position: "top-right",
                        autoClose: 2000,
                        theme: "colored",
                    });
                    return;
                }

                await OrderService.updateOrder(Number(editingId), payload);
                toast.info("Commande mise à jour avec succès !", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
            } else {
                await OrderService.createOrder(payload);
                toast.success("Commande créée avec succès !", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
            }

            navigate('/commandes');

        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la soumission de la commande", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="nb_order">Commande No.</label>
                            <div className="input-group">
                                <div className="input-group-text">#</div>
                                <input id="nb_order" className="form-control" type="text" value={nb_order} readOnly />
                            </div>
                        </div>

                        <div className="form-group mt-4">
                            <label htmlFor="customer">Client</label>
                            <select
                                id="customer"
                                className="form-select"
                                value={selectedCustomerId ?? ''}
                                onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                            >
                                <option value="">-- Sélectionner --</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="payment_method">Méthode de paiement</label>
                            <select
                                id="payment_method"
                                className="form-control"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="">- Sélectionner -</option>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>

                        <div className="form-group mt-4">
                            <label htmlFor="total">Total</label>
                            <div className="input-group">
                                <div className="input-group-text">€</div>
                                <input id="total" className="form-control" type="text" value={total.toFixed(2)} readOnly />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tableau des aliments */}
                <table className="table table-bordered table-hover mt-5">
                    <thead className="table-light">
                    <tr>
                        <th>Aliment</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th>Total</th>
                        <th className="text-center">
                            <button type="button" className="btn btn-sm btn-success" onClick={() => setShowModal(true)}>
                                <i className="fa-solid fa-plus"></i> Ajouter un aliment
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderItems.length > 0 ? (
                        orderItems.map((item) => (
                            <tr key={item.itemId}>
                                <td>{item.item_name}</td>
                                <td>{item.price.toFixed(2)} €</td>
                                <td>
                                    {editingItemId === item.itemId ? (
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newQty = Number(e.target.value);
                                                setOrderItems((prev) =>
                                                    prev.map((i) =>
                                                        i.itemId === item.itemId
                                                            ? {
                                                                ...i,
                                                                quantity: newQty,
                                                                total: newQty * i.price,
                                                            }
                                                            : i
                                                    )
                                                );
                                            }}
                                            onBlur={() => setEditingItemId(null)}
                                            autoFocus
                                        />
                                    ) : (
                                        item.quantity
                                    )}
                                </td>
                                <td>{item.total.toFixed(2)} €</td>
                                <td className="text-center">
                                    <i
                                        className="fas fa-pen text-primary me-3"
                                        role="button"
                                        title="Modifier"
                                        onClick={() => item.itemId && setEditingItemId(item.itemId)}
                                    />
                                    <i
                                        className="fas fa-trash text-danger"
                                        role="button"
                                        title="Supprimer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteItem(item.itemId);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="fst-italic text-center text-muted">
                                Aucun aliment sélectionné
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <div className="form-group mt-4">
                    <button type="submit" className="btn btn-dark" disabled={isEditMode && !isFormModified()}>
                        <i className="fa-solid fa-database"></i> {isEditMode ? 'Mettre à jour' : 'Valider'}
                    </button>
                    <button type="button" className="btn btn-outline-dark ms-3" onClick={() => navigate('/commandes')}>
                        <i className="fa-solid fa-table"></i> Voir les commandes
                    </button>
                </div>
            </form>

            {/* Modale aliment */}
            <AddItemModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={(newItem) => {
                    setOrderItems((prevItems) => {
                        const existingIndex = prevItems.findIndex((i) => i.itemId === newItem.itemId);

                        if (existingIndex !== -1) {
                            const updated = [...prevItems];
                            const existingItem = updated[existingIndex];

                            const newQuantity = existingItem.quantity + newItem.quantity;
                            updated[existingIndex] = {
                                ...existingItem,
                                quantity: newQuantity,
                                total: newQuantity * existingItem.price,
                            };

                            return updated;
                        } else {
                            return [...prevItems, newItem];
                        }
                    });

                    setShowModal(false);
                }}
            />
        </>
    );
};

export default Order;
