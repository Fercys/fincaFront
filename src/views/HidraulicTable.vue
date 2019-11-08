<template>
  <div>
      <br>
     <hr>
      <div style="width: 20%; margin: 0 auto;"><h3>Lista de Hidraulics</h3></div> 
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
    name: 'HidraulicsTable',
    components: {
        Table
    },
    data(){
      return{
        headers: [
            {text: 'Id', value: 'id'},
            {text: 'Nombre', value: 'name'},
            {text: 'Tipo', value: 'type'},
            {text: 'Acciones', value: 'actions'}
        ],
        items: [
            // {id: 1, name: 'Valentino', description: 'probando', actions: {
            //     icon:'visibility',
            //     click: () =>  this.toHidraulicDetail(1)
            // }}
        ]
      }
    },
    created: function (){
        let zone_id = this.$route.params.id

         this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/zones/${zone_id}/hydraulics`,{
             headers: {
             api_key: '9Ev6ftyEbHhylMoKFaok',
             Accept: 'application/json ',
             }
         })
         .then((response) => {
             console.log(response);
             this.items = response.data.map( data => {
                 return {
                     id: data.id,
                     name: data.name,
                     type: data.type,
                     actions:{
                         icon:'visibility',
                         click: () => this.toHidraulicDetail(data.id)
                     }
                 }
             })
         })
         .catch((error) => {
             console.log(error);
         }); 
    },
    methods: {
        toHidraulicDetail(hidraulic_id){
            // this.$router.push({name: 'hidraulicsdetail', params: {
            //     id: hidraulic_id
            //     }
            // })
        }
    }
      
}
</script>