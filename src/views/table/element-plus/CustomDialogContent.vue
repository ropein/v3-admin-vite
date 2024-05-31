<script setup lang="ts">
import DialogFooter from "@/components/Dialog/footer.vue"
import { ref } from "vue"
const props = defineProps({
  from: {
    type: String,
    default: "false"
  },
  beforeCloseDialog: {
    type: Function,
    default: () => false
  }
})
console.log(10, props.beforeCloseDialog)
// 点击右上角的打叉按钮才会生效！！！！
props.beforeCloseDialog(() => {
  console.log(17)
  // 假如from 为 空字符串不能关闭
  // if (!props.from) {
  //   return false
  // }
  // return true
  return false
})
const emit = defineEmits(["closeDialog", "beforeCloseDialog"])
const testCallBackValue = ref({
  aaa: "会调成功"
})
// 关闭dialog
const close = () => {
  console.log(15)
  emit("closeDialog")
}
const handleConfirm = (callback: any) => {
  console.log(35, callback)
  setTimeout(() => {
    console.log("模拟接口返回")
    callback()
    emit("closeDialog", testCallBackValue.value)
  }, 2000)
}
</script>

<template>
  <div>111</div>
  <div>222</div>
  <el-badge :value="12" class="item">
    <el-button>comments</el-button>
  </el-badge>
  <el-button type="primary">aaaaa</el-button>
  <DialogFooter @closed="close" @handleConfirm="handleConfirm" />
</template>
