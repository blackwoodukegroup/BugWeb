<template>
  <div>
    <b-row>
      <b-col md="8">
        <b-form-group label="Playlist Name" label-for="input-name">
          <b-form-input id="input-name" v-model="editedPlaylist.name" @input="dirty=true"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-form-group label="Date" label-for="input-date">
          <b-form-input id="input-date" v-model="editedPlaylist.date" type="date" @input="dirty=true"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-form-group label="Type" label-for="input-type">
          <b-form-select @input="dirty=true"
            id="input-type"
            v-model="editedPlaylist.type"
            :options="playlistTypeOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="7">
        <div style="max-height:30em; overflow:auto">
          <h3>Songs</h3>
          <b-list-group>
            <b-list-group-item
              class="py-1"
              v-for="(songId, songIndex) in editedPlaylist.songs"
              :key="songIndex"
              :active="songIndex == selectedPlaylistSongIndex"
              @click="selectedPlaylistSongIndex=songIndex"
            >
              {{ getPlaylistSongNumberString(songIndex, editedPlaylist.songs.length) }} - {{ songs[songId].title }} - {{ songs[songId].artist }}
              <b-button-group size="sm" v-if="songIndex == selectedPlaylistSongIndex" style="float:right">
                <b-button @click.stop="moveSongDown" :disabled="songIndex==editedPlaylist.songs.length-1">
                  <b-icon icon="arrow-down" aria-hidden="true"></b-icon>
                </b-button>
                <b-button @click.stop="moveSongUp" :disabled="songIndex==0">
                  <b-icon icon="arrow-up" aria-hidden="true"></b-icon>
                </b-button>
                <b-button @click.stop="removeSong">
                  <b-icon icon="trash" aria-hidden="true"></b-icon>
                </b-button>
              </b-button-group>
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="mt-2">
          <b-button @click="save" :disabled="! dirty">Save</b-button>
          <b-button @click="cancel" class="ml-2">{{ dirty ? "Cancel" : "Close" }}</b-button>
        </div>
      </b-col>
      <b-col md="5" style="max-height:30em; overflow:auto">
        <h3>Library</h3>
        <b-list-group>
          <b-list-group-item
              class="py-1"
              v-for="song in songList"
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
                              <b-button size="sm" @click="addSelectedSong"><b-icon icon="bag-plus" aria-hidden="true"></b-icon></b-button>
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
  </div>
</template>

<script>
import axios from "axios";
import Vue from 'vue';
// import * as helper from '@/helper/helper.js';
import { cloneDeep } from 'lodash';

export default {
    name: 'PlaylistEdit',
    data: function(){
        return {
            editedPlaylist: null,
            selectedPlaylistSongIndex: null,
            selectedLibrarySongId: null,
            showDefaultChartOverlay: false,
            dirty: false
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
      save(){
        // todo: validation
        var valid = true;
        if ( valid ) {
          this.$emit("save-playlist", this.editedPlaylist)
          this.dirty = false;
        }
      },
      cancel(){
        this.$emit("cancel-edit");
      },
      addSelectedSong(){
        this.editedPlaylist.songs.push(this.selectedLibrarySongId);
        this.dirty = true;
      },
      moveSongUp(){
        var temp = this.editedPlaylist.songs[this.selectedPlaylistSongIndex -1];
        Vue.set(this.editedPlaylist.songs, this.selectedPlaylistSongIndex -1, this.editedPlaylist.songs[this.selectedPlaylistSongIndex]);
        Vue.set(this.editedPlaylist.songs, this.selectedPlaylistSongIndex, temp);
        this.selectedPlaylistSongIndex--;
        this.dirty = true;
      },
      moveSongDown(){
        var temp = this.editedPlaylist.songs[this.selectedPlaylistSongIndex +1];
        Vue.set(this.editedPlaylist.songs, this.selectedPlaylistSongIndex +1, this.editedPlaylist.songs[this.selectedPlaylistSongIndex]);
        Vue.set(this.editedPlaylist.songs, this.selectedPlaylistSongIndex, temp);
        this.selectedPlaylistSongIndex++;
        this.dirty = true;
      },
      removeSong(){
        if ( confirm("Remove Song - Are You Sure?") ){
          this.editedPlaylist.songs.splice(this.selectedPlaylistSongIndex, 1);
          this.selectedPlaylistSongIndex = null;
          this.dirty = true;
        }
      },
      getPlaylistSongNumberString: function(index, totalSongs){
        var result = '' + (index + 1);
        while ( result.length < (''+totalSongs).length ) {
          result = '0' + result;
        }
        return result;
      }
    },
    computed: {
      songList() {
        return Object.entries(this.songs).map( (x) => { 
          var q = Object.assign({}, x[1]);
          q.id = x[0];
        return q });
      },
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
        if ( this.selectedLibrarySongId != undefined ) {
          var theSong = this.songs[this.selectedLibrarySongId];
          var chartIdsForTheSong = theSong.charts;

          var chartOptions = chartIdsForTheSong.map((id) =>
              ({
                  value: id,
                  text: this.charts[id].description
              })
          )
          return chartOptions;
        } else {
          return [];
        }
      },
      defaultChartForSelectedLibrarySong: {

        get: function(){

          if ( this.selectedLibrarySongId != undefined ) {

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
          }
          
          return null;
        },
        set: function(newValue){

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
                  _this.songs[_this.selectedLibrarySongId].defaultChart = newValue;
              } else {
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
      this.editedPlaylist = cloneDeep(this.playlist);
      console.log('blah');
    }
}
</script>