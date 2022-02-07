import ObsWebSocket from 'obs-websocket-js';

let obs: ObsWebSocket;

let flat = false;

interface props {
  url?: string;
  port?: number;
  password?: string;
}

export default async function getConnectOBS({ password, port, url }: props): Promise<ObsWebSocket> {
  if (!password || !port || !url) {
    if (flat) return obs;
    return Promise.reject('Not istances');
  }

  obs = new ObsWebSocket();
  return await obs
    .connect({
      address: `${url}:${port}`,
      password: password,
    })
    .then(() => {
      flat = true;
      return obs;
    });
}

export function disconnect() {
  if (!obs) return;
  obs.disconnect();
  return;
}
