// src/composables/useWebSocket.js
import { ref, onBeforeUnmount, nextTick } from 'vue';

export function useWebSocket(url) {
  const ws = ref(null);
  const message = ref('');
  const messages = ref([]);
  const isConnected = ref(false);
  const connectionStatus = ref('未连接');
  const messageId = ref(1); // 用于生成唯一的请求ID
  const messagesDiv = ref(null); // 引用消息记录区域

  const connect = () => {
    if (ws.value) {
      return;
    }

    ws.value = new WebSocket(url);

    ws.value.onopen = () => {
      isConnected.value = true;
      connectionStatus.value = '已连接';
      appendMessage('已连接到服务器');
    };

    ws.value.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.jsonrpc === "2.0") {
          if (response.result) {
            appendMessage(`服务器: ${response.result}`);
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

    ws.value.onclose = () => {
      isConnected.value = false;
      connectionStatus.value = '已断开';
      appendMessage('已断开与服务器的连接');
      ws.value = null;
    };

    ws.value.onerror = (error) => {
      appendMessage(`错误: ${error.message}`);
    };
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
    }
  };

  const sendMessage = () => {
    if (ws.value && isConnected.value && message.value.trim() !== '') {
      // 构建 JSON-RPC 请求对象
      const rpcRequest = {
        jsonrpc: "2.0",
        method: "getWeldDetectMethods", // 根据服务器定义的方法名称调整
        // params: { message: message.value },
        // params: { "enable":true },
        id: messageId.value++
      };

      // 发送 JSON 字符串
      ws.value.send(JSON.stringify(rpcRequest));
      appendMessage(`你: ${message.value}`);
      message.value = '';
    }
  };

  const appendMessage = (msg) => {
    messages.value.push(msg);
    // 自动滚动到最底部
    nextTick(() => {
      if (messagesDiv.value) {
        messagesDiv.value.scrollTop = messagesDiv.value.scrollHeight;
      }
    });
  };

  onBeforeUnmount(() => {
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
