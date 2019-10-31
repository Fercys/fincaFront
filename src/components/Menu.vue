<template>
    <div>
        <v-list-item to="/">
            <v-list-item-icon>
            <v-icon>home</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group
            prepend-icon="supervisor_account"
            value="true"
        >
            <template v-slot:activator>
                <v-list-item-title>Campos</v-list-item-title>
            </template>

<!--
            <v-list-item to="/farm/Oficina-cdtec">
                <v-list-item-icon>
                <v-icon>list</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Oficina cdtec</v-list-item-title>
            </v-list-item>
-->
            <v-list-item to="/farm/Agrifrut-II-(Nogales-y-Parrones)">
                <v-list-item-icon>
                <v-icon>list</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Agrifrut II (Nogales y Parrones)</v-list-item-title>
            </v-list-item>
            <v-list-item to="/farm/Agrifrut">
                <v-list-item-icon>
                <v-icon>list</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Agrifrut</v-list-item-title>
            </v-list-item>
            <v-list-item to="/farm/Santa-Juana-de-Chincolco">
                <v-list-item-icon>
                <v-icon>list</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Santa Juana de Chincolco</v-list-item-title>
            </v-list-item>
            <v-list-item to="/farm/Agrifrut-Pozos">
                <v-list-item-icon>
                <v-icon>list</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Agrifrut Pozos</v-list-item-title>
            </v-list-item>
            <v-list-item to="/farm/Patio-Los-Cerezos-1046">
                <v-list-item-icon>
                <v-icon>list</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Patio Los Cerezos 1046</v-list-item-title>
            </v-list-item>

        </v-list-group>
        
        <v-list-group
            prepend-icon="supervisor_account"
            value="false"
        >
            <template v-slot:activator>
            <v-list-item-title>Cuentas</v-list-item-title>
            </template>

            <v-list-group
                no-action
                sub-group
                value="true"
            >
                <template v-slot:activator>
                    <v-list-item-content>
                    <v-list-item-title>Administrar</v-list-item-title>
                    </v-list-item-content>
                </template>

                <v-list-item >
                    <v-list-item-title></v-list-item-title>
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-group>
        </v-list-group>

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