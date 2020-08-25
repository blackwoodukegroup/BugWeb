<template>
    <b-card href="#" v-if="item != null" v-bind:title="item.title" v-bind:sub-title="item.artist">
        <b-list-group>
            <b-list-group-item v-for="url in geturlarray()" v-bind:href="item.URL[url].URL" v-bind:key="url">{{ url }}</b-list-group-item>
            <!-- <b-button class="mr-1" v-for="url in geturlarray()" v-bind:href="item.URL[url].URL" v-bind:key="url">{{ url }}</b-button> -->
        </b-list-group>
    </b-card>
</template>

<script>
export default {
    name: "LibItemDetail",
    props: {
        item: null
    },
    methods: {
        geturlarray(){
            if (this.item != null) {
                return Object.keys(this.item.URL)
            } else {
                return {}
            }
        }
    }
    
}
</script>

<style scoped>

</style>