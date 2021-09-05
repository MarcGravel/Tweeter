<template>
    <div id="adverts">
        <h1>Advertisements</h1>
        <div id="adDisplay">
            <h3>{{mockAd.name}}</h3>
            <p>{{mockAd.info}}</p>
            <img src="https://picsum.photos/200" alt="advert image">
        </div>
        <div id="adDisplayTwo">
            <h3>{{mockAdTwo.name}}</h3>
            <p>{{mockAdTwo.info}}</p>
            <img src="https://picsum.photos/200/500" alt="advert image">
        </div>
    </div>
</template>

<script>
import axios from 'axios'

    export default {
        name: "AdvertSidebar",
        mounted() {
            this.getMockAd()
        },
        data() {
            return {
                mockAd: {
                    name: '',
                    info: '',
                },
                mockAdTwo: {
                    name: '',
                    info: '',
                },
            }
        },
        methods: {
            //Api request to get mock advertisements for ad side bar
            getMockAd() {
                //gets random made up music genre for mock ad title
                axios.request({
                    url: "https://binaryjazz.us/wp-json/genrenator/v1/genre/",
                    method: "GET"
                }).then((response) => {
                    this.mockAd.name = response.data;
                }).catch((error) => {
                    console.log(error);
                })

                //gets random quote for mock ad description
                axios.request({
                    url: "https://api.adviceslip.com/advice",
                    method: "GET"
                }).then((response) => {
                    this.mockAd.info = response.data.slip.advice;
                }).catch((error) => {
                    console.log(error);
                })

                //gets random activity for mock add Two. 
                axios.request({
                    url: "https://www.boredapi.com/api/activity/",
                    method: "GET"
                }).then((response) => {
                    this.mockAdTwo.name = response.data.type;
                    this.mockAdTwo.info = response.data.activity;
                }).catch((error) => {
                    console.log(error);
                })

            }
        }
    }
</script>

<style lang="scss" scoped>
    #adverts {
        height: 100vh;
        width: 98%;
        margin-left: 2%;
        background-color: rgb(54, 54, 54);
        display: grid;
        grid-template-rows: 10% auto auto 20%;
        justify-items: center;

        h1 {
            color: #00B4D8;
            margin-top: 3vh;
            text-decoration: underline;
        }

        #adDisplay {
            cursor: pointer;
            grid-row: 2;
            margin-top: 5vh;
            width: 90%;
            background-color: #0193b1;
            height: fit-content;
            padding: 1vh 1vh 1vh 1vh;
            border-radius: 20px;
            display: grid;
            justify-items: center;

            img {
                width: 100%;
                border-radius: 10px;
            }
        }

        #adDisplayTwo {
            cursor: pointer;
            grid-row: 3;
            width: 90%;
            margin-top: 5vh;
            background-color: #0193b1;
            height: fit-content;
            padding: 1vh 1vh 1vh 1vh;
            border-radius: 20px;
            display: grid;
            justify-items: center;

            img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 10px;
            }
        }
    }
</style>