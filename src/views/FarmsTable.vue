<template>
  <div><br>
     <hr>
      <div style="width: 13%; margin: 0 auto;"><h3> Listado de Farms</h3></div> 
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
            {text: 'Acciones', value: 'actions'}
        ],
        items: [
        ]
      }
    },
    created: function (){
        this.axios.get('https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com/farms',{
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
                    user_id: data.account.id,
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    actions:{
                        icon:'visibility',
                        click: () => this.toFarmDetail(data.id)
                    }
                }
            })
            .filter( farm => {
                return farm.user_id == user_id
            })
        })
        .catch((error) => {
            console.log(error);
        }); 
    },
    methods: {
        toFarmDetail(farm_id){
            this.$router.push({name: 'farmdetail', params: {
                id: farm_id
                }
            })
        }
    }
      
}
</script>