module.exports = (old_cart) => {
    this.items = old_cart.items || {}
    this.total_qty = old_cart.total_qty || 0
    this.total_price = old_cart.total_price || 0

    this.add = (item, id) => {
        var stored_item = this.items[id]
        if(!stored_item) {
            stored_item = this.items[id] = {item: item, qty: 0, price: 0}
        }

        stored_item.qty++;
        stored_item.price += stored_item.item.price * stored_item.qty
        this.total_qty++;
        this.total_price += stored_item.item.price
    }

    this.generate_array = () => {
        var array = []
        for (var id in this.items) {
            array.push(this.items[id]);
        }
        return array
    }
}