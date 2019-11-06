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
            {text: 'Nombre', value: 'nombre'},
            {text: 'Descripción', value: 'descripcion'},
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
    computed: {
     
    },
    methods: {
        toZone(){
            this.$router.push({name: 'zone'})
        }
    }
      
}
</script>