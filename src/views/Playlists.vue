<template>
  <b-overlay :show="playlists == null">
    <div class="playlists">
      <b-row v-if="pageMode=='browse'">
        <b-col md="6">
          <b-table
            v-if="playlists"
            @row-clicked="selectPlaylist"
            hover
            small
            :items="playlistTableItems"
            :fields="playlistTableFields"
            sort-by="date"
            :sort-desc="true"
            :sort-compare-options="{ caseFirst: false }"
            selectable
            select-mode="single"
          >
            <template
              v-slot:cell(date)="data"
            >{{ (new Date(data.value)).toLocaleDateString("en-GB") }}</template>
            <template v-slot:cell(songs)="data">{{ data.value == null ? 0 : data.value.length }}</template>
            <template
              v-slot:cell(type)="data"
            >{{ data.value == null ? "" : playlistTypes[data.value].description }}</template>
          </b-table>
          <b-button @click="newPlaylist">New Playlist</b-button>
          <b-button @click="editPlaylist" :disabled="selectedPlaylist == null" class="ml-2">Edit</b-button>
          <b-button @click="deletePlaylist" :disabled="selectedPlaylist == null" class="ml-2" variant="danger">Delete</b-button>
          <b-button @click="duplicatePlaylist" :disabled="selectedPlaylist == null" class="ml-2">Duplicate</b-button>
        </b-col>
        <b-col md="6">
          <b-table small :items="songTableItems" :fields="songTableFields"></b-table>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col><p>Playlist Editor</p>
        <b-button @click="savePlaylist">Save</b-button>        
        <b-button class="ml-2" @click="cancelEdit">Cancel</b-button>        
        </b-col>
      </b-row>
    </div>
  </b-overlay>
</template>

<script>
import Axios from "axios";
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Playlists",
  components: {
    // HelloWorld
  },
  data: function () {
    return {
      pageMode: "browse",  // browse / edit
      playlists: null,
      playlistTypes: null,
      songs: null,
      charts: null,
      playlistTableFields: [
        { key: "name", sortable: true },
        { key: "date", sortable: true },
        { key: "songs", sortable: true },
        { key: "type", sortable: true },
      ],
      songTableFields: ["title", "artist"],
      selectedPlaylist: null,
    };
  },
  methods: {
    selectPlaylist(record) {
      this.selectedPlaylist = record.id;
    },
    newPlaylist(){

    },
    editPlaylist(){
      this.pageMode = "edit";

    },
    deletePlaylist(){

    },
    duplicatePlaylist(){

    },
    savePlaylist(){

    },
    cancelEdit(){
      this.pageMode = "browse"
    }
  },
  computed: {
    userToken() {
      return this.$store.userToken;
    },
    playlistTableItems() {
      return Object.values(this.playlists);
    },
    songTableItems() {
      if (this.selectedPlaylist == null) return [];
      var playlistSongs = this.playlists[this.selectedPlaylist].songs ?? [];
      return Object.values(this.songs).filter((song) =>
        playlistSongs.includes(song.id)
      );
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
