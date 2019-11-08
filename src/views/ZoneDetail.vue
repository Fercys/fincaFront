<template>
  <v-container>
     <hr>
      <div style="width: 100%; margin: 0 auto;">  <h3> Detalle de la zona:  <span style="color:#0d47a1"> {{ zone.name }} </span></h3></div> 
      <hr> <br> 
  
    <v-row>
        <v-col class="mb-6">
            <div>
                <label for="">Nombre:  </label>
                <span>{{ zone.name }}</span>
            </div>
            <div>
                <label for="">Longitud: </label>
                <span>{{ zone.long }}</span>
            </div>
            <div>

                <label for="">Unit Theoretical Flow:  </label>
                <span>{{ zone.unitTheoreticalFlow }}</span>
            </div>
            <br>
            <v-btn rounded color="primary" @click='toMeasuresList()'>Lista de Mediciones</v-btn>

        </v-col>
        <v-col class="mb-6">
            <div>
                <label for="">Crops: </label>
                <span>{{ zone.crops }}</span>
            </div>
            <div>
                <label for="">Latitud: </label>
                <span>{{ zone.lat }}</span>
            </div>
            <div>
                <label for="">Theoretical Flow: </label>
                <span>{{ zone.theoreticalFlow }}</span>
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
              id: '',
              farm_id: '',
              name: '',
              crops: '',
              lat: '',
              long: '',
              unitTheoreticalFlow: '',
              theoreticalFlow: '',
          }
      }
    },
    computed: {
     
    },
    created: function() {
        let zone_id = this.$route.params.id;
        console.log(zone_id);
         this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/zones/${zone_id}  `,{
             headers: {
             api_key: '9Ev6ftyEbHhylMoKFaok',
             Accept: 'application/json ',
             }
         })
         .then((response) => {
            //  let farm_id = this.$route.params.id
             
            //   let farm_data = response.data.filter( data => {
            //       return data.id == user_id
            //       })
             console.log(response);
             console.log(response.data.name);

             this.zone.id = response.data.id
             this.zone.name = response.data.name
              this.zone.crops = response.data.crops
              this.zone.lat = response.data.latitude
             this.zone.long = response.data.longitude
              this.zone.unitTheoreticalFlow = response.data.unitTheoreticalFlow
              this.zone.theoreticalFlow = response.data.theoreticalFlow

         })
         .catch((error) => {
             console.log(error);
         }); 
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