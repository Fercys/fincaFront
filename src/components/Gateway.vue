<template>
    <div>    
    <v-layout :wrap="true" class="pa-5">
        <v-flex xs12>
            <h1>Gateway {{$route.params.name}}</h1>            
        </v-flex>
        <v-flex xs12>
            <v-banner single-line :elevation=1>
                <v-icon slot="icon" color="success" size="36">settings_input_antenna</v-icon>
                Estado GATEWAY                 
                <v-btn left color="success" text >
                    {{state}}
                </v-btn>
                
            </v-banner>
        </v-flex>
             
    </v-layout>
    </div>
</template>

<script>
export default {
    name: 'Gateway',
    data() {
        return {
            title: '',
            state: 'Operando',
        }
    }
}
</script>