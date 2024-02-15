<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AddButton from './AddButton.vue'
import { fetchCoins } from '@/api';

defineProps({
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const emit = defineEmits({
	'add-ticker': (value) => typeof value === 'string' && value.length > 0,
})

const ticker = ref('')
const showSuggestions = ref(false);
const coins = ref([]);
const autocompleteRef = ref(null);

const filteredItems = computed(() => {
	return coins.value.filter(item =>
		item.toLowerCase().includes(ticker.value.toLowerCase())
	);
});

const handleInput = () => {
	ticker.value = ticker.value.toUpperCase()
	showDropdown()
};

const showDropdown = () => {
	if (ticker.value.length >= 2) {
		showSuggestions.value = true;
	}
};

const hideDropdown = () => {
	showSuggestions.value = false;
};


const selectItem = (item) => {
	ticker.value = item;
	showSuggestions.value = false;
};

function add() {
	if (ticker.value.length === 0) {
		return
	}
	emit('add-ticker', ticker.value)
	ticker.value = ''
}

const handleClickOutside = (event) => {
	if (
		autocompleteRef.value &&
		!autocompleteRef.value.contains(event.target)
	) {
		hideDropdown();
	}
};

onMounted(async () => {
	document.addEventListener('click', handleClickOutside);
	coins.value = await fetchCoins()
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
	<section>
		<div class="flex">
			<div class="max-w-xs">
				<label for="wallet" class="block text-sm font-medium text-gray-700">Tiker</label>
				<div class="mt-1 relative rounded-md shadow-md" ref="autocompleteRef">
					<input v-model="ticker" @keydown.enter="add" type="text" name="wallet" id="wallet"
						class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
						placeholder="Example: DOGE" @input="handleInput" @focus="showDropdown" />
					<ul v-if="showSuggestions && filteredItems.length > 0"
						class="absolute max-h-36 overflow-y-auto z-10 w-full mt-2 bg-white border border-gray-300 rounded">
						<li v-for="item in filteredItems" :key="item" @click="selectItem(item)"
							class="px-4 py-2 cursor-pointer hover:bg-gray-100">
							{{ item }}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<add-button @click="add" type="button" :disabled="disabled" class="my-4" />
	</section>
</template>
