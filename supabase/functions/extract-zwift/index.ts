import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXTRACTION_PROMPT = `You are analyzing a Zwift Progress Report screenshot. Extract ALL visible metrics into this exact JSON structure. 

IMPORTANT: 
- Remove thousands separators from numbers (e.g. "77,230" → 77230)
- Power values are in watts (W)
- Distance in km, elevation in m, energy in kJ
- If a value is not visible or unclear, use 0 and set confidence lower
- Return ONLY valid JSON, no markdown

Metadata rule:
- If the platform provides image metadata (EXIF), extract DateTimeOriginal (or closest equivalent).
- Populate image_metadata.captured_at with ISO format if available.
- Populate image_metadata.timezone_offset_minutes if present in EXIF offset tags.
- Set image_metadata.metadata_source = "exif" if DateTimeOriginal exists.
- If no EXIF capture time exists but file timestamp exists, use that with metadata_source = "file".
- Otherwise set captured_at to null and metadata_source to "unknown".
- Do not guess timestamps.

{
  "screen_type": "progress_report",
  "level": 0,
  "career_progress": {
    "this_ride_xp": 0,
    "xp_current": 0,
    "xp_target": 0,
    "achievements_current": 0,
    "achievements_target": 0,
    "route_badges_current": 0,
    "route_badges_target": 0,
    "challenge_name": "",
    "challenge_stage_current": 0,
    "challenge_stage_target": 0,
    "challenge_this_ride_km": 0,
    "challenge_progress_km": 0,
    "challenge_target_km": 0
  },
  "performance": {
    "best_5s_w": 0,
    "best_1m_w": 0,
    "best_5m_w": 0,
    "best_20m_w": 0,
    "ftp_w": 0,
    "racing_score": 0
  },
  "fitness_trends": {
    "weekly_this_ride_km": 0,
    "weekly_progress_km": 0,
    "weekly_goal_km": 0,
    "streak_weeks": 0,
    "total_distance_km": 0,
    "total_elevation_m": 0,
    "total_energy_kj": 0
  },
  "training_status": {
    "training_score": 0,
    "training_score_delta": 0,
    "freshness_state": ""
  },
  "image_metadata": {
    "captured_at": null,
    "timezone_offset_minutes": null,
    "metadata_source": "unknown"
  },
  "confidence": {
    "overall": 0.0
  }
}`;
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "imageUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: EXTRACTION_PROMPT },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsed;
    try {
      // Remove markdown code blocks if present
      const jsonStr = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", rawContent);
      parsed = null;
    }

    return new Response(
      JSON.stringify({
        raw: rawContent,
        parsed: parsed,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("extract-zwift error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
