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
    name: 'ZonesTable',
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
                click: () =>  this.toZoneDetail(1)
            }
            }
        ]
      }
    },
    created: function (){
        // let farm_id = this.$route.params.id

        // this.axios.get(`https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/farms/${farm_id}/zones`,{
        //     headers: {
        //     api_key: '9Ev6ftyEbHhylMoKFaok',
        //     Accept: 'application/json ',
        //     }
        // })
        // .then((response) => {
        //     console.log(response);
        //     // let users = [];
        //     // let checked_users = [];
        //     // this.items = response.data.map( data => {
        //     //     return {
        //     //         id: data.account.id,
        //     //         name: data.account.name,
        //     //         actions:{
        //     //             icon:'visibility',
        //     //             click: () => this.toZoneDetail()
        //     //         }
        //     //     }
        //     // })
        //     // })
        // })
        // .catch((error) => {
        //     console.log(error);
        // });
    },
    methods: {
        toZoneDetail(zone_id){
            this.$router.push({name: 'zonedetail',params:{
                    id: zone_id,
                }
            })
        }
    }
      
}
</script>