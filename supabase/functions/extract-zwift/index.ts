import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SCREEN_DETECT_PROMPT = `You are analyzing a Zwift screenshot. First, determine the screen type.

Look for these markers:
- "Progress Report" screen: Shows "PROGRESS REPORT" title, XP bar, achievements, route badges, challenge progress, training status section with freshness indicator
- "Ride Menu" screen: Shows "MENU" title, rider name with flag, "this ride" vs "your totals" stats, power distribution histogram, heart rate distribution histogram, rider score bar, BACK/END RIDE buttons

Return ONLY one of: "progress_report" or "ride_menu"
Do not return anything else.`;

const PROGRESS_REPORT_PROMPT = `You are analyzing a Zwift Progress Report screenshot. Extract ALL visible metrics into this exact JSON structure. 

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

const RIDE_MENU_PROMPT = `You are analyzing a Zwift Ride Menu / In-Ride Summary screenshot. Extract ALL visible metrics into the strict JSON schema below.

IGNORE RULES (critical):
- Ignore right-hand vertical buttons: Workouts, Badges, Pair, Garage, Settings
- Ignore challenge artwork images
- Ignore background scenery
- Ignore any icons without numeric values

PARSING RULES:
- Output JSON only
- Numbers must be numeric (no strings)
- Remove commas from numbers (e.g. "385,330" → 385330)
- Convert elevation shown as km → meters (e.g. "65.0km" → 65000)
- Convert time HH:MM → total minutes (e.g. "0:53" → 53, "574:06" → 34446)
- If unsure, set value to null and lower confidence
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
  "screen_type": "ride_menu",
  "rider": {
    "name": null,
    "height_cm": null,
    "weight_kg": null
  },
  "this_ride": {
    "distance_km": null,
    "duration_minutes": null,
    "calories": null,
    "elevation_m": null,
    "power_5s_w": null,
    "power_1m_w": null,
    "power_5m_w": null,
    "power_20m_w": null
  },
  "your_best": {
    "best_5s_w": null,
    "best_1m_w": null,
    "best_5m_w": null,
    "best_20m_w": null
  },
  "totals": {
    "total_distance_km": null,
    "total_time_minutes": null,
    "total_calories": null,
    "total_elevation_m": null
  },
  "rider_score": {
    "score": null,
    "until_next_level": null
  },
  "distributions": {
    "avg_power_w": null,
    "avg_heart_rate_bpm": null
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

async function callAI(apiKey: string, prompt: string, imageUrl: string, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
      }),
    });

    // Retry on transient 502/503/500 errors
    if ((response.status === 502 || response.status === 503 || response.status === 500) && attempt < maxRetries) {
      console.warn(`AI gateway returned ${response.status}, retrying (attempt ${attempt + 1}/${maxRetries})...`);
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // backoff
      continue;
    }

    return response;
  }

  // Should not reach here, but fallback
  throw new Error("AI gateway failed after retries");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl || typeof imageUrl !== 'string') {
      return new Response(JSON.stringify({ error: "imageUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate URL is from our Supabase storage only (prevent SSRF and credit abuse)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const expectedPrefix = `${SUPABASE_URL}/storage/v1/object/`;
    if (!imageUrl.startsWith(expectedPrefix)) {
      return new Response(JSON.stringify({ error: "Invalid image URL - must be from storage bucket" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Detect screen type
    const detectResponse = await callAI(LOVABLE_API_KEY, SCREEN_DETECT_PROMPT, imageUrl);

    if (!detectResponse.ok) {
      const errorText = await detectResponse.text();
      console.error("Screen detect error:", detectResponse.status, errorText);

      if (detectResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (detectResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`Screen detect error: ${detectResponse.status}`);
    }

    const detectData = await detectResponse.json();
    const screenTypeRaw = (detectData.choices?.[0]?.message?.content || "").trim().toLowerCase();
    const screenType = screenTypeRaw.includes("ride_menu") ? "ride_menu" : "progress_report";
    console.log("Detected screen type:", screenType);

    // Step 2: Extract with appropriate prompt
    const extractionPrompt = screenType === "ride_menu" ? RIDE_MENU_PROMPT : PROGRESS_REPORT_PROMPT;
    const response = await callAI(LOVABLE_API_KEY, extractionPrompt, imageUrl);

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
        screen_type: screenType,
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
