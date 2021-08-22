<template>
    <div id="loginContainer">
        <v-form id="loginForm">
            <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
            ></v-text-field>
            <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                label="Password"
                hint="At least 6 characters"
                @click:append="show1 = !show1"
                @keydown.enter="submitWithEnterButton"
            ></v-text-field>
            <v-btn id="loginBtn"
                depressed
                color="primary" 
                @click="loginRequest">
                    Log In
            </v-btn>
        </v-form>
        <div id="signUpOffer">
            <h4>Dont have an account?</h4>
            <a @click="sendForSignUpPage">Sign up</a>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "LoginPage",
        data () {
            return {
                email: '',
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                    ],
                show1: false,
                show2: true,
                show3: false,
                show4: false,
                password: '',
                rules: {
                    required: value => !!value || 'Required.',
                    min: v => v.length >= 6 || 'Min 6 characters',
                    emailMatch: () => (`The email and password you entered don't match`),
                }
            }
        },    
        methods: {
            sendForSignUpPage() {
                return this.$store.commit('signUpBtnClicked');
            },
            loginRequest() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/login',
                    method: 'POST',
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        'email': this.email,
                        'password': this.password
                    }
                }).then((response) => {
                    console.log(response);
                    cookies.set('loginToken', response.data.loginToken);
                    cookies.set('userId', response.data.userId);
                    router.push('Home');
                }).catch((error) => {
                    console.log(error);
                })
            },
            //allows user to submit the form by hitting enter button while inputs are selected 
            submitWithEnterButton() {
                this.loginRequest();
            }
        },
    }
</script>

<style lang="scss" scoped>
    #loginContainer {
        display: grid;
        grid-template-rows: 2fr 1fr;
    }
    
    #loginForm {
        display: grid;
        width: 90%;
        margin: 10% 0 0 5%;
        
        #loginBtn {
            margin: 0 15vw 0 15vw;
        }
    }

    #signUpOffer {
        grid-row: 2;
        text-align: center;
        justify-self: center;
        margin-top: 7vh;

        a {
            text-decoration: underline;
            color: #063888;
        }
    }

    @media screen and (min-width: 900px) {
        #loginForm {
            width: 70%;
            margin: 0 0 0 15%;

            #loginBtn {
                margin: 0 7vw 0 7vw;
            }
        }
    }
</style>
