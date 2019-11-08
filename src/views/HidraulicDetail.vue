<template>
  <v-container>
    <h2> Detalle del Hidraulico </h2>
    <v-row>
        <v-col class="mb-6">
            <div>
                <label for="">Nombre </label>
                <span>{{ zone.name }}</span>
            </div>
            <div>
                <label for="">Tipo </label>
                <span>{{ zone.type }}</span>
            </div>
            
        </v-col>
        
    </v-row>

  </v-container>
</template>
<style> 

</style>
<script>
import {mapState, mapMutations} from 'vuex';
import Table from '../components/Table';
export default {
    name: 'ZoneDetail',
    data(){
      return{
          zone: {
              id: '',
              name: '',
              type: ''
          }
      }
    },
    computed: {
     
    },
    created: function() {
        let hydraulics_id = this.$route.params.id
         this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/hydraulics/${hydraulics_id}  `,{ 
             headers: {
             api_key: '9Ev6ftyEbHhylMoKFaok',
             Accept: 'application/json ',
            }
         })
         .then((response) => {
            
             this.zone.id = response.data.id
             this.zone.name = response.data.name
             this.zone.type = response.data.type
         })
         .catch((error) => {
             console.log(error);
         }); 
    },
    methods: {

    }
      
}
</script>