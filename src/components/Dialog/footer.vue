<script lang="ts" setup>
// import { defineEmits, defineProps } from "vue"

import { ref } from "vue"

defineOptions({
  // 命名当前组件
  name: "DialogFooter"
})
const props = defineProps({
  prop: {
    type: String,
    default: "false"
  }
})
console.log(14, props.prop)
const emits = defineEmits(["closed", "handleConfirm"])

const loading = ref(false)
const closeDialog = () => {
  emits("closed")
}
const handleConfirm = () => {
  loading.value = true
  emits("handleConfirm", () => {
    loading.value = false
  })
}
</script>

<template>
  <span class="dialog-footer">
    <el-button @click="closeDialog">取消</el-button>
    <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
  </span>
</template>
