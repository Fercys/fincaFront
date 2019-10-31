<template>
    <div>    
    <v-layout :wrap="true" class="pa-5">
        <v-flex xs12>
            <h1>Zonas {{$route.params.name}}</h1>            
        </v-flex>
        <v-flex>
        </v-flex>   
     
    </v-layout>
    </div>
</template>

<script>
export default {
    name: 'Zone',
    data() {
        return {
            title: '',
            state: 'Operando',
        }
    }
}
</script>