import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { PassThrough } from "stream";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const SAMPLE_RATE = 8000;
const WINDOW_SECONDS = 0.5;
const WINDOW_SAMPLES = SAMPLE_RATE * WINDOW_SECONDS;
const MIN_GAP_SECONDS = 3;
const MAX_CANDIDATES = 20;

/**
 * Decodes the video's audio track to raw mono PCM and returns per-window RMS
 * loudness. fluent-ffmpeg needs a real file path (not a Buffer) to read
 * from, so the upload route's buffer is written to a scratch temp file
 * first and removed again here.
 */
async function extractPcm(videoBuffer: Buffer): Promise<Int16Array> {
  const tmpPath = path.join(tmpdir(), `${randomUUID()}.mp4`);
  await writeFile(tmpPath, videoBuffer);

  try {
    const chunks: Buffer[] = [];
    const out = new PassThrough();
    out.on("data", (chunk: Buffer) => chunks.push(chunk));

    await new Promise<void>((resolve, reject) => {
      ffmpeg(tmpPath)
        .noVideo()
        .audioChannels(1)
        .audioFrequency(SAMPLE_RATE)
        .format("s16le")
        .on("error", (err: Error) => reject(err))
        .on("end", () => resolve())
        .pipe(out, { end: true });
    });

    const raw = Buffer.concat(chunks);
    return new Int16Array(
      raw.buffer,
      raw.byteOffset,
      Math.floor(raw.byteLength / 2)
    );
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}

/**
 * Finds candidate "something happened" moments in a highlight video by
 * scanning its audio track for loudness spikes (ref whistle, crowd
 * reaction) -- cheap, deterministic signal processing, not video content
 * classification, since reliably recognizing wrestling actions themselves
 * (takedown vs. escape vs. scramble) from raw video isn't something a
 * general-purpose model does well. This only finds WHEN something notable
 * happened; the athlete still labels WHAT it was.
 *
 * Returns timestamps in seconds, sorted, at least MIN_GAP_SECONDS apart.
 * Never throws -- on any failure (corrupt file, no audio track, etc.)
 * returns an empty array so a video upload can never hard-fail because of
 * this.
 */
export async function findAudioSpikes(videoBuffer: Buffer): Promise<number[]> {
  try {
    const pcm = extractPcmWindowed(await extractPcm(videoBuffer));
    if (pcm.length === 0) return [];

    const mean = pcm.reduce((sum, w) => sum + w.rms, 0) / pcm.length;
    const variance =
      pcm.reduce((sum, w) => sum + (w.rms - mean) ** 2, 0) / pcm.length;
    const stddev = Math.sqrt(variance);
    const threshold = mean + stddev;

    const candidates: { time: number; rms: number }[] = [];
    for (let i = 1; i < pcm.length - 1; i++) {
      const w = pcm[i];
      if (
        w.rms > threshold &&
        w.rms >= pcm[i - 1].rms &&
        w.rms >= pcm[i + 1].rms
      ) {
        candidates.push({ time: w.time, rms: w.rms });
      }
    }

    candidates.sort((a, b) => b.rms - a.rms);
    const chosen: number[] = [];
    for (const c of candidates) {
      if (chosen.some((t) => Math.abs(t - c.time) < MIN_GAP_SECONDS)) continue;
      chosen.push(c.time);
      if (chosen.length >= MAX_CANDIDATES) break;
    }

    return chosen.sort((a, b) => a - b).map((t) => Math.round(t));
  } catch (err) {
    console.error("[audioSpikes] failed:", err);
    return [];
  }
}

function extractPcmWindowed(
  samples: Int16Array
): { time: number; rms: number }[] {
  const windows: { time: number; rms: number }[] = [];
  for (let start = 0; start + WINDOW_SAMPLES <= samples.length; start += WINDOW_SAMPLES) {
    let sumSquares = 0;
    for (let i = start; i < start + WINDOW_SAMPLES; i++) {
      sumSquares += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sumSquares / WINDOW_SAMPLES);
    windows.push({ time: start / SAMPLE_RATE, rms });
  }
  return windows;
}
