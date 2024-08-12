<template>
    <div class="w-full font-merienda">
        <CustomDialog background-color="bg-white" :show-dialog="showDialog" @update="onShowDialogUpdate">
            <BillDetails v-if="bill" :bill="bill" @cancel="onBillDetailsCancelClicked" @billcancelled="onBillCancelled"></BillDetails>
        </CustomDialog>
        <div class="w-full" v-if="payDeskStore.bills.length">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                <RoundedCard 
                    v-for="bill in payDeskStore.bills" :key="bill.id" 
                    class="bg-gray-100 hover:bg-gray-400 cursor-pointer"
                    @click="onBillClicked(bill)"
                >
                    <div class="flex flex-row gap-2">
                        <OneLabelAndDataTagInRow label="Br. računa:" :data="'Rč.br.' +  bill.number"></OneLabelAndDataTagInRow>
                        <OneLabelAndDataTagInRow label="Iznos:" :data="bill.totalCash.toString() + ' €'"></OneLabelAndDataTagInRow>
                        <OneLabelAndDataTagInRow label="Stol:" :data="tableStore.getTableById(bill.tableId)?.name || 'nepoznato'"></OneLabelAndDataTagInRow>
                    </div>
                </RoundedCard>
            </div>
        </div>
        <div v-else class="w-full flex flex-row justify-center">
            <p class="text-xl"> Niti jedan račun nije izdan</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePayDeskStore } from '@/stores/payDeskStore'
import RoundedCard from '../cards/RoundedCard.vue'
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import { useUserStore } from '@/stores/UserStore'
import { useTableStore } from '@/stores/TableStore'
import type { Bill } from '@/types/Bill'
import CustomDialog from '../dialogs/CustomDialog.vue'
import BillDetails from './BillDetails.vue'
import { ref } from 'vue'
import type { SupplyItem } from '@/types/SupplyItem'
import { useProductStore } from '@/stores/ProductStore'
import { useArticleStore } from '@/stores/ArticleStor'
import { useSuppliesStore } from '@/stores/SuppliesStore'
import type { User } from '@/types/User'
import type { PayDesk } from '@/types/PayDesk'

const payDeskStore = usePayDeskStore()
const userStore = useUserStore()
const tableStore = useTableStore()
const productStore = useProductStore()
const articleStore = useArticleStore()
const suppliesStore = useSuppliesStore()

const showDialog = ref<boolean>(false)
const bill = ref<Bill | null>(null)
const user = ref<User | null>(userStore.user)
const paydesk = ref<PayDesk | null>(null)
if(user.value){
    const paydesk_ = payDeskStore.payDesks.find(it => it.userId === user.value?.uid)
    if(paydesk_){
        paydesk.value = paydesk_
        payDeskStore.fetchBillsByDateAndUser(new Date().toLocaleDateString(), user.value.firstName + ' ' + user.value.lastName)
    }else{
        payDeskStore.bills = []
    }
}

const onBillClicked = (bill_: Bill) => {
    bill.value = bill_
    showDialog.value = true
}
const onShowDialogUpdate = (showDialogUpdate: boolean) => {
    showDialog.value = showDialogUpdate
}
const onBillDetailsCancelClicked = () => {
    showDialog.value = false
}
const onBillCancelled = (bill: Bill) => {
    showDialog.value = false
    console.log('billPrinting: ', bill)
    const supplyItems: SupplyItem [] = []
    bill.billItems.forEach(billItem => {
        const product = productStore.getProductById(billItem.productId)
        if(!product){
            throw new Error('Product not exists')
        }
        billItem.quantity = billItem.quantity * (-1)
        product.productItems.forEach(productItem => {
                const rawMaterial = articleStore.rawMaterials.find(it => it.id === productItem.rawMaterialId)
                if(!rawMaterial){
                    throw new Error ('Raw material not exists')
                }
                supplyItems.push({
                        rawMaterialId: productItem.rawMaterialId,
                        name: rawMaterial.name,
                        code: rawMaterial.code,
                        unit: rawMaterial.unit,
                        quantity: (Math.round(productItem.quantity * billItem.quantity * 100) / 100) * (-1)
                    } as SupplyItem)
        })
    })
    bill.totalCash = bill.totalCash * (-1)
    
    console.log('supply items = ',supplyItems)
    if(user.value && paydesk.value){
        bill.number = paydesk.value.billNumber
        console.log('bill total cash', bill.totalCash)
        payDeskStore.updateBill(bill)
        const documentName = bill.paydeskName + ' Rč.br.:' + bill.number.toString()
        suppliesStore.updateSuppliesByBill(user.value, documentName, supplyItems)
        //payDeskStore.updateBillNumberAndTotalCash(paydesk.value, bill.totalCash)
        payDeskStore.fetchBillsByDateAndUser(new Date().toLocaleDateString(), user.value.firstName + ' ' + user.value.lastName)
    }
}
</script>
