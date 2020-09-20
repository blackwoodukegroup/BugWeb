<template>
  <div class="library">
    <b-overlay :show="songLib == null">
      <LibList :songLib="this.songLib" />
    </b-overlay>
  </div>
</template>

<script>
import LibList from "@/components/library/LibList.vue";
import SongLib from "@/classes/songlib.js";
import axios from "axios";

export default {
  name: "Library",
  components: {
    LibList,
    // LibItemDetail
  },
  data: function () {
    return {
      songLib: null
    };
  },
  created: function () {
    axios
      .get(
        "https://script.google.com/macros/s/AKfycbxoeTQ5zyiDHMa3pUAbGk4Navv2gzJqnZOd_X3YuQvSLIV2gBA/exec"
      )
      .then((response) => {
        this.songLib = new SongLib(response.data.data);
        console.log("loaded " + this.songLib.getSongCount() + " songs");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
