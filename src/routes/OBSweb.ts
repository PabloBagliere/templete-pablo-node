import { Router } from 'express';

import obs, { disconnect } from '../modules/OBSWebsocket';
const router = Router();

router.post('/config', async (req, res) => {
  const { password, port, url } = req.body;
  try {
    const instance = await obs({ password, port, url });
    instance.on('error', (error) => {
      console.error('Socket error: ', error);

      return res.status(500).json({ status: false, message: 'Error Socket' });
    });

    return res.status(200).json({ status: true, message: 'Ok' });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error Socket' });
  }
});

router.get('/start', async (req, res) => {
  try {
    const instance = await obs({});
    const status = (await instance.send('GetStreamingStatus')).streaming;
    if (status) return res.status(204).send();
    await instance.send('StartStreaming', {});

    return res.status(200).json({ status: true, message: 'Ok' });
  } catch (error) {
    console.error('Socket error: ', error);

    return res.status(500).json({ status: false, message: 'Error Socket' });
  }
});

router.get('/stop', async (req, res) => {
  try {
    const instance = await obs({});
    const status = (await instance.send('GetStreamingStatus')).streaming;
    if (!status) return res.status(204).send();
    await instance.send('StopStreaming');

    return res.status(200).json({ status: true, message: 'Ok' });
  } catch (error) {
    console.error('Socket error: ', error);

    return res.status(500).json({ status: false, message: 'Error Socket' });
  }
});

router.get('/status', async (req, res) => {
  try {
    const instance = await obs({});
    const status = (await instance.send('GetStreamingStatus')).streaming;

    return res.status(200).json({ statusStreaming: status });
  } catch (error) {
    console.error('Socket error: ', error);

    return res.status(500).json({ status: false, message: 'Error Socket' });
  }
});

router.post('/setcamara', async (req, res) => {
  const id = req.body.id;
  if (!id) return res.status(400).json({ status: false });
  try {
    const instance = await obs({});
    await instance.send('SetSourceSettings', {
      sourceName: 'live',
      sourceType: 'browser_source',
      sourceSettings: {
        url: `https://api.rosgannet.com.ar/database/rosgan/vdo/?view=${id}`,
      },
    });

    return res.status(200).json({ status: true, message: 'Ok' });
  } catch (error) {
    console.error('Socket error: ', error);

    return res.status(500).json({ status: false, message: 'Error Socket' });
  }
});

router.get('/disconnect', (req, res) => {
  disconnect();
  return res.status(200).json({ status: true, message: 'Ok' });
});

export default router;
