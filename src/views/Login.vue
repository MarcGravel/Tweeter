<template>
    <div id="loginView">
        <h1 id="siteName">Tweeter</h1>
        <img id="tweeterLogo" src="@/assets/Tweeter.png" alt="Tweeter Logo">
        <div id="formsContainer">
        <div v-if="!displaySignUpOrLogin">
            <LoginPage id="theLogin" />
        </div>
        <div v-else>
            <SignUpPage />
        </div>
        </div>
    </div>
</template>

<script>
import LoginPage from '../components/LoginPage.vue'
import SignUpPage from '../components/SignUpPage.vue'

    export default {
        name: 'Login',
        computed: {
            displaySignUpOrLogin() {
                return this.$store.state.signUpBtnValue;
            },
        },
        components: {
            LoginPage,
            SignUpPage
        },
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

    * {
        overflow-x: hidden;
    }

    #loginView {
        height: 100vh;
        width: 100vw;
        display: grid;
        grid-template-rows: 1fr 4fr;
        justify-items: center;
        background-color: rgb(65, 65, 65);

        #siteName {
        display: none;
        margin-top: 10vh;
        font-size: 7em;
        font-family: 'Cedarville Cursive', cursive;
        color: #00B4D8;
        }

        #tweeterLogo {
            height: 100%;
        }

        #formsContainer {
        grid-row: 2;
        margin-top: 1vh;
        background-color: #00B4D8;
        height: 100%;
        width: 100%;
        }
    }

    @media screen and (min-width: 900px) {
        #loginView {
            grid-template-rows: 1fr 2fr;
            grid-template-columns: 1fr 1fr;

            #siteName {
                display: block;
            }

            #tweeterLogo {
                grid-column: 1;
                height: 60%;
                align-self: start;
            }

            #formsContainer {
                grid-row: 1 / 3;
                grid-column: 2;
                margin-top: 0;
                display: grid;
                align-items: center;
            }
        }
    }
</style>