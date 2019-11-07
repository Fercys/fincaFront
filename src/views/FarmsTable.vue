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
    name: 'FarmTable',
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
            {nombre:'Mi granjita1', descripcion: 'una granja', actions:{
                    icon:'visibility',
                    click: () => this.toZone()
                }
            },
            {nombre:'Mi granjita2', descripcion: 'una granja', actions:{
                    icon:'visibility',
                    click: () => this.toZone()
                }},
            {nombre:'Mi granjita3', descripcion: 'una granja', actions:{
                    icon:'visibility',
                    click: () => this.toZone()
                }},
            {nombre:'Mi granjita4', descripcion: 'una granja', actions:{
                    icon:'visibility',
                    click: () => this.toZone()
                }},
            {nombre:'Mi granjita5', descripcion: 'una granja', actions:{
                    icon:'visibility',
                    click: () => this.toZone()
                }},
            {nombre:'Mi granjita6', descripcion: 'una granja', actions:{
                    icon:'visibility',
                    click: () => this.toZone()
                }}
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
                        click: () => this.toZone()
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
        toZone(){
            this.$router.push({name: 'zone'})
        }
    }
      
}
</script>