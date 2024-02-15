<script setup>
import { defineModel, onMounted, onUnmounted, ref, watch, computed } from 'vue';


defineProps({
    title: {
        type: String,
        required: true
    }
})

const emit = defineEmits([
    'close',
])

const data = defineModel('data')
const graph = ref(null)
const maxGraphElements = ref(1)

onMounted(() => {
    window.addEventListener('resize', calculateMaxGraphElements)
    calculateMaxGraphElements()
})

onUnmounted(() => {
    window.removeEventListener('resize', calculateMaxGraphElements)
})

const normalizedData = computed(() => {
    const maxValue = Math.max(...data.value)
    const minValue = Math.min(...data.value)

    if (maxValue === minValue) {
        return data.value.map(() => 50)
    }

    return data.value.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue),
    )
})

function calculateMaxGraphElements() {
    if (!graph.value) {
        return
    }

    maxGraphElements.value = graph.value.clientWidth / 38
}

watch(data, () => {
    while (data.value.length > maxGraphElements.value) {
        data.value.shift()
    }
}, {
    deep: true
})

</script>

<template>
    <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ title }}
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64" ref="graph">
            <div v-for="(bar, idx) in normalizedData" :key="idx" :style="{ height: `${bar}%` }"
                class="bg-purple-800 border w-10">
            </div>
        </div>
        <button @click="$emit('close')" type="button" class="absolute top-0 right-0">
            <font-awesome-icon icon="circle-xmark" size="xl" class="text-gray-500" />
        </button>
    </div>
</template>