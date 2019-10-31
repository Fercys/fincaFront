<template>
  <div>
    
    <v-layout :wrap="true" class="pa-5">
      <v-flex xs12> <h1>{{title}} .</h1> </v-flex>
      <v-flex xs12 md10>
        <v-layout :wrap="true" class="pl-5 pr-5">
          <v-flex xs12 md6 class="pt-5">        
            <v-card 
              :loading="false"
              :elevation=1            
            >
              <v-img
                class="white--text"
                height="120px"
                src="../assets/2.jpg"
              >
                <v-card-title class="align-end fill-height">Agrifrut II (Nogales y Parrones)</v-card-title>
              </v-img>
              
              <v-card-text>Description</v-card-text>
              <v-card-actions>
                <v-btn outlined to="/farm/Agrifrut-II-(Nogales-y-Parrones)">Click</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex> 
          <v-flex xs12 md6 class="pt-5 pl-xs-0 pl-md-5">   
            <v-card 
              :elevation=1
              :loading="false"             
            >
              <v-img
                class="white--text"
                height="120px"
                src="../assets/2.jpg"
              >
                <v-card-title class="align-end fill-height">Agrifrut</v-card-title>
              </v-img>
              <v-card-text>Description</v-card-text>
              <v-card-actions>                
                <v-btn outlined to="/farm/Agrifrut">Ver</v-btn>
              </v-card-actions>

            </v-card>
          </v-flex>
          <v-flex xs12 md6 class="pt-5 pl-xs-0 pl-md-5">   
            <v-card 
              :elevation=1
              :loading="false"             
            >
              <v-img
                class="white--text"
                height="120px"
                src="../assets/2.jpg"
              >
                <v-card-title class="align-end fill-height">Santa Juana de Chincolco</v-card-title>
              </v-img>
              <v-card-text>Description</v-card-text>
              <v-card-actions>                
                <v-btn outlined to="/farm/Santa-Juana-de-Chincolco">Ver</v-btn>
              </v-card-actions>

            </v-card>
          </v-flex>
          <v-flex xs12 md6 class="pt-5 pl-xs-5 pl-md-5">      
            <v-card 
              
              :elevation=1
            >
            <!-- :loading="true" -->
              <v-img
                class="white--text"
                height="120px"
                src="../assets/2.jpg"
              >
                <v-card-title class="align-end fill-height">Agrifrut Pozos</v-card-title>
              </v-img>
              <v-card-text>I'm card text</v-card-text>
              <v-card-actions>
                <v-btn outlined to="/farm/Agrifrut Pozos">Click</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>  

          <v-flex xs12 md6 class="pt-5 pl-xs-5 pl-md-5">      
            <v-card 
              
              :elevation=1
            >
            <!-- :loading="true" -->
              <v-img
                class="white--text"
                height="120px"
                src="../assets/2.jpg"
              >
                <v-card-title class="align-end fill-height">Patio los Cerezos</v-card-title>
              </v-img>
              <v-card-text>I'm card text</v-card-text>
              <v-card-actions>
                <v-btn outlined to="/farm/Patio los cerezos">Click</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>   
        </v-layout>
              
      </v-flex>
      <v-flex xs12 md2
        color="success"
        height="100"
        class="pt-5 text-center"
      >
        <v-btn color="primary" class="pl-5 pr-5">Irrimax Live</v-btn>
      </v-flex>
      
      
    </v-layout>
    
    
  </div>
</template>

<script>

import fullscreen from 'vue-fullscreen'

export default {
    name: 'Footer',
    props: {
        title: 'Dashboard'
    },
    data() {
        return {
        }
    }
}
</script>

