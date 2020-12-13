export default class linkEntity extends baseEntity {

    constructor(entityId, description, url, dateAdded) {
        super(entityId);
        this.description = description; // string
        this.url = url; // string
        this.dateAdded = dateAdded; // JS date
    }
}