<template>
    <div id="signUpContainer">
        <v-form id="signUpForm">
            <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Your Email"
                required
            ></v-text-field>
            <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                label="Create a password"
                hint="At least 6 characters"
                @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Pick a username"
                required
            ></v-text-field>
            <v-text-field
                v-model="bio"
                :rules="bioRules"
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
                },
                username: '',
                usernameRules: [
                    v => !!v || 'Username is required'
                ],
                bio: '',
                bioRules: [
                    v => !!v || 'Please write a short bio'
                ],
                datePick: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                dateRules: [
                    v => !!v || 'Please enter your birthdate'
                ],
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
                        "imageUrl": "https://image.flaticon.com/icons/png/512/847/847969.png",
                        "bannerUrl":  "https://images.unsplash.com/photo-1475598322381-f1b499717dda?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1055&q=80"
                    }
                }).then((response) => {
                    console.log(response);
                    cookies.set('loginToken', response.data.loginToken);
                    cookies.set('userId', response.data.userId);
                    router.push('Home');

                }).catch((error) => {
                    console.log(error.response.status);
                    this.email="This email already exists! Try Again";
                    this.username="";
                    this.password="";
                    this.bio="";
                    this.datePick=(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
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
            width: 70vw;
            justify-self: center;
        }

        #signUpBtn {
            align-self: center;
            margin: 2vh 20vw 0 20vw;
        }
    }

    @media screen and (min-width: 900px) {
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