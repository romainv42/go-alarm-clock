module.exports = (() => {
  const observer = [];

  let connected = false;

  let wsco;

  const connect = () => {
    wsco = new WebSocket("ws://localhost:8081/ws");

    wsco.onopen = () => {
      connected = true;
      wsco.onmessage = (wsmessage) => {
        const data = JSON.parse(wsmessage.data);
        observer.filter(o => o.kind === data.kind).map(m => m.method(data));
      };
    };
    wsco.onerror = () => {
      wsco.close();
    }

    wsco.onclose = () => {
      connected = false;
    }
  };
  connect();

  const connectionControl = () => {
    setTimeout(() => {
      if (!connected) connect();
      connectionControl();
    }, 500);
  };
  connectionControl();

  return {
    subscribe: (o) => observer.push(o)
  }
})();
