'use client';

import React, { useState, useRef } from 'react';
import { extractPhotoMetadata, extractGPSFromPhoto, GPSCoordinates, PhotoMetadata } from '@/utils/photoUtils';

interface PhotoUploadProps {
  onPhotoProcessed?: (metadata: PhotoMetadata) => void;
  stationKm?: number;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoProcessed, stationKm }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoMetadata[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    const newPhotos: PhotoMetadata[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          // First, upload the file to the server
          const formData = new FormData();
          formData.append('file', file);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload file');
          }

          const uploadResult = await uploadResponse.json();
          console.log('File uploaded:', uploadResult);

          // Then extract metadata
          const metadata = await extractPhotoMetadata(file);
          // Add the server path to the metadata
          metadata.filepath = uploadResult.path;
          metadata.uploadedFilename = uploadResult.filename;

          newPhotos.push(metadata);

          if (onPhotoProcessed) {
            onPhotoProcessed(metadata);
          }
        } catch (error) {
          console.error('Error processing photo:', error);
        }
      }
    }

    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setIsProcessing(false);
  };

  const formatGPS = (gps?: GPSCoordinates): string => {
    if (!gps) return 'No GPS data';
    return `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}${gps.altitude ? ` (${gps.altitude}m)` : ''}`;
  };

  const formatTimestamp = (timestamp?: Date): string => {
    if (!timestamp) return 'No timestamp';
    return timestamp.toLocaleString();
  };

  return (
    <div className="photo-upload">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Road Photos {stationKm && `(Station ${stationKm}+000)`}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {isProcessing && (
          <p className="text-sm text-blue-600 mt-2">Processing photos...</p>
        )}
      </div>

      {uploadedPhotos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Uploaded Photos</h3>
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={photo.filepath ? `/uploads/${photo.uploadedFilename}` : URL.createObjectURL(new File([], photo.filename))}
                    alt={photo.filename}
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {photo.filename}
                  </h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      📍 <strong>GPS:</strong> {formatGPS(photo.gps)}
                    </p>
                    <p className="text-sm text-gray-600">
                      📅 <strong>Taken:</strong> {formatTimestamp(photo.timestamp)}
                    </p>
                    {photo.camera && (
                      <p className="text-sm text-gray-600">
                        📷 <strong>Camera:</strong> {photo.camera}
                      </p>
                    )}
                    {photo.dimensions && (
                      <p className="text-sm text-gray-600">
                        📐 <strong>Size:</strong> {photo.dimensions.width} × {photo.dimensions.height}
                      </p>
                    )}
                  </div>
                  {photo.gps && stationKm && (
                    <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800">
                      ✅ GPS coordinates detected - can be associated with Station {stationKm}+000
                    </div>
                  )}
                  {!photo.gps && (
                    <div className="mt-2 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
                      ⚠️ No GPS data found in photo metadata
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Geotagging Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Enable GPS on your camera/phone when taking road photos</li>
          <li>• Photos with GPS data can be automatically linked to road stations</li>
          <li>• Supported formats: JPEG, PNG, TIFF, HEIC (with GPS metadata)</li>
          <li>• Altitude and accuracy data are also extracted when available</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUpload;