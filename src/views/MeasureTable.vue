<template>
  <div><br>
     <hr>
      <div style="width: 20%; margin: 0 auto;"><h3>Lista de Mediciones</h3></div> 
      <hr> <br>
    <Table 
        :headers="headers"
        :items="items"
    ></Table>
  </div>
</template>
<style> 

</style>
<script>
import {mapState, mapMutations} from 'vuex';
import Table from '../components/Table';
export default {
    name: 'FarmsTable',
    components: {
        Table
    },
    data(){
      return{
        headers: [
            {text: 'Id', value: 'id'},
            {text: 'Nombre', value: 'name'},
            {text: 'Tipo de Sensor', value: 'sensorType'},
            {text: 'Unidad', value: 'unit'},
            {text: 'Acciones', value: 'actions'}
        ],
        items: [
            // {id: 1, name: 'Valentino', description: 'probando', actions: {
            //     icon:'visibility',
            //     click: () =>  this.toMeasureDetail(1)
            // }}
        ]
      }
    },
    created: function (){
        let zone_id = this.$route.params.id

         this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/zones/${zone_id}/measures`,{
             headers: {
             api_key: '9Ev6ftyEbHhylMoKFaok',
             Accept: 'application/json ',
             }
         })
         .then((response) => {
             let user_id = this.$route.params.id
             console.log(response);
             this.items = response.data.map( data => {
                 return {
                     id: data.id,
                     name: data.name,
                     sensorType: data.sensorType,
                     unit: data.unit,
                     actions:{
                         icon:'visibility',
                         click: () => this.toMeasureDetail(data.id)
                     }
                 }
             })
         })
         .catch((error) => {
             console.log(error);
         }); 
    },
    methods: {
        toMeasureDetail(farm_id){
            console.log('cambie de vista')
            // this.$router.push({name: 'measuredetail', params: {
            //     id: farm_id
            //     }
            // })
        }
    }
      
}
</script>