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
    name: 'HidraulicsTable',
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
                click: () =>  this.toHidraulicDetail(1)
            }}
        ]
      }
    },
    created: function (){
        let zone_id = this.$route.params.id

        // this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/zones/${zone_id}/hydraulics`,{
        //     headers: {
        //     api_key: '9Ev6ftyEbHhylMoKFaok',
        //     Accept: 'application/json ',
        //     }
        // })
        // .then((response) => {
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
        toHidraulicDetail(hidraulic_id){
            this.$router.push({name: 'hidraulicsdetail', params: {
                id: hidraulic_id
                }
            })
        }
    }
      
}
</script>