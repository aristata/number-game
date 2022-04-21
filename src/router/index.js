import Vue from 'vue'
import VueRouter from "vue-router";
import GameBapp from "@/components/GameBapp";

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        name: "GameBapp",
        component: GameBapp
    }
]

const index = new VueRouter({
    routes
})

export default index