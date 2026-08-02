import { NextResponse } from "next/server";
import { store } from "@/lib/storage";
import { getDeviceToken } from "@/lib/deviceToken";
import { canEditAthlete } from "@/lib/canEditAthlete";
import { createClient } from "@/lib/supabase/server";
import { findAudioSpikes } from "@/lib/audioSpikes";

const MAX_BYTES = 150 * 1024 * 1024;
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const EXT_BY_TYPE: Record<string, string> = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const existing = await store.getAthlete(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const ownerToken = await getDeviceToken();
  if (!(await canEditAthlete(ownerToken, existing.ownerToken))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported video type. Use MP4, MOV, or WebM." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Video is too large (150MB max)." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = await createClient();
  const path = `${params.id}/${Date.now()}.${EXT_BY_TYPE[file.type]}`;
  const { error: uploadError } = await supabase.storage
    .from("athlete-highlights")
    .upload(path, buffer, { contentType: file.type, upsert: true });
  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 502 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("athlete-highlights").getPublicUrl(path);

  // Scan the audio track for loudness spikes (ref whistle, crowd reaction)
  // to surface candidate moments -- see lib/audioSpikes.ts. Never blocks
  // the upload on failure; an empty candidate list just means the athlete
  // falls back to tagging while they watch.
  const filmCandidates = await findAudioSpikes(buffer);

  const updated = await store.updateAthlete(params.id, {
    highlightVideoUrl: publicUrl,
    filmCandidates,
  });
  return NextResponse.json(updated);
}
