<template>
    <div id="tweeterFooter">
        <img id="logoFooter" src="@/assets/TweeterLogoWhite.png" alt="Tweeter Logo">
        <h4>Tweeter 2021 ©</h4>
    </div>
</template>

<script>
    export default {
        name: "TweeterFooter"
    }
</script>

<style lang="scss" scoped>
    #tweeterFooter {
            justify-self: center;
            display: grid;
            justify-items: center;
            height: fit-content;
            width: 100vw;

            #logoFooter {
            width: 30vw;
            margin-top: 5vh;
            }

            h4 {
                color: whitesmoke;
            }
        }
</style>