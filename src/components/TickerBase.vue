<script setup>

defineProps({
    ticker: {
        type: Object,
        required: true,
    },
    isSelected: {
        type: Boolean,
        default: false
    }
})

function formatPrice(price) {
    if (price === '-') {
        return price
    }
    return price > 1 ? price.toFixed(2) : price.toPrecision(2)
}

const emit = defineEmits({
    'delete': (value) => typeof value === 'object',
})


</script>
<template>
    <div :class="{
        'border-4': isSelected,
    }" class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer">
        <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
                {{ ticker.name }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(ticker.price) }}
            </dd>
        </div>
        <div class="w-full border-t border-gray-200"></div>
        <button @click.stop="$emit('delete', ticker)"
            class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none">
            <font-awesome-icon icon="trash" />
            Delete
        </button>
    </div>
</template>