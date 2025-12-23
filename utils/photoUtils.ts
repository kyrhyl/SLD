export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface PhotoMetadata {
  filename: string;
  gps?: GPSCoordinates;
  timestamp?: Date;
  camera?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Extract GPS coordinates from photo EXIF data
 */
export async function extractGPSFromPhoto(file: File): Promise<GPSCoordinates | null> {
  try {
    const { default: ExifReader } = await import('exifreader');

    const tags = await ExifReader.load(file);

    const gpsLatitude = tags['GPSLatitude'];
    const gpsLongitude = tags['GPSLongitude'];
    const gpsAltitude = tags['GPSAltitude'];

    if (gpsLatitude && gpsLongitude && Array.isArray(gpsLatitude.value) && Array.isArray(gpsLongitude.value)) {
      const latitude = convertDMSToDecimal(gpsLatitude.value);
      const longitude = convertDMSToDecimal(gpsLongitude.value);

      return {
        latitude,
        longitude,
        altitude: gpsAltitude && typeof gpsAltitude.value === 'number' ? gpsAltitude.value : undefined
      };
    }

    return null;
  } catch (error) {
    console.error('Error extracting GPS data:', error);
    return null;
  }
}

/**
 * Extract complete metadata from photo
 */
export async function extractPhotoMetadata(file: File): Promise<PhotoMetadata> {
  try {
    const { default: ExifReader } = await import('exifreader');

    const tags = await ExifReader.load(file);

    const gpsLatitude = tags['GPSLatitude'];
    const gpsLongitude = tags['GPSLongitude'];
    const gpsAltitude = tags['GPSAltitude'];

    const gps: GPSCoordinates | undefined = gpsLatitude && gpsLongitude && Array.isArray(gpsLatitude.value) && Array.isArray(gpsLongitude.value) ? {
      latitude: convertDMSToDecimal(gpsLatitude.value),
      longitude: convertDMSToDecimal(gpsLongitude.value),
      altitude: gpsAltitude && typeof gpsAltitude.value === 'number' ? gpsAltitude.value : undefined
    } : undefined;

    const dateTime = tags['DateTimeOriginal'] || tags['DateTime'];
    const timestamp = dateTime && typeof dateTime.value === 'string' ? parseExifDate(dateTime.value) : undefined;

    const make = tags['Make'];
    const model = tags['Model'];
    const camera = make && model && typeof make.value === 'string' && typeof model.value === 'string' ? `${make.value} ${model.value}` : undefined;

    const width = tags['ImageWidth'] || tags['ExifImageWidth'];
    const height = tags['ImageHeight'] || tags['ExifImageHeight'];
    const dimensions = width && height && typeof width.value === 'number' && typeof height.value === 'number' ? {
      width: width.value,
      height: height.value
    } : undefined;

    return {
      filename: file.name,
      gps,
      timestamp,
      camera,
      dimensions
    };
  } catch (error) {
    console.error('Error extracting photo metadata:', error);
    return {
      filename: file.name
    };
  }
}

/**
 * Convert GPS coordinates to station/kilometer position
 * This is a simplified conversion - you'd need actual road alignment data
 */
export function gpsToStation(gps: GPSCoordinates, roadAlignment: any): number {
  // This would require actual road geometry data
  // For now, return a placeholder calculation
  console.log('GPS to station conversion requires road alignment data');
  return 0;
}

/**
 * Check if coordinates are near a road segment
 */
export function isNearRoadSegment(
  gps: GPSCoordinates,
  segmentStart: number,
  segmentEnd: number,
  toleranceKm: number = 0.1
): boolean {
  // Simplified check - in reality, you'd use GIS calculations
  // to determine if GPS point is within tolerance of the road segment
  console.log(`Checking if GPS ${gps.latitude}, ${gps.longitude} is near segment ${segmentStart}-${segmentEnd}km`);
  return true; // Placeholder
}

/**
 * Convert GPS coordinates from DMS (Degrees, Minutes, Seconds) to decimal degrees
 * Handles EXIF rational number format where each component is [numerator, denominator]
 */
function convertDMSToDecimal(dms: any): number {
  // EXIF GPS data is stored as rational numbers: [[num, den], [num, den], [num, den]]
  if (Array.isArray(dms) && dms.length === 3) {
    const degrees = Array.isArray(dms[0]) ? dms[0][0] / dms[0][1] : dms[0];
    const minutes = Array.isArray(dms[1]) ? dms[1][0] / dms[1][1] : dms[1];
    const seconds = Array.isArray(dms[2]) ? dms[2][0] / dms[2][1] : dms[2];

    return degrees + (minutes / 60) + (seconds / 3600);
  }

  // Fallback for already converted decimal format
  if (typeof dms === 'number') {
    return dms;
  }

  throw new Error('Invalid DMS format');
}

/**
 * Parse EXIF date string to Date object
 */
function parseExifDate(dateString: string): Date | undefined {
  try {
    // EXIF date format: "YYYY:MM:DD HH:MM:SS"
    const match = dateString.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      return new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed in Date
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
    }
  } catch (error) {
    console.error('Error parsing EXIF date:', error);
  }
  return undefined;
}