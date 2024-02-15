<template>
	<div class="container mx-auto flex flex-col items-center p-4">
		<div class="container">
			<div class="w-full my-4"></div>
			<add-ticker @add-ticker="add" :disabled="tooManyTickersAdded" />
			<template v-if="tickers.length">
				<hr class="w-full border-t border-gray-900 my-4" />
				<div>
					<button
						class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						v-if="page > 1" @click="page = page - 1">
						Prev
					</button>
					<button
						class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						@click="page = page + 1" v-if="hasNextPage">
						Next
					</button>
					<div>Filter: <input v-model="filter" /></div>
				</div>
				<hr class="w-full border-t border-gray-900 my-4" />
				<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
					<TickerBase v-for="ticker in paginatedTickers" :key="ticker.name" :ticker="ticker"
						@click="select(ticker)" :isSelected="selectedTicker === ticker" @delete="handleDelete" />
				</dl>
				<hr class="w-full border-t border-gray-900 my-4" />
			</template>
			<ChartBase v-if="selectedTicker" class="relative" :title="`${selectedTicker.name} - USD`" v-model:data="graph"
				@close="selectedTicker = null" />
		</div>
	</div>
</template>

<script setup>
import { subscribeToTicker, unsubscribeFromTicker } from './api'
import AddTicker from './components/AddTicker.vue'
import TickerBase from './components/TickerBase.vue'
import ChartBase from './components/ChartBase.vue'
import { computed, ref, watch, onBeforeMount } from 'vue'

const filter = ref('')
const tickers = ref([])
const selectedTicker = ref(null)
const graph = ref([])
const page = ref(1)

const tooManyTickersAdded = computed(() => {
	return tickers.value.length > 4
})

const startIndex = computed(() => {
	return (page.value - 1) * 6
})

const endIndex = computed(() => {
	return page.value * 6
})

const filteredTickers = computed(() => {
	return tickers.value.filter((ticker) => ticker.name.includes(filter.value.toUpperCase()))
})

const paginatedTickers = computed(() => {
	return filteredTickers.value.slice(startIndex.value, endIndex.value)
})

const hasNextPage = computed(() => {
	return filteredTickers.value.length > endIndex.value
})

const pageStateOptions = computed(() => {
	return {
		filter: filter.value,
		page: page.value,
	}
})

function updateTicker(tickerName, price) {
	tickers.value
		.filter((t) => t.name === tickerName)
		.forEach((t) => {
			if (t === selectedTicker.value) {
				graph.value.push(price)
			}
			t.price = price
		})
}

function isTickerAlreadyExist(tickerName) {
	return tickers.value.some(ticker => ticker.name === tickerName)
}

function add(ticker) {
	if (isTickerAlreadyExist(ticker)) {
		return
	}

	const currentTicker = {
		name: ticker,
		price: '-',
	}

	tickers.value = [...tickers.value, currentTicker]
	filter.value = ''
	subscribeToTicker(currentTicker.name, (newPrice) =>
		this.updateTicker(currentTicker.name, newPrice),
	)
}

function select(ticker) {
	selectedTicker.value = ticker
}

function handleDelete(tickerToRemove) {
	tickers.value = tickers.value.filter((t) => t !== tickerToRemove)
	if (selectedTicker.value === tickerToRemove) {
		selectedTicker.value = null
	}
	unsubscribeFromTicker(tickerToRemove.name)
}

watch(selectedTicker, () => {
	graph.value = []
})

watch(tickers, () => {
	localStorage.setItem('cryptonomicon-list', JSON.stringify(tickers.value))
})

watch(paginatedTickers, () => {
	if (paginatedTickers.value.length === 0 && page.value > 1) {
		page.value -= 1
	}
})

watch(filter, () => {
	page.value = 1
})

watch(pageStateOptions, (value) => {
	window.history.pushState(
		null,
		document.title,
		`${window.location.pathname}?filter=${value.filter}&page=${value.page}`,
	)
})

</script>