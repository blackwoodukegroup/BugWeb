<template>
  <div id="AdminComponent">
    <div id="AdminMenu" class="mb-3">
      <b-btn class="ml-2">
        <router-link :to="{ name: 'AdminUsers' }">User Accounts</router-link>
      </b-btn>
      <b-btn class="ml-2">Feature</b-btn>
      <b-btn class="ml-2">Feature</b-btn>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "Admin"
};
</script>

