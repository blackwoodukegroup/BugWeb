<template>
  <div class="playlists">
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Playlists',
  components: {
   // HelloWorld
  },
  computed: {
    userToken() {
        return this.$store.userToken
    }
  }
}
</script>