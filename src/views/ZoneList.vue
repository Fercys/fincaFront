<template>
  <v-container>
    <h2> Detalle de la zona </h2>
    <v-row>
    <v-col class="mb-6">
        <div>
            <label for="">Nombre </label>
            <span>Zona 1</span>
        </div>
        <div>
            <label for="">Long </label>
            <span>123</span>
        </div>
        <div>

            <label for="">Unit </label>
            <span>1</span>
        </div>
        <div>
            <label for="">Max </label>
            <span>100</span>
        </div>
    </v-col>
    <v-col class="mb-6">
        <div>
            <label for="">Descripcion </label>
            <span>Primera zona</span>
        </div>
        <div>
            <label for="">Lat </label>
            <span>-123</span>
        </div>
        <div>
            <label for="">PumpSys </label>
            <span>1</span>
        </div>
        <div>
            <label for="">Min </label>
            <span>2</span>
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
    name: 'FarmTable',
    components: {
        Table
    },
    data(){
      return{
      }
    },
    computed: {
     
    },
    methods: {
        toZone(){
            console.log('cambio')
        }
    }
      
}
</script>