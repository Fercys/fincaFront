<template>
  <v-container>
       <hr>
      <div style="width: 100%; margin: 0 auto;">  <h3> Detalle de la Finca:  <span style="color:#0d47a1">{{ farm.name }} </span> </h3></div> 
      <hr> <br> 
  
    <v-row>
        <v-col class="mb-6">
            <div>
                <label for="">Nombre </label>
                <span>{{ farm.name }}</span>
            </div>
            <div>
                <label for="">Longitud </label>
                <span>{{ farm.long }}</span>
            </div>
            <div>

                <label for="">Direción Postal </label>
                <span>{{ farm.postal_address }}</span>
            </div>
        </v-col>
        <v-col class="mb-6">
            <div>
                <label for="">Descripcion </label>
                <span>{{ farm.description }}</span>
            </div>
            <div>
                <label for="">Latitud </label>
                <span>{{ farm.lat }}</span>
            </div>
            <div>
                <label for="">Zona Horaria </label>
                <span>{{ farm.time_zone }}</span>
            </div>
        </v-col>
    </v-row>
    <v-btn rounded color="primary" @click='toZoneList()'>Lista de Zonas</v-btn>

  </v-container>
</template>
<style> 

</style>
<script>
import {mapState, mapMutations} from 'vuex';
import Table from '../components/Table';
export default {
    name: 'FarmDetail',
    data(){
      return{
          farm: {
              id: '',
              user_id: '',
              name: '',
              description: '',
              lat: '',
              long: '',
              postal_address: '',
              time_zone: '',
          }
      }
    },
    computed: {
     
    },
    created: function() {
        this.axios.get('https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/farms',{
            headers: {
            api_key: '9Ev6ftyEbHhylMoKFaok',
            Accept: 'application/json ',
            }
        })
        .then((response) => {
            let user_id = this.$route.params.id
            console.log(response);
            let farm_data = response.data.filter( data => {
                return data.id == user_id
            })
            this.farm.id = farm_data[0].id
            this.farm.name = farm_data[0].name
            this.farm.description = farm_data[0].description
            this.farm.lat = farm_data[0].latitude
            this.farm.long = farm_data[0].longitude
            this.farm.postal_address = farm_data[0].postalAddress
            this.farm.time_zone = farm_data[0].timeZone

        })
        .catch((error) => {
            console.log(error);
        }); 
    },
    methods: {
        toZoneList(){
            this.$router.push({name: 'zones', params: {
                id: this.farm.id
            }})
        }
    }
      
}
</script>