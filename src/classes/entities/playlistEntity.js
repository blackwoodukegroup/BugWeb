export default class playlistEntity extends baseEntity {

    constructor(entityId, date, name, type, songs){
        super(entityId);
        this.date = date; // JS date
        this.name = name; // string
        this.type = type; // string
        this.songs = songs; // songCollection
    }
}