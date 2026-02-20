import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEORGE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - warm, authoritative

function formatRideMenuSnapshot(snap: any): string {
  const rm = snap.rideMenu;
  const s = snap.snapshot;
  if (!rm) return "No ride menu data available.";
  const date = s.captured_at ? new Date(s.captured_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Unknown date";
  return `
Ride on ${date}:
- Distance: ${rm.ride_distance_km ?? "N/A"} km
- Duration: ${rm.ride_duration_minutes ?? "N/A"} minutes
- Elevation: ${rm.ride_elevation_m ?? "N/A"} m
- Calories: ${rm.ride_calories ?? "N/A"} kcal
- Average Power: ${rm.avg_power_w ?? "N/A"} W
- Average Heart Rate: ${rm.avg_heart_rate_bpm ?? "N/A"} bpm
- Best 5s power: ${rm.power_5s_w ?? "N/A"} W
- Best 1min power: ${rm.power_1m_w ?? "N/A"} W
- Best 5min power: ${rm.power_5m_w ?? "N/A"} W
- Best 20min power: ${rm.power_20m_w ?? "N/A"} W
- Rider Score: ${rm.rider_score ?? "N/A"}
- Total Distance to date: ${rm.total_distance_km ?? "N/A"} km
  `.trim();
}

function formatProgressSnapshot(snap: any): string {
  const s = snap.snapshot;
  const perf = snap.performance;
  const fit = snap.fitness;
  const ts = snap.training;
  const prog = snap.progress;
  if (!perf && !fit) return "No progress report data available.";
  const date = s.captured_at ? new Date(s.captured_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Unknown date";
  return `
Progress Report on ${date}:
- Level: ${prog?.level ?? "N/A"}
- XP this ride: ${prog?.this_ride_xp ?? "N/A"}
- FTP: ${perf?.ftp_w ?? "N/A"} W
- Racing Score: ${perf?.racing_score ?? "N/A"}
- Best 5s: ${perf?.best_5s_w ?? "N/A"} W, 1min: ${perf?.best_1m_w ?? "N/A"} W, 5min: ${perf?.best_5m_w ?? "N/A"} W, 20min: ${perf?.best_20m_w ?? "N/A"} W
- Weekly progress: ${fit?.weekly_progress_km ?? "N/A"} / ${fit?.weekly_goal_km ?? "N/A"} km
- Total distance: ${fit?.total_distance_km ?? "N/A"} km
- Training Score: ${ts?.training_score ?? "N/A"} (delta: ${ts?.training_score_delta ?? "N/A"})
- Freshness: ${ts?.freshness_state ?? "N/A"}
  `.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not configured");

    const { currentSnap, previousSnap } = await req.json();
    if (!currentSnap) {
      return new Response(JSON.stringify({ error: "currentSnap is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format snapshot data for the AI
    const isRideMenu = (snap: any) => snap?.snapshot?.screen_type === "ride_menu";
    const formatSnap = (snap: any) => isRideMenu(snap) ? formatRideMenuSnapshot(snap) : formatProgressSnapshot(snap);

    const currentText = formatSnap(currentSnap);
    const previousText = previousSnap ? formatSnap(previousSnap) : null;

    const comparisonSection = previousText
      ? `PREVIOUS RIDE:\n${previousText}\n\nCURRENT RIDE:\n${currentText}`
      : `CURRENT RIDE:\n${currentText}\n\n(No previous ride available for comparison.)`;

    const systemPrompt = `You are an enthusiastic, knowledgeable Zwift cycling coach giving a punchy spoken voice review. 
Keep it under 120 words. Use natural spoken language — no bullet points, no markdown, no asterisks.
Be encouraging but honest. Highlight the most interesting delta or achievement. End with a motivational closer.`;

    const userPrompt = `Give a spoken voice review comparing these two Zwift rides:\n\n${comparisonSection}`;

    // Step 1: Generate review text with AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.text();
      if (aiResponse.status === 429) return new Response(JSON.stringify({ error: "AI rate limited. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResponse.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error ${aiResponse.status}: ${err}`);
    }

    const aiData = await aiResponse.json();
    const reviewText = aiData.choices?.[0]?.message?.content || "No review generated.";
    console.log("Review text:", reviewText);

    // Step 2: Convert text to speech with ElevenLabs
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${GEORGE_VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: reviewText,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      throw new Error(`ElevenLabs TTS error ${ttsResponse.status}: ${err}`);
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = base64Encode(audioBuffer);

    return new Response(
      JSON.stringify({ reviewText, audioBase64 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ride-voice-review error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
