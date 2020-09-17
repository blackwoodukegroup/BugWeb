<template>
  <b-form v-if="user != null" @change="formDirty = true">
    <b-row>
      <b-col md="6">
        <b-row>
          <b-col md="6">
            <b-form-group id="input-group-username" label="User ID" label-for="input-username">
              <b-form-input
                id="input-username"
                v-model.trim="user.username"
                type="text"
                :state="usernameValid"
                required
                :disabled="! newUser"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group id="input-group-fullname" label="Full Name" label-for="input-fullname">
              <b-form-input id="input-fullname" v-model.trim="user.fullname" :state="fullnameValid && showValidation" required type="text"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group id="input-group-email" label="Email Address" label-for="input-email" >
              <b-form-input id="input-email" v-model.trim="user.emailaddress" :state="emailAddressValid && showValidation" required type="email"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group id="input-group-disable" label="Disable Account" label-for="input-disable">
              <b-form-checkbox id="input-disable" v-model="user.disable"></b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group id="input-group-password" label="Password" label-for="input-password">
              <b-form-input 
                id="input-password" 
                v-model.trim="password"
                :state="passwordValid"
                required
                type="password">
              </b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group
              id="input-group-password"
              label="Confirm Password"
              label-for="input-confirm-password"
            >
              <b-form-input
                id="input-confirm-password"
                v-model.trim="confirmPassword"
                :state="passwordValid"
                required
                type="password"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <ListManager
          list-name="Roles"
          :list-items="user.roles"
          :list-possible-items="allUserRoles"
          add-item-prompt="(add roles)"
          @listChanged="listChanged"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-button :disabled="! formDirty" @click="save">Save</b-button>
        <b-button :disabled="! formDirty" @click="cancel" class="ml-2">Cancel</b-button>
      </b-col>
    </b-row>
  </b-form>
  <p v-else>Select a user to edit</p>
</template>

<script>
import UserLib from "@/classes/userlib.js";
// import HelperLib from "@/classes/helperlib.js";

import ListManager from "@/components/ListManager.vue";

export default {
  name: "UserEdit",
  components: {
    ListManager,
  },
  props: {
    initialUser: Object,
    newUser: Boolean,
  },
  data: function () {
    return {
      user: null,
      allUserRoles: ["admin"],
      formDirty: false,
      password: null,
      confirmPassword: null,
      showValidation: false      // flag to hide validation until user attempts Save
    };
  },
  methods: {
    setModel(user) {
      this.user = UserLib.newUser();
      Object.assign(this.user, user);
    },
    listChanged(event) {
      console.log("listChanged: ", event);
      this.user.roles = event.slice();
      this.formDirty = true;
    },
    save() {
      this.showValidation = true
      if ( ! this.formValid ) 
        return;

      if ( this.password != null && this.password.length > 0 )
        this.user.passwordHash = this.CryptoJS.MD5(this.password).toString();

      this.$emit("saveUser", this.user);
      this.formDirty = false;
      this.password = "";
      this.confirmPassword = "";
      this.showValidation = false;
    },
    cancel() {
      this.setModel(this.initialUser);
      this.formDirty = false;
      this.password = "";
      this.confirmPassword = "";
      this.showValidation = false;
    },
  },
  computed: {
    passwordValid: function () {
      var p1 = this.password ?? "";
      var p2 = this.confirmPassword ?? "";

      if ( p1.length > 0 || p2.length > 0 || this.newUser )
        return ( p1 == p2 && p1.length > 5);
      else 
        return null;
    },
    usernameValid: function() {
      if ( this.showValidation )
        return ( this.user.username != null && this.user.username.length > 3 );
      else
        return null;
    },
    fullnameValid: function() {
      if ( this.showValidation )
        return ( this.user.fullname != null && this.user.fullname.length > 0);
      else
        return null;
    },
    emailAddressValid: function(){
      if ( this.showValidation )
        return ( this.user.emailaddress != null && this.user.emailaddress.length > 3);
      else
        return null;
    },
    formValid: function() {
      return (
        this.passwordValid != false 
        && this.usernameValid != false
        && this.fullnameValid != false
        && this.emailAddressValid != false
      )
    }
  },
  watch: {
    initialUser: function (newVal) {
      if (newVal) {
        this.setModel(newVal);
        this.formDirty = false;
        this.password = "";
        this.confirmPassword = "";
        this.showValidation = false;
      }
    },
    formDirty: function (newVal) {
      this.$emit("formDirty", newVal);
    },
  },
};
</script>
