<template>
  <div>
    
    <v-layout :wrap="true" class="pa-5">
      <!-- <v-flex xs12> <h1>{{title}} .</h1> </v-flex> -->
      <v-flex xs12 md12>
        <v-layout :wrap="true" class="pl-5 pr-5">
          <v-flex v-for="(card,index) in cards" v-bind:key="index" xs12 md4 class="pt-5 pl-xs-5 pl-md-5 pl-md-5">      
            <v-card 
              @click="card.click"
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
          users: {
            title:'Clientes',
            count: 0,
            click: () => this.toFarms()
          },
           nodes: {
             title:'Nodes',
             count: 15,
             click: ''
           },
           zones: {
             title:'Zones',
             count: 358,
             click:''
           }
        }
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
        let users_id = [];
        let users_count = [];
        this.cards.users.count = response.data.map( data => {
          return data.account.id
        })
        .filter( id => {
          users_id = [... users_count]
          users_count.push(id)
          return id && !users_id.includes(id)
        }).length
      })
      .catch((error) => {
        console.log(error);
      });
    },
    methods:{
      imprimir(){
        console.log('cambie de pestaña')
      },
      toFarms(){
        this.$router.push({name:'users'})
      }
    }
}
</script>

