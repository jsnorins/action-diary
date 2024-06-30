<template>
    <button :class="classes + ' px-3 py-2 text-xs font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none'">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const VARIANT_CLASSES = {
    'default': 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300',
    'danger': 'bg-red-700 hover:bg-red-800 focus:ring-red-300'
}

const props = defineProps<{ variant: 'default' | 'danger' }>()
const classes = ref('')

onMounted(() => {
    classes.value = getVariantClasses()
})

const getVariantClasses = (): string => {
    const classes = VARIANT_CLASSES[props.variant]
    if (!classes) {
        alert(`"${props.variant}" variant for button was not found!`)

        return ''
    }

    return classes
}
</script>