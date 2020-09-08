<template>
  <div class="library">
    <h2>BUG Song Library</h2>
    <b-row>
      <b-col>
        <div v-if="songLib == null">
          <b-spinner label="loading library data..."></b-spinner>
        </div>
        <div v-else>
          <LibList :songLib="this.songLib" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import LibList from "@/components/LibList.vue";
import SongLib from "@/classes/songlib.js";

// import LibItemDetail from "@/components/LibItemDetail.vue";

import axios from "axios";

export default {
  name: "Library",
  components: {
    LibList,
    // LibItemDetail
  },
  data: function () {
    return {
      // selectedSong: null,
      songLib: null
    };
  },
  methods: {
    // songSelected(event){
    //   this.selectedSong = event
    // }
  },
  created: function () {
    if (this.songLib == null) {
      console.log("loading song library data...");
      axios
        .get(
          "https://script.google.com/macros/s/AKfycbxoeTQ5zyiDHMa3pUAbGk4Navv2gzJqnZOd_X3YuQvSLIV2gBA/exec"
        )
        .then((response) => {
          this.songLib = new SongLib(response.data.data);
          console.log("loaded " + this.songLib.getSongCount() + " songs");
        })
        .catch((err) => console.log(err));
    }
  },
};
</script>
