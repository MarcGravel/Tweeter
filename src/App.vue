<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300&display=swap');

    * {
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        font-family:  'Merriweather', serif;
    }

</style>
