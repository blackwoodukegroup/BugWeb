<template>
  <div>
    <b-row>
      <b-col md="8">
        <b-form-group label="Playlist Name" label-for="input-name">
          <b-form-input id="input-name" v-model="editedPlaylist.name"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-form-group label="Date" label-for="input-date">
          <b-form-input id="input-date" v-model="editedPlaylist.date" type="date"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-form-group label="Type" label-for="input-type">
          <b-form-select
            id="input-type"
            v-model="editedPlaylist.type"
            :options="playlistTypeOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="7">
        <h3>Songs</h3>
        <b-list-group>
          <b-list-group-item
            class="py-1"
            v-for="songId in editedPlaylist.songs"
            :key="songId"
            :active="songId == selectedPlaylistSongId"
            @click="selectedPlaylistSongId=songId"
          >
            {{ songs[songId].title }} - {{ songs[songId].artist }}
            <b-button-group size="sm" v-if="songId == selectedPlaylistSongId" style="float:right">
              <b-button>
                <b-icon icon="arrow-down" aria-hidden="true"></b-icon>
              </b-button>
              <b-button>
                <b-icon icon="arrow-up" aria-hidden="true"></b-icon>
              </b-button>
              <b-button>
                <b-icon icon="trash" aria-hidden="true"></b-icon>
              </b-button>
            </b-button-group>
          </b-list-group-item>
        </b-list-group>
        <div class="mt-2">
          <b-button @click="save">Save</b-button>
          <b-button @click="cancel" class="ml-2">Cancel</b-button>
        </div>
      </b-col>
      <b-col md="5">
        <h3>Library</h3>
        <b-list-group>
            
                <b-list-group-item
                    class="py-1"
                    v-for="song in songs"
                    :key="song.id"
                    :active="song.id == selectedLibrarySongId"
                    @click="selectedLibrarySongId=song.id"
                >
                    <h5>{{ song.title }}</h5>
                    <p class="my-1 ml-2">{{ song.artist }}</p>
                    <div v-if="song.id == selectedLibrarySongId">
                        <b-overlay :show="showDefaultChartOverlay" variant="dark">
                            <b-input-group>
                                <b-input-group-prepend>
                                    <b-button size="sm"><b-icon icon="bag-plus" aria-hidden="true"></b-icon></b-button>
                                </b-input-group-prepend>
                                    <b-form-select size="sm" 
                                        v-model="defaultChartForSelectedLibrarySong"
                                        :options="chartsForSelectedLibrarySong"
                                    />
                            </b-input-group>
                        </b-overlay>
                    </div>
                </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col md="6"></b-col>
      <b-col md="6"></b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'PlaylistEdit',
    data: function(){
        return {
            editedPlaylist: null,
            selectedPlaylistSongId: null,
            selectedLibrarySongId: null,
            showDefaultChartOverlay: false
        }
    },
    props: {
        playlist: Object,
        songs: Object,
        charts: Object,
        playlistTypes: Object,
        editMode: String
    },
    methods: {
        selectPlaylistSong(arg){
            console.log(arg);
        },
        save(){
            this.$emit("save-playlist", this.editedPlaylist)
        },
        cancel(){
            this.$emit("cancel-edit");
        }
    },
    computed: {
        playlistTypeOptions(){
            var options = this.playlistTypes;

            return Object.keys(options).map((id) => 
                ({
                    value: id,
                    text: options[id].description
                })
            );
        },
        chartsForSelectedLibrarySong(){
            var theSong = this.songs[this.selectedLibrarySongId];
            var chartIdsForTheSong = theSong.charts;

            var chartOptions = chartIdsForTheSong.map((id) =>
                ({
                    value: id,
                    text: this.charts[id].description
                })
            )
            
            return chartOptions;
        },
        defaultChartForSelectedLibrarySong: {

            get: function(){

                var song = this.songs[this.selectedLibrarySongId]

                var defaultChartId = song.defaultChart;

                // specifid chart takes precedence
                if ( defaultChartId != null ) 
                    return defaultChartId;

                // if only one chart, return that
                if ( song.charts.length == 1)
                    return song.charts[0];

                if ( song.charts.length > 1 ) {

                    var _this = this;

                    var bugCharts = song.charts.filter(function(chartId){
                        var chartDescription = _this.charts[chartId].description ?? "";
                        return chartDescription.match(/^bug\b/i) && ! chartDescription.match(/\bold\b/i);
                    });

                    if ( bugCharts.length == 1 )
                        return bugCharts[0];
                }

                return null;
            },
            set: function(newValue){

                console.log(newValue);

                this.showDefaultChartOverlay = true;
                var _this = this;

                axios
                    .post(
                        this.$appConstants.bugUrl + "?command=setDefaultChart&user-token=" + this.$store.userToken,
                        { songId: _this.selectedLibrarySongId, chartId: newValue },
                        { headers: { 'Content-Type': 'text/plain;charset=utf-8'} }
                    )
                    .then((response) => {
                        _this.showDefaultChartOverlay = false;

                        if ( response.data.status == "success" ) {
                            // todo: mutate the prop !!!
                            _this.songs[_this.selectedLibrarySongId].defaultChart = newValue;
                        } else {
                            console.log(response.data.message);
                            alert('ERROR: ' + response.data.message);
                        }
                    })
                    .catch((err) => {
                        _this.showDefaultChartOverlay = false;
                        alert("ERROR: " + err.message);
                        console.log(err);
                    });
            }
        }
    },
    created: function() {
        this.editedPlaylist = Object.assign({}, this.playlist);

        console.log(this.playlistTypeOptions);
    }
}
</script>