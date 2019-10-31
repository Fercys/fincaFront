<template>
  <div>
    <v-layout :wrap="true">
    <v-flex>
        <video autoplay muted loop playbackRate="0.5">
          <source src="@/assets/CDTEC.mp4" type="video/mp4">
        </video>
      </v-flex>
    </v-layout>
    <v-layout justify-center style="height:100vh; margin-top: 10vh;">
          <v-flex xs10 md4>
            <v-card :elevation="12" class="transparente pa-10">
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs4></v-flex>
                  <v-flex xs4>
                    <v-img
                      src="@/assets/icon.png"
                      max-height=150
                      max-width=138
                    />
                  </v-flex>
                  <v-flex xs4></v-flex>
                  <v-divider></v-divider>
                  <v-flex xs12 class="text-center">
                    <h2 class="primary--text" style="display-4">Acceder</h2>
                  </v-flex>
                </v-layout>
                <v-form>
                  <v-text-field
                    label="Usuario"
                    name="usuario"
                    prepend-icon="person"
                    type="text"
                    v-model="user"
                  ></v-text-field>
                  <v-text-field
                    label="Contraseña"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="psw"
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="validateForm" class="pr-10 pl-10" @click="log_set(true)">Entrar</v-btn>
                <v-spacer></v-spacer>       
              </v-card-actions>             

            </v-card>
          </v-flex>
        </v-layout>
  </div>
</template>
<style> 
  /*Sobreescribo una clase de Vuetify*/
  .transparente {
    background-color:rgba(255, 255, 255, 0.6)!important;    
  }

  video {
    position: fixed;
    left: 0;
    bottom: 0;
    min-width: 100vw; 
    min-height: 100vh;
    max-height: 125vh;
  }
</style>
<script>
import {mapState, mapMutations} from 'vuex';
export default {
      name: 'Login',
    data(){
      return{
        user: '',
        psw: ''
      }
    },
    computed: {
      ...mapState(['login']),

      validateForm(){
        if( this.user != '' && this.psw != '' ) {
          return false;
        } 
        return true;
      }
    },
    methods: {
      ...mapMutations(['log_set'])
      
    } 
      
}
</script>