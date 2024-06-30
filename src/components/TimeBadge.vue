<template>
<span :class="classes + ' text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 border'">
    <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
         viewBox="0 0 20 20">
        <path
            d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
    </svg>
    <slot></slot>
</span>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const VARIANT_CLASSES = {
    'default': 'bg-gray-100 text-gray-800 border-gray-500',
    'highlight': 'bg-blue-100 text-blue-800 border-blue-400'
}

const props = defineProps<{ variant: 'default' | 'highlight' }>()
const classes = ref('')

onMounted(() => {
    classes.value = getVariantClasses()
})

const getVariantClasses = (): string => {
    const classes = VARIANT_CLASSES[props.variant]
    if (!classes) {
        alert(`"${props.variant}" variant for time badge was not found!`)

        return ''
    }

    return classes
}
</script>