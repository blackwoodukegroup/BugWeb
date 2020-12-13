export default class noteEntity extends baseEntity {

    constructor(entityId, note, dateAdded){
        super(entityId);
        this.note = note; // string
        this.dateAdded = dateAdded; // JS date
    }
}