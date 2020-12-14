export default class PlaylistLib {

    constructor(){

    }

    static newPlaylist(){
        return {
            name: "New Playlist",
            date: "",
            type: "regular", // todo: somehow populate this from the api
            songs: []
        }
    }

    static copyPlaylist(playlist){
        var newPlaylist = newPlaylist();

        newPlaylist.name = playlist.name;
        newPlaylist.date = playlist.date;
        newPlaylist.type = playlist.type;
        if ( playlist.songs && playlist.songs.length > 0 ) {
            playlist.songs.foreach((song) => { newPlaylist.songs.push(song) });
        }
    }
}