import { exifr } from 'exifr';

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
    const exifData = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true
    });

    if (exifData && exifData.latitude && exifData.longitude) {
      return {
        latitude: exifData.latitude,
        longitude: exifData.longitude,
        altitude: exifData.GPSAltitude || undefined,
        accuracy: exifData.GPSHPositioningError || undefined
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
    const exifData = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true,
      ifd0: true,
      ifd1: true
    });

    const gps: GPSCoordinates | undefined = exifData?.latitude && exifData?.longitude ? {
      latitude: exifData.latitude,
      longitude: exifData.longitude,
      altitude: exifData.GPSAltitude || undefined,
      accuracy: exifData.GPSHPositioningError || undefined
    } : undefined;

    return {
      filename: file.name,
      gps,
      timestamp: exifData?.DateTimeOriginal || exifData?.DateTime || undefined,
      camera: exifData?.Make && exifData?.Model ? `${exifData.Make} ${exifData.Model}` : undefined,
      dimensions: exifData?.ImageWidth && exifData?.ImageHeight ? {
        width: exifData.ImageWidth,
        height: exifData.ImageHeight
      } : undefined
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