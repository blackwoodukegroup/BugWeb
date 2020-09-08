export default class SongLib {
    constructor(dataFromApi){
        this.data = dataFromApi;
        this.data.forEach((song, index) => {
            song.id = 'song_' + index;
            
            if ( song.charts != null ) song.charts.forEach((chart, index) => chart.id = 'chart_' + index);
            if ( song.links != null ) song.links.forEach((link, index) => link.id = 'link_' + index);
            if ( song.notes != null ) song.notes.forEach((note, index) => note.id = 'note_' + index);
        });
    }

    getSongCount(){
        if ( this.data == null )
            return 0;
        else
            return Object.keys(this.data).length;
    }

    getSongs(){
        return this.data;
    }

    getSongList(sortProp, sortDescending, listFilter){

        var result = [];

        this.data.forEach((song) => {
            if ( listFilter == null || listFilter == "" )
                result.push(song);
            else {
                var regExp = new RegExp(listFilter, "gi");
                if ( regExp.test(song.title) || regExp.test(song.artist) )
                    result.push(song);
            } 
        });

        if ( sortProp != null && sortDescending != null ) {

            switch(sortProp){
                case "mostRecentChartUpdate":
                    result.sort((a,b) => {
                        if ( sortDescending )
                            return  a[sortProp] < b[sortProp] ? 1 : -1;
                        else 
                            return  a[sortProp] > b[sortProp] ? 1 : -1;
                    });
                    break;
                default:
                    result.sort((a,b) => {
                        if ( sortDescending )
                            return  a[sortProp].toLowerCase() < b[sortProp].toLowerCase() ? 1 : -1;
                        else 
                            return  a[sortProp].toLowerCase() > b[sortProp].toLowerCase() ? 1 : -1;
                    });
            }

        }

        return result;
    }
}
