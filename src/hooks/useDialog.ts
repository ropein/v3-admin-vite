import { getCurrentInstance, Ref, unref } from "vue"
import { h, isRef, onUnmounted, render } from "vue"
import { ElDialog } from "element-plus"
import type { ComponentInternalInstance } from "vue"
import { merge, upperFirst } from "lodash-es"

type Content = Parameters<typeof h>[0] | string | JSX.Element
// 使用 InstanceType 获取 ElDialog 组件实例的类型
type ElDialogInstance = InstanceType<typeof ElDialog>

// 从组件实例中提取 Props 类型
type DialogProps = ElDialogInstance["$props"] & {
  onBeforeOpen?: () => boolean | void
}

interface ElDialogSlots {
  header?: (...args: any[]) => Content
  footer?: (...args: any[]) => Content
}

interface Options<P> {
  dialogProps?: DialogProps
  dialogSlots?: ElDialogSlots
  contentProps?: P
  closeEventName?: string // 新增的属性
}

// 定义工具函数，获取计算属性的option
function getOptions<P>(options?: Ref<Options<P>> | Options<P>) {
  if (!options) return {}
  return isRef(options) ? options.value : options
}

export function useDialog<P = any>(
  content: Content,
  options?: Ref<Options<P>> | Options<P>,
  onCloseCallback?: (data?: any) => void
) {
  let dialogInstance: ComponentInternalInstance | null = null
  let fragment: Element | null = null
  // 获取当前组件实例，用于设置当前dialog的上下文，继承prototype
  const instance = getCurrentInstance()

  // 关闭并卸载组件
  const closeAfter = () => {
    if (fragment) {
      render(null, fragment as unknown as Element) // 卸载组件
      fragment.textContent = "" // 清空文档片段
      fragment = null
    }
    dialogInstance = null
  }

  function closeDialog(val?: any) {
    if (dialogInstance) dialogInstance.props.modelValue = false
    if (onCloseCallback) {
      onCloseCallback(val)
    }
  }

  // 创建并挂载组件
  function openDialog(modifyOptions?: Partial<Options<P>>) {
    if (dialogInstance) {
      closeDialog()
      closeAfter()
    }

    const _options = getOptions(options)
    // 如果有修改，则合并options。替换之前的options变量为 _options
    if (modifyOptions) merge(_options, modifyOptions)
    // 定义当前块关闭前钩子变量
    let onBeforeClose: (() => Promise<boolean | void> | boolean | void) | null
    const optionsValue = unref(options) // 使用unref确保无论是ref还是普通对象都能正确处理
    const { dialogProps = {}, contentProps = {} } = optionsValue || {}
    // 调用before钩子，如果为false则不打开
    if (dialogProps?.onBeforeOpen?.() === false) {
      return
    }
    fragment = document.createDocumentFragment() as unknown as Element
    // 转换closeEventName事件
    const closeEventName = `on${upperFirst(_options?.closeEventName || "closeDialog")}`
    const vNode = h(
      ElDialog,
      {
        ...dialogProps,
        modelValue: true,
        beforeClose: async (done) => {
          // 配置`el-dialog`的关闭回调钩子函数
          const result = await onBeforeClose?.()
          if (result === false) {
            return
          }
          done()
          // onClosed()
        },
        onClosed: () => {
          dialogProps?.onClosed?.()
          closeAfter()
          // 关闭后回收当前变量
          onBeforeClose = null
        }
      },
      {
        default: () => [
          typeof content === "string"
            ? content
            : h(content as any, {
                ...contentProps,
                [closeEventName]: closeDialog, // 监听自定义关闭事件，并执行关闭
                beforeCloseDialog: (fn: () => boolean | void) => {
                  // 把`beforeCloseDialog`传递给`content`，当组件内部使用`props.beforeCloseDialog(fn)`时，会把fn传递给`onBeforeClose`
                  onBeforeClose = fn
                  dialogProps?.beforeClose?.()
                }
              })
        ],
        ...options.dialogSlots
      }
    )
    // 设置当前的上下文为使用者的上下文
    vNode.appContext = instance?.appContext || null
    render(vNode, fragment)
    dialogInstance = vNode.component
    document.body.appendChild(fragment)
  }

  onUnmounted(() => {
    closeDialog()
  })

  return { openDialog, closeDialog }
}
