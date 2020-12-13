
class baseCollection {

    constructor() {
        items = [];
    }

    getCount(){
        return this.items.length;
    }

    addItem(newItem) {
        this.items.push(newItem);
    }

}