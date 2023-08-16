<template>
	<view>
		<web-view :src="allUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 allUrl: '',
				 viewerUrl: '/hybrid/html/web/viewer.html',
			};
		}
	}
</script>

<style lang="scss">

</style>
