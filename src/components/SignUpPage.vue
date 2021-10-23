<template>
    <div id="signUpContainer">
        <v-form id="signUpForm"
            v-model="isFormValid">
            <v-text-field
                v-model="email"
                :rules="[emailRules.required, emailRules.valid]"
                label="Your Email"
                required
            ></v-text-field>
            <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.passmin, rules.passmax]"
                :type="show1 ? 'text' : 'password'"
                label="Create a password"
                hint="Between 6 and 50 characters"
                @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
                v-model="username"
                :rules="[usernameRules, rules.required, rules.usermin, rules.passmax]"
                label="Pick a username"
                required
            ></v-text-field>
            <v-text-field
                v-model="bio"
                :rules="[bioRules.required, rules.usermin, bioRules.max]"
                label="Give us a short bio"
                required
            ></v-text-field>
            <label id="birthdayLabel" for="datePicker">Enter Birthday</label>
            <v-date-picker id="datePicker" 
                elevation="15"
                width="70%"
                v-model="datePick"
                :rules="dateRules"
                color="#0096C7"
                required
            ></v-date-picker>
                <v-btn id="signUpBtn"
                depressed
                :disabled="!isFormValid"
                color="primary" 
                @click="signUpRequest">
                    Sign Up
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "SignUpPage",
        data () {
            return {
                email: '',
                emailRules: {
                    required: v => !!v || 'E-mail is required',
                    valid: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                },
                show1: false,
                show2: true,
                show3: false,
                show4: false,
                password: '',
                rules: {
                    required: value => !!value || 'Required.',
                    passmin: v => v.length >= 6 || 'Min 6 characters',
                    passmax: v => v.length <= 50 || 'Max 50 characters',
                    usermin: v => v.length >= 1 || 'Min 1 character',
                    biomax: v => v.length <= 70 || 'Max 70 characters',
                },
                username: '',
                usernameRules: [
                    v => !!v || 'Username is required',
                ],
                bio: '',
                bioRules: {
                    required: v => !!v || 'Please write a short bio',
                    max: v => v.length  <= 70 || 'Max 70 characters',
                },
                datePick: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                dateRules: [
                    v => !!v || 'Please enter your birthdate'
                ],
                isFormValid: false,
            }
        },
        methods: {
            //API call to send signup data
            signUpRequest() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: "POST",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "email": this.email,
                        "username": this.username,
                        "password": this.password,
                        "bio": this.bio,
                        "birthdate": this.datePick,
                    }
                }).then((response) => {
                    cookies.set('loginToken', response.data.loginToken);
                    cookies.set('userId', response.data.userId);
                    router.push('Home');

                }).catch((error) => {
                    let msg = error.response.data;

                    if (msg.includes("Email") || msg.includes("email")) {
                        this.email=msg;
                    } else if (msg.includes("Username") || msg.includes("username")) {
                        this.username="";
                    } else if (msg.includes("Password") || msg.includes("password")) {
                        this.password="";
                    } else if (msg.includes("Bio") || msg.includes("bio")) {
                        this.bio="";
                    } else {
                        console.log(error.response);
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    #signUpForm {
        display: grid;
        grid-template-rows: repeat(4, 1fr) 0.5fr 5fr 1fr;
        width: 90%;
        margin-left: 5%;

        #birthdayLabel {
            color: #00667b;
            justify-self: center;
            font-size: 1.2em;
        }

        #datePicker{
            width: 90vw;
            justify-self: center;
        }

        #signUpBtn {
            align-self: center;
            margin: 2vh 20vw 0 20vw;
        }
    }

    @media screen and (min-width: 768px) {
        #signUpContainer {
            display: grid;

            #signUpForm {
            width: 70%;
            margin-left: 0;
            justify-self: center;

                #datePicker{
                    width: 100%;
                }

                #signUpBtn {
                    margin: 4vh 8vw 0 8vw;
                }
            }
        }
    }
</style>