<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="8"
        class="elevation-1"
    >
        <template v-slot:item.actions="{ item }">
            <v-icon v-if="item.actions" @click="item.actions.click">{{item.actions.icon}}</v-icon>
        </template>
    </v-data-table>
  </div>
</template>
<style> 

</style>
<script>
export default {
    name: 'Table',
    data(){
      return{
      }
    },
    props:{
        headers: {
            type: Array,
            default: []
        },
        items: {
            type: Array,
            default: []
        }
    },
    computed: {
    },
    methods: {

    }      
}
</script>