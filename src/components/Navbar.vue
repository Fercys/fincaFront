<template>
  <div>
    <v-layout wrap>
      <v-app-bar
        color="primary"
        dark
      >
        <v-app-bar-nav-icon @click.stop="menu = !menu" class="d-block d-sm-block d-md-none"></v-app-bar-nav-icon>
        <v-img 
            src="../assets/icon.png"
            max-height=40
            max-width=40
        />
        <v-toolbar-title>
            
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-badge
          :bottom=true
          :left=true
          :overlap=true
          class="align-self-center"
        >
          <template v-slot:badge>0</template>
          <v-icon>mail</v-icon>
        </v-badge>
        <v-btn icon>
          <v-icon>info</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon @click.stop="profile = !profile">account_circle</v-icon>
          
        </v-btn>       
      </v-app-bar>
    </v-layout>
    
    <v-navigation-drawer
        v-model="menu"
        absolute
        temporary
        Disable-Resize-Watcher=true
        float=true
    >
        <Mainmenu/>
    </v-navigation-drawer>
        
    <v-navigation-drawer
        v-model="profile"
        absolute
        temporary
        right
        Disable-Resize-Watcher=true
        float=true
        >
        <v-layout wrap>
          <v-flex xs12 class="text-center pt-5">
            <v-avatar :size=150>
              <img src="https://picsum.photos/id/11/500/300" alt="avatar">
            </v-avatar>
          </v-flex>
          <v-flex xs12 class="text-center pt-5">
            <span>Pablo Ossandón</span>
            <v-divider></v-divider>
          </v-flex>
          
          <v-flex>
            <v-list flat>              
              <v-list-item-group color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>power-settings-new</v-icon>
                  </v-list-item-icon>                  
                  <v-list-item-content>
                    <v-list-item-title>Configuración</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <v-divider></v-divider>

              <v-list-item-group color="primary">
                <v-list-item to="/login">
                  <v-list-item-icon>
                    <v-icon>power-settings-new</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Cerrar sesión</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-flex>
        </v-layout>
        
            

        <v-divider></v-divider>
        
    </v-navigation-drawer>
  </div>
</template>

<script>
import Mainmenu from './Menu.vue'

export default {
    name: 'Navbar',
    components: {
        Mainmenu,
    },
    data() {
        return {
          menu: false,
          profile: true
        }
    }
}
</script>