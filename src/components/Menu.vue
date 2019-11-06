<template>
    <div>
        <v-list-item to="/">
            <v-list-item-icon>
            <v-icon>home</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item to="farms">
            <v-list-item-icon>
            <v-icon>timeline</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Farms</v-list-item-title>
        </v-list-item>
        <v-list-item to="/">
            <v-list-item-icon>
            <v-icon>show_chart</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Nodes</v-list-item-title>
        </v-list-item>
        <v-list-item to="/">
            <v-list-item-icon>
            <v-icon>trending_up</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Zones</v-list-item-title>
        </v-list-item>
        <!--

        <v-list-item>
            <v-list-item-avatar>
            <v-icon>account_circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title></v-list-item-title>
            </v-list-item-content>
        </v-list-item>    

        <v-list-item>
            <v-list-item-avatar>
            <v-icon>account_circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title><router-link to="/">Login</router-link></v-list-item-title>
            </v-list-item-content>
        </v-list-item> 

        <v-list-item>
            <v-list-item-avatar>
            <v-icon>account_circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title><router-link to="/">Dashboard</router-link></v-list-item-title>
            </v-list-item-content>
        </v-list-item> 

        

        <v-list-item>
            <v-list-item-content>
                <v-list-item-title>
                    <router-link to="/dashboard">Dashboard</router-link>
                </v-list-item-title>
            </v-list-item-content>            
        </v-list-item>

        <v-divider></v-divider>
        -->
    </div>
</template>

<script>
export default {
    name: 'Menu'
}
</script>