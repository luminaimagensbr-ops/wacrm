const OPUS_ENCODER_PATH = "/opus/encoderWorker.min.js";

/** Converts any browser-supported audio file to Ogg Opus Mono 48kHz using Web Audio and encoderWorker. */
export async function transcodeToOggOpus(file: File): Promise<Blob> {
  const AudioContextClass = typeof window !== "undefined" ? (window.AudioContext || (window as any).webkitAudioContext) : null;
  if (!AudioContextClass) {
    throw new Error("Web Audio API is not supported in this browser.");
  }
  const audioCtx = new AudioContextClass();
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    const worker = new Worker(OPUS_ENCODER_PATH);
    
    return new Promise<Blob>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      
      worker.onmessage = (e: MessageEvent) => {
        if (e.data.page) {
          chunks.push(e.data.page);
        } else if (e.data.message === "done") {
          const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
          const result = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
          }
          const blob = new Blob([result], { type: "audio/ogg" });
          resolve(blob);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        reject(err);
        worker.terminate();
      };
      
      worker.postMessage({
        command: "init",
        originalSampleRate: audioBuffer.sampleRate,
        encoderSampleRate: 48000,
        numberOfChannels: 1,
        encoderApplication: 2048,
      });
      
      const pcm = audioBuffer.getChannelData(0);
      const bufferLength = 4096;
      let offset = 0;
      while (offset < pcm.length) {
        const chunk = pcm.slice(offset, offset + bufferLength);
        worker.postMessage({
          command: "encode",
          buffers: [chunk],
        });
        offset += bufferLength;
      }
      
      worker.postMessage({ command: "done" });
    });
  } finally {
    void audioCtx.close();
  }
}
