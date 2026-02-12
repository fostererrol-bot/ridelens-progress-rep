import ExifReader from "exifreader";
import type { ImageMetadata } from "@/types/zwift";

/**
 * Extracts image metadata (EXIF DateTimeOriginal, camera info) from a File.
 * Falls back to file lastModified if no EXIF data is present.
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const tags = ExifReader.load(arrayBuffer);

    const dateTimeOriginal = tags["DateTimeOriginal"]?.description;
    const cameraMake = tags["Make"]?.description;
    const cameraModel = tags["Model"]?.description;

    // Parse timezone offset from OffsetTimeOriginal (e.g., "+02:00")
    const offsetStr = tags["OffsetTimeOriginal"]?.description;
    let timezoneOffsetMinutes: number | null = null;
    if (offsetStr) {
      const match = offsetStr.match(/^([+-])(\d{2}):(\d{2})$/);
      if (match) {
        const sign = match[1] === "+" ? 1 : -1;
        timezoneOffsetMinutes = sign * (parseInt(match[2]) * 60 + parseInt(match[3]));
      }
    }

    if (dateTimeOriginal) {
      // EXIF format: "2025:02:08 11:05:30" → ISO: "2025-02-08T11:05:30"
      const isoDate = dateTimeOriginal.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3").replace(" ", "T");
      return {
        captured_at: isoDate,
        timezone_offset_minutes: timezoneOffsetMinutes,
        metadata_source: "exif",
        camera_make: cameraMake || undefined,
        camera_model: cameraModel || undefined,
      };
    }

    // Fallback to file last modified time
    if (file.lastModified) {
      return {
        captured_at: new Date(file.lastModified).toISOString(),
        timezone_offset_minutes: null,
        metadata_source: "file",
      };
    }
  } catch (err) {
    console.warn("Failed to extract EXIF metadata:", err);
  }

  // Fallback to file modified time or now
  return {
    captured_at: file.lastModified ? new Date(file.lastModified).toISOString() : null,
    timezone_offset_minutes: null,
    metadata_source: file.lastModified ? "file" : "unknown",
  };
}
