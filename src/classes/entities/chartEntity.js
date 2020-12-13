export default class chartEntity extends baseEntity {

    constructor (entityId, dateAdded, description, url, local_fileName, local_id) {
        super(entityId);
        this.dateAdded = dateAdded; // JS date
        this.dateUpdated = dateUpdated; // JS date
        this.description = description; // string
        this.url = url; // string
        if ( local_fileName !== undefined && local_id !== undefined ) {
            this.local = { 
                'fileName': local_fileName, // string
                'id': local_id // string
            }
        }
    }
}