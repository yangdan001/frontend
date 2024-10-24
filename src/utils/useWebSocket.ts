// src/composables/useWebSocket.ts
import { ref, Ref, onBeforeUnmount, nextTick } from 'vue';

// 定义 JSON-RPC 请求接口
interface RpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, any>;
  id: number;
}

// 定义 JSON-RPC 响应接口
interface RpcResponse {
  jsonrpc: "2.0";
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number;
}

export function useWebSocket(url: string) {
  // WebSocket 实例引用
  const ws: Ref<WebSocket | null> = ref(null);

  // 消息输入绑定
  const message: Ref<string> = ref('');

  // 消息记录
  const messages: Ref<string[]> = ref([]);

  // 连接状态
  const isConnected: Ref<boolean> = ref(false);
  const connectionStatus: Ref<string> = ref('未连接');

  // 用于生成唯一的请求ID
  const messageId: Ref<number> = ref(1);

  // 引用消息记录区域的 DOM 元素
  const messagesDiv: Ref<HTMLElement | null> = ref(null);

  /**
   * 连接到 WebSocket 服务器
   */
  const connect = (): void => {
    if (ws.value) {
      console.warn('WebSocket 已经连接');
      return;
    }

    try {
      ws.value = new WebSocket(url);
    } catch (error) {
      appendMessage(`错误: 无法连接到服务器 (${error})`);
      return;
    }

    ws.value.onopen = () => {
      isConnected.value = true;
      connectionStatus.value = '已连接';
      appendMessage('已连接到服务器');
    };

    ws.value.onmessage = (event: MessageEvent) => {
      try {
        const response: RpcResponse = JSON.parse(event.data);
        if (response.jsonrpc === "2.0") {
          if (response.result !== undefined) {
            appendMessage(`服务器: ${JSON.stringify(response.result)}`);
          } else if (response.error) {
            appendMessage(`错误: ${response.error.message}`);
          }
        } else {
          appendMessage(`服务器: ${event.data}`);
        }
      } catch (e) {
        appendMessage(`服务器: ${event.data}`);
      }
    };

    ws.value.onclose = (event: CloseEvent) => {
      isConnected.value = false;
      connectionStatus.value = '已断开';
      appendMessage(`已断开与服务器的连接 (代码: ${event.code}, 原因: ${event.reason})`);
      ws.value = null;
    };

    ws.value.onerror = (event: Event) => {
      console.error('WebSocket 错误:', event);
      appendMessage('错误: WebSocket 连接发生错误');
    };
  };

  /**
   * 断开与 WebSocket 服务器的连接
   */
  const disconnect = (): void => {
    if (ws.value) {
      ws.value.close();
    } else {
      console.warn('WebSocket 尚未连接');
    }
  };

  /**
   * 发送消息到服务器
   */
  const sendMessage = (): void => {
    if (ws.value && isConnected.value && message.value.trim() !== '') {
      // 构建 JSON-RPC 请求对象
      const rpcRequest: RpcRequest = {
        jsonrpc: "2.0",
        method: "getWeldDetectMethods", // 根据服务器定义的方法名称调整
        // 如果需要传递参数，请取消注释并调整
        // params: { message: message.value },
        // params: { "enable": true },
        id: messageId.value++
      };

      // 发送 JSON 字符串
      ws.value.send(JSON.stringify(rpcRequest));
      appendMessage(`你: ${message.value}`);
      message.value = '';
    } else {
      console.warn('无法发送消息: WebSocket 未连接或消息为空');
    }
  };

  /**
   * 将消息追加到消息记录中，并自动滚动到底部
   * @param msg 要追加的消息
   */
  const appendMessage = (msg: string): void => {
    messages.value.push(msg);
    // 自动滚动到最底部
    nextTick(() => {
      if (messagesDiv.value) {
        messagesDiv.value.scrollTop = messagesDiv.value.scrollHeight;
      }
    });
  };

  /**
   * 在组件卸载前关闭 WebSocket 连接
   */
  onBeforeUnmount((): void => {
    if (ws.value) {
      ws.value.close();
    }
  });

  return {
    message,
    messages,
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    messagesDiv,
  };
}
