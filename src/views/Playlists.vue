<template>
  <b-overlay :show="playlists == null || playlistSaving">
    <div class="playlists">
      <PlaylistBrowse
        v-if="! editMode"
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
        :playlist="selectedPlaylist"
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

export default {
  name: "Playlists",
  components: {
    PlaylistBrowse,
    PlaylistEdit,
  },
  data: function () {
    return {
      editMode: null, // editMode ( null=browser, edit=edit existing,  new=edit new)
      selectedPlaylist: null,
      playlists: null,
      playlistTypes: null,
      playlistSaving: false,
      songs: null,
      charts: null
    };
  },
  methods: {
    selectPlaylist(id){
      this.selectedPlaylist = this.playlists[id];
    },
    newPlaylist(){
      console.log("new playlist");
      this.selectedPlaylist = null;
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
    deletePlaylist(id){
      console.log("delete playlist:", id);
    },
    duplicatePlaylist(id){
      console.log("duplicate playlist:", id);
    },
    savePlaylist(data){
      console.log("edited playlist:", data)

      if (this.editMode == "new") {
        // todo: save new playlist
      } else {
        this.playlists[data.id] = Object.assign({}, data);
        this.playlists[data.id].songs = data.songs.slice();
      }
    }
  },
  computed: {
    userToken() {
      return this.$store.userToken;
    },
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
