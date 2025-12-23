import ExifReader from 'exifreader';

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
    const tags = await ExifReader.load(file);

    const gpsLatitude = tags['GPSLatitude'];
    const gpsLongitude = tags['GPSLongitude'];
    const gpsAltitude = tags['GPSAltitude'];

    if (gpsLatitude && gpsLongitude && Array.isArray(gpsLatitude.value) && Array.isArray(gpsLongitude.value)) {
      const latitude = convertDMSToDecimal(gpsLatitude.value as unknown as [number, number, number]);
      const longitude = convertDMSToDecimal(gpsLongitude.value as unknown as [number, number, number]);

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
    const tags = await ExifReader.load(file);

    const gpsLatitude = tags['GPSLatitude'];
    const gpsLongitude = tags['GPSLongitude'];
    const gpsAltitude = tags['GPSAltitude'];

    const gps: GPSCoordinates | undefined = gpsLatitude && gpsLongitude && Array.isArray(gpsLatitude.value) && Array.isArray(gpsLongitude.value) ? {
      latitude: convertDMSToDecimal(gpsLatitude.value as unknown as [number, number, number]),
      longitude: convertDMSToDecimal(gpsLongitude.value as unknown as [number, number, number]),
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
 */
function convertDMSToDecimal(dms: number[]): number {
  const degrees = dms[0];
  const minutes = dms[1];
  const seconds = dms[2];

  return degrees + (minutes / 60) + (seconds / 3600);
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