<template>
    <div class="login">
        <b-alert v-if="alertMessage" v-bind:variant="alertType" show>{{ alertMessage }}</b-alert>
        <div v-if="userToken == null">
            <b-form inline>
                <label for="inputUsername" class="mr-2">Username</label>
                <b-form-input id="inputUsername" type="text" class="mr-2" v-model="username"/>
                <label for="inputPassword" class="mr-2">Password</label>
                <b-form-input type="password" class="mr-2" v-model="password" name="password" id="inputPassword" />
                <b-button type="submit" variant="primary" v-bind:disabled="!validInputs" v-on:click.prevent="doLogin">
                    <b-spinner v-if="showSpinner" small></b-spinner>
                    {{ loginButtonText }}
                </b-button>    
            </b-form>
        </div>
        <div v-else>
            <b-button type="submit" variant="primary" @click.prevent="doLogout">Logout</b-button>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import axios from "axios";

export default {
  name: 'Login',
  data: function() {
      return {
          username: null,
          password: null,
          alertMessage: null,
          alertType: null,
          showSpinner: false,
          loginButtonText: "Login"
      }
  },
  computed: {
      userToken() {
          return this.$store.userToken;
      },
      validInputs() {
          return ( this.username != null && this.username.length > 0 && this.password != null && this.password.length > 0 );
      }
  },
  methods:{
      doLogin: function(){
          console.info("- attempting login of user: ", this.username);

          this.showSpinner = true;
          this.loginButtonText = "please wait..."

          axios
            .post(
                this.$appConstants.bugUrl + "?command=login",
                {
                    username: this.username,
                    password: this.CryptoJS.MD5(this.password).toString()
                },
                {
                    headers: {  'Content-Type': 'text/plain;charset=utf-8'}
                }
            )
            .then((response) => {
                this.showSpinner = false;
                if ( response.data != null && response.data.data != null && response.data.data["user-token"] != null ) {
                    this.$actions.setUserToken(response.data.data["user-token"]);
                    if ( this.$route.query.redirect ) {
                        this.showAlert("success", "Login Succesful - redirecting in 2 seconds");
                        var vm = this;
                        setTimeout(function(){
                            vm.$router.push(vm.$route.query.redirect);
                        }, 2000);
                    } else {
                        this.showAlert("success", "Login succesful");
                        this.resetLoginForm();
                    }
                } else {
                    this.$actions.setUserToken(null);
                    this.showAlert("danger", "Login failed: " + response.data.message);
                    this.resetLoginForm();
                }
            })
            .catch((err) => {
                console.log(err)
                this.showAlert("danger", "An error occured during login - Please try again");
                this.resetLoginForm();
            });
      },
      resetLoginForm: function(){
          this.username = "";
          this.password = "";
          this.showSpinner = false;
          this.loginButtonText = "Login";
      },
      doLogout: function(){
          this.$actions.setUserToken(null);
          this.resetLoginForm();
          this.showAlert("success", "Logged out");
      },
      showAlert: function(alertType, alertMessage){
          this.alertType = alertType;
          this.alertMessage = alertMessage;
      },
      hideAlert: function(){
          this.alertMessage = null;
      }
  }
}
</script>
