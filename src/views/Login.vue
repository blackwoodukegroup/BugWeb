<template>
    <div v-if="userToken == null">
        <div class="login">
            <p>Please log in:</p>
            <form>
                <label for="inputUsername">username</label>
                <input id="inputUsername" v-model="username"/>
                <label for="inputPassword">Password</label>
                <input type="password" v-model="password" name="password" id="inputPassword">
                <input type="button" value="Login" title="" v-on:click.prevent="doLogin">
            </form>
        </div>
    </div>
    <div v-else>
        <p>You're logged in</p>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import axios from "axios";

export default {
  name: 'Login',
  components: {
   // HelloWorld
  },
  data: function() {
      return {
          username: null,
          password: null,
          userToken: null
      }
  },
  methods:{
      doLogin: function(){
          console.info("- attempting login of user: ", this.username);
          axios
            .post(
                "https://script.google.com/macros/s/AKfycbxoeTQ5zyiDHMa3pUAbGk4Navv2gzJqnZOd_X3YuQvSLIV2gBA/exec?command=login",
                {
                    username: this.username,
                    password: this.CryptoJS.MD5(this.password).toString()
                },
                {
                    headers: {  'Content-Type': 'text/plain;charset=utf-8'}
                }
            )
            .then((response) => {
                if ( response.data != null && response.data.data != null && response.data.data["user-token"] != null ) {
                    console.info("logon succesful");
                    this.userToken = response.data.data["user-token"];
                    this.$emit("userLoggedOn", this.userToken);
                }
            })
            .catch((err) => console.log(err));
      }
  }
}
</script>
