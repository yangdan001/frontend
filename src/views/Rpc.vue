<template>
  <div id="app">
    <h1>WebSocket 测试客户端 (Vue)</h1>
    <div>
      <button @click="connect" :disabled="isConnected">连接</button>
      <button @click="disconnect" :disabled="!isConnected">断开连接</button>
      <button @click="getImage" >获取图片</button>
    </div>
    <div style="margin-top: 20px;">
      <input
        type="text"
        v-model="message"
        placeholder="输入消息"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" :disabled="!isConnected || !message">
        发送
      </button>
    </div>
    <div
      id="messages"
      ref="messagesDiv"
      style="margin-top: 20px; border:1px solid #ccc; padding:10px; height:300px; overflow-y:scroll;"
    >
      <h3>消息记录</h3>
      <div v-for="(msg, index) in messages" :key="index">
        <p>{{ msg }}</p>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <strong>连接状态:</strong> {{ connectionStatus }}
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount, nextTick } from 'vue';
import {getImageUrl} from "@/api/originalImage";
export default {
  name: 'HomeView', // 根据实际组件名称调整
  setup() {
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

      ws.value = new WebSocket('ws://172.17.41.6:30201/');

      ws.value.onopen = () => {
        isConnected.value = true;
        connectionStatus.value = '已连接';
        appendMessage('已连接到服务器');
      };

      ws.value.onmessage = (event) => {
        debugger
        try {
          const response = JSON.parse(event.data);
          if (response.jsonrpc === "2.0") {
            console.log(response.result,'response.result')
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

    let getImage = async ()=>{
      getImageUrl({ action:'stream' })
      .then(async (res) => {
        debugger
        if (res.code && res.code == 200) {
          // datas.mapData = res.data;

        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

    return {
      message,
      messages,
      isConnected,
      connectionStatus,
      connect,
      disconnect,
      sendMessage,
      messagesDiv,
      getImage,
    };
  },
};
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px; */
}
</style>
