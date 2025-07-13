<template>
	<div id="app">
		<router-view />
		<StagewiseToolbar :enabled="isDev" :config="stagewiseConfig" />
	</div>
</template>

<script>
import { StagewiseToolbar } from '@stagewise/toolbar-vue'

export default {
	name: 'App',
	components: {
		StagewiseToolbar
	},
	data() {
		return {
			isDev: import.meta.env.DEV,
			stagewiseConfig: {
				plugins: []
			}
		}
	}
}
</script>

<style lang="scss">
#app {
	width: 100%;
	height: 100vh;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
		'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
		sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
</style>