<template>  

  <v-app> 
    <v-content v-show="login" > 
        <Navbar/>
        <v-layout >
          <v-flex class="d-none d-sm-none d-md-flex">
            <Mainmenu />
          </v-flex>
          <v-flex>
            <router-view style="min-height: 81vh"/>
          </v-flex>
        </v-layout>    
        <Footer/>
          
    </v-content>

  
    <v-content v-show="login != true">
      <Login/>
    </v-content>

  
    
    
  </v-app>
</template>

<script>
import {mapState} from 'vuex'

import Navbar from './components/Navbar.vue'
import Mainmenu from './components/Menu.vue'
import Footer from './components/Footer.vue'
import Login from './components/Login.vue'

export default {
  name: 'App',
  components:{
    Navbar,
    Mainmenu,
    Footer,
    Login
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapState(['login'])
  }
};
</script>
