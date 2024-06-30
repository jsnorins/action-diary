<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ActionItem } from './types/action-item'
import Badge from './components/Badge.vue'
import moment from 'moment'
import TimeBadge from './components/TimeBadge.vue'
import type { InputState } from './types/input'
import GenericButton from './components/GenericButton.vue'

const KEYBOARD_EVENT_KEY_ENTER = 'Enter'
const LOCAL_STORAGE_KEY_ACTIONS = 'actions'

const actionInput = ref<HTMLInputElement | null>(null)
const actionsRef = ref<ActionItem[]>([])

let actionModel = ref<string>('')

let editedActionId: string = ''
let inputState = ref<InputState>('add-new')

const addAction = (event: KeyboardEvent): void => {
    if (event.key !== KEYBOARD_EVENT_KEY_ENTER) {
        return
    }

    if (actionsRef.value.length && editedActionId) {
        const actionToEdit = actionsRef.value.find((action) => action.id === editedActionId)
        if (!actionToEdit) {
            return alert(`Could not find action with id: "${editedActionId}"!`)
        }

        actionToEdit.name = actionModel.value
        actionModel.value = ''
        editedActionId = ''

        inputState.value = 'add-new'
        saveInLocalStorage()

        return
    }

    actionsRef.value.push({
        id: window.crypto.randomUUID(),
        name: actionModel.value,
        timestamp: Date.now()
    })

    saveInLocalStorage()

    actionModel.value = ''
}

const triggerActionEdit = (id: string): void => {
    if (id === editedActionId) {
        inputState.value = 'add-new'
        actionModel.value = ''
        editedActionId = ''

        return
    }

    inputState.value = 'edit'

    const actionToEdit = actionsRef.value.find((action) => action.id === id)
    if (!actionToEdit) {
        return alert(`Could not find action with id: "${id}"!`)
    }

    editedActionId = id
    actionModel.value = actionToEdit.name
}

const deleteAction = (id: string): void => {
    actionsRef.value = actionsRef.value.filter((action) => {
        return action.id !== id
    })

    actionModel.value = ''
    editedActionId = ''

    saveInLocalStorage()
}

const saveInLocalStorage = (): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIONS, JSON.stringify(actionsRef.value))
}

const getTodayDate = (): string => {
    return moment().format('dddd HH:mm DD.MM.yyyy')
}

const getFormattedDate = (timestamp: number): string => {
    return moment(timestamp).format('HH:mm DD.MM.yyyy')
}

const getActionsFromLocalStorage = (): ActionItem[] => {
    let actionsFromJson: ActionItem[] = []

    const actionsJson = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIONS)
    if (actionsJson) {
        actionsFromJson = JSON.parse(actionsJson) || []
    }

    return actionsFromJson
}

const getDifferenceBetweenDates = (start: number, end: number): string => {
    if (!start || !end) {
        return ''
    }

    const startMoment = moment(start)
    const endMoment = moment(end)
    const duration = moment.duration(startMoment.diff(endMoment))

    return duration.humanize()
}

onMounted(() => {
    actionInput.value?.focus()

    getActionsFromLocalStorage().forEach((action) => {
        actionsRef.value.push(action)
    })
})
</script>

<template>
    <main class="flex flex-col justify-center w-2/3 mx-auto mt-8">
        <h3 class="flex justify-center text-3xl font-bold mb-4">Action Diary ({{ getTodayDate() }})</h3>

        <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Add some action..."
            @keydown="addAction"
            v-model="actionModel"
            ref="actionInput"
            required
        />

        <ul class="mt-4">
            <li class="flex justify-between py-4" v-for="(item, key) in actionsRef" :key="item.id">
                <div class="flex items-center">
                    <Badge>{{ getFormattedDate(item.timestamp) }}</Badge>
                    <span>{{ item.name }}</span>
                </div>

                <div class="flex gap-4">
                    <div class="flex gap-2 items-center">
                        <span v-if="getDifferenceBetweenDates(actionsRef[key + 1]?.timestamp, item.timestamp)">
                            <TimeBadge class="ml-4" variant="default">
                                {{ getDifferenceBetweenDates(actionsRef[key + 1].timestamp, item.timestamp) }}
                            </TimeBadge>
                        </span>
                        <span v-else>
                            <TimeBadge class="ml-4" variant="highlight">in progress</TimeBadge>
                        </span>
                        <GenericButton variant="default" @click="triggerActionEdit(item.id)">
                            {{ editedActionId !== item.id ? 'Edit' : 'Editing...' }}
                        </GenericButton>
                        <GenericButton variant="danger" @click="deleteAction(item.id)">
                            Delete
                        </GenericButton>
                    </div>
                </div>
            </li>
        </ul>
    </main>
</template>