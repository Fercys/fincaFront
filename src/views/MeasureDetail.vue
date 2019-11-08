<template>
  <v-container>    
    <hr>
      <div style="width: 100%; margin: 0 auto;">  <h3> Detalle de la medicion: <span style="color:#0d47a1"> {{ measure.name }} </span> </h3></div> 
      <hr> <br> 
   <v-row>
        <v-col class="mb-6">
            <div>
                <label for="">Nombre:  </label>
                <span>{{ measure.name }}</span>
            </div>
            <div>
                <label for="">Ultimos datos:  </label>
                <span>{{ measure.lastData }}</span>
            </div>
            <div>

                <label for="">Ultimos datos de datos </label>
                <span>{{ measure.lastDataDate }}</span>
            </div>
        </v-col>
        <v-col class="mb-6">
            <div>
                <label for="">Tiempo de monitoreo </label>
                <span>{{ measure.monitoringTime }}</span>
            </div>
            <div>
                <label for="">Tipo de sensor </label>
                <span>{{ measure.sensorType }}</span>
            </div>
            <div>
                <label for="">Unidad </label>
                <span>{{ measure.unit }}</span>
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
    name: 'MeasureDetail',
    data(){
      return{
          measure: {
              id: '',
              name: '',
              lastData:'',
              lastDataDate : '',
              monitoringTime : '',
              sensorType : '',
              unit : '',
          }
      }
    },
    computed: {
     
    },
    created: function() {
        let measures_id = this.$route.params.id
         this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/measures/${measures_id}  `,{ 
             headers: {
             api_key: '9Ev6ftyEbHhylMoKFaok',
             Accept: 'application/json ',
            }
         })
         .then((response) => {
            console.log(response)
            //  this.measure.id = response.data.id
              this.measure.name = response.data.name
              this.measure.lastData = response.data.lastData
              this.measure.lastDataDate = response.data.lastDataDate
              this.measure.monitoringTime = response.data.monitoringTime
              this.measure.sensorType = response.data.sensorType
              this.measure.unit = response.data.unit

         })
         .catch((error) => {
             console.log(error);
         }); 
    },
    methods: {

    }
      
}
</script>