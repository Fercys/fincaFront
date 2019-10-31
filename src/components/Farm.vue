<template>
    <div>    
    <v-layout :wrap="true" class="pa-5">
        <v-flex xs12>
            <h1>{{$route.params.name}}</h1>            
        </v-flex>
        <v-flex xs12>
            <v-banner single-line :elevation=1>
                <v-icon slot="icon" color="success" size="36">settings_input_antenna</v-icon>
                Estado GATEWAY                 
                <v-btn left color="success" text>
                    {{state}}
                </v-btn>
                
            </v-banner>
        </v-flex>
        <v-flex xs12 md4 class="pt-5 pl-md-5 pt-xs-0">
            <v-card 
                color="secondary"
                dark
            >
                <v-card-text class="white--text">
                    <v-icon slot="icon" size="36">dns</v-icon>  
                    <div class="headline mb-2">Sistema de bombeo</div>
                    Ver datos de sistema de bombeo.
                    <v-card-actions>
                        <v-btn left color="primary" dark text :to="{ path: '/pump_system/'+$route.params.name}">
                            Ver
                        </v-btn>
                    </v-card-actions>
                </v-card-text>

            </v-card>
        </v-flex> 
        <v-flex xs12 md4 class="pt-5 pl-md-5 pt-xs-0">
            <v-card 
                color="deep-purple darken-4"
                dark
            >
                <v-card-text class="white--text">
                    <v-icon slot="icon" size="36">settings_input_antenna</v-icon>  
                    <div class="headline mb-2">Configuracion Gateway</div>
                    Ver datos de configuración.
                    <v-card-actions>
                        <v-btn left color="primary" dark text :to="{ path: '/gateway/'+$route.params.name}">
                            Ver
                        </v-btn>
                    </v-card-actions>
                </v-card-text>

            </v-card>
        </v-flex>
        <v-flex xs12 md4 class="pt-5 pl-md-5 pt-xs-0">
            <v-card 
                color="teal darken-4"
                dark
            >
                <v-card-text class="white--text">
                    <v-icon slot="icon" size="36">picture_in_picture</v-icon>  
                    <div class="headline mb-2">Zonas</div>
                    Ver datos zonas.
                    <v-card-actions>
                        <v-btn left color="primary" dark text :to="{ path: '/zone/'+$route.params.name}">
                            Ver
                        </v-btn>
                    </v-card-actions>
                </v-card-text>                
            </v-card>
        </v-flex>  

        <v-flex xs12 md4 class="pt-5 pl-md-5 pt-xs-0">
            <v-card 
                color="blue darken-1"
                dark
            >
                <v-card-text class="white--text">
                    <v-icon slot="icon" size="36">picture_in_picture</v-icon>  
                    <div class="headline mb-2">Sistemas hidraulicos</div>
                    Ver datos sistemas hidraulicos.
                </v-card-text>                
            </v-card>
        </v-flex>
        <v-flex xs12 md4 class="pt-5 pl-md-5 pt-xs-0">
            <v-card 
                color="deep-purple darken-1"
                dark
            >
                <v-card-text class="white--text">
                    <v-icon slot="icon" size="36">settings_input_antenna</v-icon>  
                    <div class="headline mb-2">Nodos</div>
                    Ver nodos.
                </v-card-text>

            </v-card>
        </v-flex>      
    </v-layout>
    </div>
</template>

<script>
export default {
    name: 'Farm',
    data() {
        return {
            title: '',
            state: 'Operando',
        }
    }
}
</script>
