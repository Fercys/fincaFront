<template>
  <div>
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
            {text: 'Descripción', value: 'description'},
            {text: 'Acciones', value: 'actions'}
        ],
        items: [
            {id: 1, name: 'Valentino', description: 'probando', actions: {
                icon:'visibility',
                click: () =>  this.toMeasureDetail(1)
            }}
        ]
      }
    },
    created: function (){
        let zone_id = this.$route.params.id

        // this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/zones/${zone_id}/measures`,{
        //     headers: {
        //     api_key: '9Ev6ftyEbHhylMoKFaok',
        //     Accept: 'application/json ',
        //     }
        // })
        // .then((response) => {
        //     let user_id = this.$route.params.id
        //     console.log(response);
        //     this.items = response.data.map( data => {
        //         return {
        //             user_id: data.account.id,
        //             id: data.id,
        //             name: data.name,
        //             description: data.description,
        //             actions:{
        //                 icon:'visibility',
        //                 click: () => this.toFarmDetail(data.id)
        //             }
        //         }
        //     })
        // })
        // .catch((error) => {
        //     console.log(error);
        // }); 
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