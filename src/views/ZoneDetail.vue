<template>
  <v-container>
    <h2> Detalle de la Zona </h2>
    <v-row>
        <v-col class="mb-6">
            <div>
                <label for="">Nombre </label>
                <span>{{ zone.name }}</span>
            </div>
            <div>
                <label for="">Longitud </label>
                <span>{{ zone.long }}</span>
            </div>
            <div>

                <label for="">Direción Postal </label>
                <span>{{ zone.postal_address }}</span>
            </div>
            <br>
            <v-btn rounded color="primary" @click='toMeasuresList()'>Lista de Mediciones</v-btn>

        </v-col>
        <v-col class="mb-6">
            <div>
                <label for="">Descripcion </label>
                <span>{{ zone.description }}</span>
            </div>
            <div>
                <label for="">Latitud </label>
                <span>{{ zone.lat }}</span>
            </div>
            <div>
                <label for="">Zona Horaria </label>
                <span>{{ zone.time_zone }}</span>
            </div>
            <br>

            <v-btn rounded color="primary" @click='toHidraulicsList()'>Lista de Hidraulicos</v-btn>

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
              id: '1',
              farm_id: '2',
              name: 'Zona 2',
              description: 'Zona 2',
              lat: '12.123.12',
              long: '-234.2323.2',
              postal_address: '2',
              time_zone: 'GMT-3',
          }
      }
    },
    computed: {
     
    },
    created: function() {
        let zone_id = this.$route.params.id
        // this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/zones/${zone_id}  `,{
        //     headers: {
        //     api_key: '9Ev6ftyEbHhylMoKFaok',
        //     Accept: 'application/json ',
        //     }
        // })
        // .then((response) => {
        //     let farm_id = this.$route.params.id
        //     console.log(response);
        //     let farm_data = response.data.filter( data => {
        //         return data.id == user_id
        //     })
        //     this.zone.id = farm_data[0].id
        //     this.zone.name = farm_data[0].name
        //     this.zone.description = farm_data[0].description
        //     this.zone.lat = farm_data[0].latitude
        //     this.zone.long = farm_data[0].longitude
        //     this.zone.postal_address = farm_data[0].postalAddress
        //     this.zone.time_zone = farm_data[0].timeZone

        // })
        // .catch((error) => {
        //     console.log(error);
        // }); 
    },
    methods: {
        toMeasuresList(){
            this.$router.push({name: 'measures', params: {
                id: this.zone.id
            }})
        },
        toHidraulicsList(){
            this.$router.push({name: 'hidraulics', params: {
                id: this.zone.id
            }})
        }
    }
      
}
</script>