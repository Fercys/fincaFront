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
    name: 'UsersTable',
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
            console.log(response);
            let users = [];
            let checked_users = [];
            this.items = response.data.map( data => {
                return {
                    id: data.account.id,
                    name: data.account.name,
                    actions:{
                        icon:'visibility',
                        click: () => this.toFarms(data.account.id)
                    }
                }
            })
            .filter( user => {
                users = [... checked_users]
                checked_users.push(user)
                return user && !users.find(list_user => {
                    return user.id == list_user.id

                })
            })
        })
        .catch((error) => {
            console.log(error);
        });
    },
    methods: {
        toFarms(farm_id){
            console.log('id',farm_id)
            this.$router.push({name: 'farms',params:{
                    id: farm_id,
                }
            })
        }
    }
      
}
</script>