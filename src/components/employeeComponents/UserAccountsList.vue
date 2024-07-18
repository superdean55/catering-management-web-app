<template>
    <div class="max-w-xl mx-auto">
            <RoundedCard>
                <div class="w-full flex flex-col">
                    <div class="flex flex-row justify-center w-full mb-2">
                        <p class="font-bold">{{ title }}</p>
                    </div>
                    <div class="flex flex-row justify-center w-full mb-2">
                        <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Pretraži korisnike..."
                        class="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div class="mx-4 flex flex-row gap-4 items-center">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="option" value="option1" v-model="selectedOption" class="form-radio text-blue-600">
                            <span>Employees</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="option" value="option2" v-model="selectedOption" class="form-radio text-blue-600">
                            <span>Users</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="option" value="option3" v-model="selectedOption" class="form-radio text-blue-600">
                            <span>All</span>
                        </label>
                    </div>
                    <RoundedCard v-if="userStore.users" class="border border-gray-300 w-full" >
                        <div class="flex flex-col gap-2" v-if="filteredUsers.length">
                            <div
                                v-for="user in filteredUsers" :key="user.uid"
                                class="flex flex-col gap-2 w-full px-2 py-1 min-h-11 rounded-lg bg-gray-300"
                            >
                                <div class="flex flex-row">
                                    <div class="w-10 h-10 rounded-lg">
                                        <img v-if="user.imageUrl.length" class="w-full h-full rounded-lg object-cover" :src="user.imageUrl">
                                        <img v-else class="rounded-lg max-h-40" src="@/assets/blank_profile_picture.jpg">
                                    </div>
                                    <div class="flex flex-row items-center justify-center">
                                        <p class="font-bold pl-4">{{ user.firstName }}{{ ' ' + user.lastName }}</p>
                                    </div>
                                    <div class="flex flex-row items-center ml-auto">
                                        <p :class="user.role === Role.user ? 'text-green-600': user.role === Role.staff ? 'text-yellow-600' : user.role === Role.manager ? 'text-orange-600': 'text-red-600'">{{ user.role }}</p>
                                    </div>
                                    <div @click="toggleShowMore(user)" class="ml-2 h-10 w-10 rounded-full bg-gray-100 flex flex-row justify-center items-center hover:bg-gray-400 cursor-pointer">
                                        <span class="material-symbols-outlined">{{ expandedUserId === user.uid ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
                                    </div>
                                </div>
                                <div v-if="expandedUserId === user.uid" class="flex flex-row">
                                    <div class="w-10 h-10"></div>
                                    <div class="flex flex-row items-center justify-center">
                                        <SelectBox
                                            class="pl-4"
                                            label="Uloga:"
                                            :option="role"
                                            :object="Role"
                                            :error="roleErrorMessage"
                                            @selectedValue="onRoleChanged"
                                        >

                                        </SelectBox>
                                    </div>
                                    <div class="flex flex-row items-center ml-auto">
                                        <ConfirmButton @confirm="onUserRoleUpdate(user)" label="Ažuriraj">
                                            <span class="material-symbols-outlined">update</span>
                                        </ConfirmButton>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div v-else class="flex flex-row justify-center">
                            <p>Traženi korisnik ne postoji</p>
                        </div>
                    </RoundedCard>
                    <div v-else class="flex flex-row justify-center">
                        <p>Ne postoji niti jedan korisnik</p>
                    </div>
                </div>
            </RoundedCard>
        </div>
</template>

<script setup lang="ts">
import RoundedCard from "../cards/RoundedCard.vue"
import SelectBox from "../inputs/SelectBox.vue"
import ConfirmButton from "../buttons/ConfirmButton.vue"
import { computed, ref } from "vue"
import { useUserStore } from '@/stores/UserStore'
import type { User } from "@/types/User"
import { Role } from "@/types/Role";
import { isSelectionValid } from "@/helpers/isSelectionValid"

const props = defineProps<{
    title: string
}>()

const userStore = useUserStore()
const role = ref<Role>(Role.user)
const roleErrorMessage = ref<string>('')
const searchQuery = ref<string>('')
const selectedOption = ref('option1')
const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (userStore.users === null) {
        return []
    }

    return userStore.users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(query) ||
                              user.firstName.toLowerCase().includes(query) ||
                              user.lastName.toLowerCase().includes(query)

        if (!matchesSearch) {
            return false
        }

        if (selectedOption.value === 'option1') {
            return user.role === Role.admin || user.role === Role.manager || user.role === Role.staff
        } else if (selectedOption.value === 'option2') {
            return user.role === Role.user
        } else if (selectedOption.value === 'option3') {
            return true
        }

        return false
    })
})
const expandedUserId = ref<string | null>(null)

const toggleShowMore = (user: User) => {
    role.value = user.role
    if (expandedUserId.value === user.uid) {
        expandedUserId.value = null
    } else {
        expandedUserId.value = user.uid
    }
}

const onRoleChanged = (value: Role) => {
    roleErrorMessage.value = ''
    role.value = value
}

const onUserRoleUpdate = (user: User) => {
    var isValid = true
    if(!isSelectionValid(role.value, Role)){
        roleErrorMessage.value = 'neispravna uloga'
        isValid = false
    }
    if(isValid){
        userStore.updateEmployee(user, role.value)
        expandedUserId.value = null
    }
}
</script>
