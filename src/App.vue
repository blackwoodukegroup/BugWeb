<template>
  <div id="app">
    <b-navbar id="nav">
      <b-navbar-brand href="#">BUGweb</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item><router-link to="/">Home</router-link></b-nav-item>
        <b-nav-item><router-link to="/library">Song Library</router-link></b-nav-item>
        <b-nav-item><router-link to="/playlists">Playlists</router-link></b-nav-item>
        <b-nav-item><router-link to="/admin">Admin</router-link></b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  /* color: #2c3e50; */
}

#nav {
  padding: 10px;
  /* background-color:grey; */
}

#nav a {
  font-weight: bold;
  /* color: #2c3e50; */
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
