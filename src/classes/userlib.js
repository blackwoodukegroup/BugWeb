export default class UserLib {

    constructor(){

    }

    static newUser(){
        return {
            username: "",
            fullname: "",
            emailaddress: "",
            disable: false,
            roles: []
        }
    }
}