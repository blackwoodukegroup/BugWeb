<template>
  <b-overlay :show="playlists == null || playlistSaving">
    <div class="playlists">
      <PlaylistBrowse
        v-if="! editMode"
        ref="PlaylistBrowse"
        :playlists="playlists"
        :playlist-types="playlistTypes"
        :songs="songs"
        @select-playlist="selectPlaylist"
        @edit-playlist="editPlaylist"
        @new-playlist="newPlaylist"
        @delete-playlist="deletePlaylist"
        @duplicate-playlist="duplicatePlaylist"
      />
      <PlaylistEdit v-else 
        :editMode="editMode" 
        :playlist="playlistToEdit"
        :playlistTypes="playlistTypes"
        :songs="songs"
        :charts="charts"
        @save-playlist="savePlaylist"
        @cancel-edit="cancelEdit"
      />
    </div>
  </b-overlay>
</template>

<script>
import Axios from "axios";
import PlaylistBrowse from "@/components/playlist/PlaylistBrowse.vue";
import PlaylistEdit from "@/components/playlist/PlaylistEdit.vue";
import PlaylistLib from "@/classes/playlistlib.js";
import { cloneDeep } from 'lodash';

export default {
  name: "Playlists",
  components: {
    PlaylistBrowse,
    PlaylistEdit,
  },
  data: function () {
    return {
      editMode: null, // editMode ( null=browser, edit=edit existing,  new=edit new )
      selectedPlaylistID: null,
      playlists: null,
      playlistTypes: null,
      playlistSaving: false,
      songs: null,
      charts: null
    };
  },
  methods: {
    selectPlaylist(id){
      this.selectedPlaylistID = id;
    },
    newPlaylist(){
      console.log("new playlist");
      this.selectedPlaylistID = null;
      this.editMode ="new";
    },
    editPlaylist(id){
      console.log("edit playlist:", id);
      this.editMode = "edit";
    },
    cancelEdit(){
      console.log("cancel edit");
      this.editMode = null;
    },
    deletePlaylist(playlistIdToDelete){
      console.log("delete playlist:", playlistIdToDelete);

      var _this = this;

      Axios.post(
        this.$appConstants.bugUrl +
        "?command=deletePlaylist&user-token=" +
        this.$store.userToken,
        { "playlistId": playlistIdToDelete
        },
        {
            headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
            // won't work with application/json due to CORS
        }
      ).then((response) => {
        console.log(response);
        if ( response.status == 200 && response.data && response.data.status == "success" ) {
          
          if ( response.data.data == true ) { // a 'true' indicates a successfull deletion
            _this.selectedPlaylistID = null;

            _this.$delete(_this.playlists, playlistIdToDelete);

          }
          else {
            alert("Unexpected response by API: " + JSON.stringify(response.data));
          }

        }
        else {
          alert(response.data.message);
        }

      }).catch((err) => {
        alert("Network Error: " + err.message);
        console.log(err);
      });
    },
    duplicatePlaylist(id){
      console.log("duplicate playlist:", id);
      this.editMode = "copy"
    },
    savePlaylist(updatedPlaylist){
      var _this = this;

      Axios.post(
        this.$appConstants.bugUrl +
        "?command=savePlaylist&user-token=" +
        this.$store.userToken,
        { "playlistId": _this.selectedPlaylistID,
          "playlist": updatedPlaylist 
        },
        {
            headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
            // won't work with application/json due to CORS
        }
      ).then((response) => {
        console.log(response);
        if ( response.status == 200 && response.data && response.data.status == "success" ) {
          
          if ( typeof response.data.data == "string" ) { 
            // string returned means a new ID
          
            _this.$set(_this.playlists, response.data.data, updatedPlaylist);
          } 
          else if ( response.data.data == true ) { 
            // a 'true' indicates a successfull update
            
            _this.$set(_this.playlists, _this.selectedPlaylistID, updatedPlaylist);

          }
        }
      }).catch((err) => {
        alert("Network Error: " + err.message);
        console.log(err);
      });
    }
  },
  computed: {
    userToken() {
      return this.$store.userToken;
    },
    playlistToEdit() {
      if ( this.selectedPlaylistID == null ) {
        return PlaylistLib.newPlaylist();
      }
      else {
        return cloneDeep(this.playlists[this.selectedPlaylistID]);
      }
    }
  },
  created: function () {
    Axios.get(
      this.$appConstants.bugUrl +
        "?command=getPlaylistData&user-token=" +
        this.$store.userToken
    )
      .then((response) => {
        if (response.data.status == "success") {
          this.playlists = response.data.data.playlists ?? {};
          this.playlistTypes = response.data.data.playlistTypes ?? {};
          this.songs = response.data.data.songs ?? {};
          this.charts = response.data.data.charts ?? {};
        } else {
          alert("API Error: " + response.data.message);
          console.log(response.data);
        }
      })
      .catch((err) => {
        alert("Network Error: " + err.message);
        console.log(err);
      });
  },
};
</script>
