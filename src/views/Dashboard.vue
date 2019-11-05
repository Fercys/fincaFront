<template>
  <div>
    
    <v-layout :wrap="true" class="pa-5">
      <!-- <v-flex xs12> <h1>{{title}} .</h1> </v-flex> -->
      <v-flex xs12 md12>
        <v-layout :wrap="true" class="pl-5 pr-5">
          <v-flex @click="imprimir()" v-for="(card,index) in cards" v-bind:key="index" xs12 md4 class="pt-5 pl-xs-5 pl-md-5 pl-md-5">      
            <v-card 
              :elevation=1
            >
            <!-- :loading="true" -->
              <v-card-title>{{card.title}}</v-card-title>
              <v-card-text>{{card.count}}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
          <v-flex  xs12 md12 class="pa-8">      

            <v-card>
              <v-img src="../assets/farms-map-image.png" alt=""/>
            </v-card>
          </v-flex>
            
      </v-flex>      
      
    </v-layout>
    
    
  </div>
</template>

<script>

import fullscreen from 'vue-fullscreen'

export default {
    name: 'Footer',
    props: {
        title: 'Dashboard',
    },
    data() {
      return {
        cards: {
          farms: {
            title:'Farms',
            count: 28
          },
          nodes: {
            title:'Nodes',
            count: 15
          },
          zones: {
            title:'Zones',
            count: 358
          }
        }
      }
    },
    methods:{
      imprimir(){
        console.log('cambie de pestaña')
      }
    }
}
</script>

