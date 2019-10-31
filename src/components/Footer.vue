<template>
    <div>
        <v-footer color="indigo darken-4" style="height: 10vh" dark>
            <v-spacer></v-spacer>
            <div>&copy; {{ new Date().getFullYear() }}</div>
        </v-footer>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    props: {
        msg: String
    }
}
</script>