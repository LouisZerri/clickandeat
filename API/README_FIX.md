
# ✅ Projet corrigé : Update Order sans création de lignes fantômes

## Correctifs :
- Mise à jour réelle des lignes `order_details` via leur `id`
- Plus aucune insertion fantôme avec `orderId = null`
- `findOneOrFail` utilisé pour forcer la présence d'une ligne avant update
- Relations `.order` et `.food_item` toujours reassignées

## Exemple PUT :
{
  "nb_order": "ORD-100001",
  "payment_method": "Cash",
  "total": 18.74,
  "customerId": 1,
  "order_details": [
    {
      "id": 1,
      "food_item_price": 2.99,
      "quantity": 12,
      "fooditemsId": 9
    },
    {
      "id": 2,
      "food_item_price": 1,
      "quantity": 11,
      "fooditemsId": 14
    }
  ]
}

⚠️ Les IDs 1 et 2 doivent exister dans `order_details` sinon PUT retourne une erreur 404.
