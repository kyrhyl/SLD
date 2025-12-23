'use client';

import React, { useState, useEffect } from 'react';
import { PhotoMetadata, GPSCoordinates } from '@/utils/photoUtils';

interface PhotoGalleryProps {
  photos?: PhotoMetadata[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos: initialPhotos = [] }) => {
  const [photos, setPhotos] = useState<PhotoMetadata[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [filterByGPS, setFilterByGPS] = useState(false);

  // In a real app, you might fetch photos from an API
  // For now, we'll use the photos passed as props or stored locally

  const formatGPS = (gps?: GPSCoordinates): string => {
    if (!gps) return 'No GPS data';
    return `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}${gps.altitude ? ` (${gps.altitude}m)` : ''}`;
  };

  const formatTimestamp = (timestamp?: Date): string => {
    if (!timestamp) return 'No timestamp';
    return timestamp.toLocaleString();
  };

  const filteredPhotos = filterByGPS
    ? photos.filter(photo => photo.gps)
    : photos;

  const PhotoModal: React.FC<{ photo: PhotoMetadata; onClose: () => void }> = ({ photo, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{photo.filename}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-4">
              <img
                src={photo.filepath ? `/api/uploads/${photo.uploadedFilename}` : ''}
                alt={photo.filename}
                className="w-full h-auto max-h-[60vh] object-contain rounded"
              />
            </div>
            <div className="w-full md:w-80 p-4 bg-gray-50 border-t md:border-t-0 md:border-l">
              <h4 className="font-semibold text-gray-800 mb-3">Photo Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">📍 GPS:</span>
                  <p className="text-gray-800 mt-1">{formatGPS(photo.gps)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">📅 Taken:</span>
                  <p className="text-gray-800 mt-1">{formatTimestamp(photo.timestamp)}</p>
                </div>
                {photo.camera && (
                  <div>
                    <span className="font-medium text-gray-600">📷 Camera:</span>
                    <p className="text-gray-800 mt-1">{photo.camera}</p>
                  </div>
                )}
                {photo.dimensions && (
                  <div>
                    <span className="font-medium text-gray-600">📐 Size:</span>
                    <p className="text-gray-800 mt-1">{photo.dimensions.width} × {photo.dimensions.height}</p>
                  </div>
                )}
                {photo.uploadedFilename && (
                  <div>
                    <span className="font-medium text-gray-600">💾 File:</span>
                    <p className="text-gray-800 mt-1 text-xs break-all">{photo.uploadedFilename}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="photo-gallery">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Photo Gallery</h2>

        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="text-sm text-gray-600">
            {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} {filterByGPS ? 'with GPS data' : 'total'}
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filterByGPS}
              onChange={(e) => setFilterByGPS(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show only photos with GPS data</span>
          </label>
        </div>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📷</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No photos found</h3>
          <p className="text-gray-500">
            {filterByGPS
              ? 'No photos with GPS data. Try disabling the GPS filter.'
              : 'Upload some photos to see them in the gallery.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={photo.filepath ? `/api/uploads/${photo.uploadedFilename}` : ''}
                  alt={photo.filename}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-800 truncate mb-2">
                  {photo.filename}
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {photo.gps && (
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span className="truncate">
                        {photo.gps.latitude.toFixed(4)}, {photo.gps.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                  {photo.timestamp && (
                    <div className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>{photo.timestamp.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                {!photo.gps && (
                  <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    No GPS data
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

export default PhotoGallery;