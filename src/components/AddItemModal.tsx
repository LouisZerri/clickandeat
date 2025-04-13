import {useEffect, useState} from 'react';
import {OrderItems} from "../models/OrderDetailModel.ts";
import {FoodItem} from "../models/FoodItemModel.ts";
import ItemService from "../services/ItemService.tsx";

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: (item: OrderItems) => void;
}

const AddItemModal = ({ show, onClose, onSubmit }: Props) => {
    const [items, setItem] = useState<FoodItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const fetchItems = async () => {
        try {
            const data: FoodItem[] = await ItemService.findAllItems();
            setItem(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (show) fetchItems()

        const selectedItem = items.find((item) => item.id === selectedItemId);
        if (selectedItem) {
            setPrice(selectedItem.price);
            setTotal(selectedItem.price * quantity);
        }

    }, [show, selectedItemId, quantity, items]);

    const handleSubmit = () => {
        const selectedItem = items.find((item) => item.id === selectedItemId);
        if (!selectedItem) return;

        const newItem: OrderItems = {
            itemId: selectedItem.id,
            item_name: selectedItem.name,
            price: selectedItem.price,
            quantity,
            total,
        };

        onSubmit(newItem);
        onClose();

        setSelectedItemId(null);
        setPrice(0);
        setQuantity(1);
        setTotal(0);
    };

    if (!show) return null;

    return (
        <div className="modal show fade d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Ajouter un aliment</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Aliment</label>
                            <select
                                className="form-select"
                                value={selectedItemId ?? ''}
                                onChange={(e) => setSelectedItemId(Number(e.target.value))}
                            >
                                <option value="">-- Choisir un aliment --</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Prix</label>
                            <input type="number" className="form-control" value={price} readOnly />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Quantité</label>
                            <input
                                type="number"
                                className="form-control"
                                value={quantity}
                                min={1}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Total</label>
                            <input type="number" className="form-control" value={total} readOnly />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" onClick={onClose}>
                            Annuler
                        </button>
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleSubmit}
                            disabled={selectedItemId === null}
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;
