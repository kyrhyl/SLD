'use client';

import StraightLineDiagram from '@/components/StraightLineDiagram';
import PhotoUpload from '@/components/PhotoUpload';
import { sampleRoadData } from '@/data/sampleData';
import { useState } from 'react';
import { RoadInventoryData, RoadSegment, ProjectStation, FundingRelease } from '@/types/road';

export default function Home() {
  const [data, setData] = useState<RoadInventoryData>(sampleRoadData);
  const [stationRange, setStationRange] = useState<[number, number]>([0, data.totalLength]);
  const [surfaceTypeFilter, setSurfaceTypeFilter] = useState<string>('all');
  const [fundingStatusFilter, setFundingStatusFilter] = useState<string>('all');
  const [editMode, setEditMode] = useState<'segments' | 'stations' | 'funding' | null>(null);

  const surfaceTypes = ['all', 'asphalt', 'concrete', 'gravel', 'unpaved'];
  const fundingStatuses = ['all', 'completed', 'ongoing', 'planned'];

  // Update station range when data changes
  const updateStationRange = (newData: RoadInventoryData) => {
    setStationRange([0, newData.totalLength]);
  };

  // Segment editing functions
  const updateSegment = (id: string, updates: Partial<RoadSegment>) => {
    setData(prev => ({
      ...prev,
      segments: prev.segments.map(seg => seg.id === id ? { ...seg, ...updates } : seg)
    }));
  };

  const deleteSegment = (id: string) => {
    setData(prev => ({
      ...prev,
      segments: prev.segments.filter(seg => seg.id !== id)
    }));
  };

  const addSegment = () => {
    const newSegment: RoadSegment = {
      id: `seg${Date.now()}`,
      name: 'New Section',
      startStation: data.segments.length > 0 ? data.segments[data.segments.length - 1].endStation : 0,
      endStation: data.segments.length > 0 ? data.segments[data.segments.length - 1].endStation + 5 : 5,
      isPaved: false,
      surfaceType: 'unpaved'
    };
    setData(prev => ({
      ...prev,
      segments: [...prev.segments, newSegment]
    }));
  };

  // Station editing functions
  const updateStation = (id: string, updates: Partial<ProjectStation>) => {
    setData(prev => ({
      ...prev,
      projectStations: prev.projectStations.map(station => station.id === id ? { ...station, ...updates } : station)
    }));
  };

  const deleteStation = (id: string) => {
    setData(prev => ({
      ...prev,
      projectStations: prev.projectStations.filter(station => station.id !== id)
    }));
  };

  const addStation = () => {
    const newStation: ProjectStation = {
      id: `ps${Date.now()}`,
      station: Math.round(data.totalLength / 2),
      name: 'New Station',
      description: 'New project station',
      proposedWork: 'Work description'
    };
    setData(prev => ({
      ...prev,
      projectStations: [...prev.projectStations, newStation]
    }));
  };

  // Funding editing functions
  const updateFunding = (id: string, updates: Partial<FundingRelease>) => {
    setData(prev => ({
      ...prev,
      fundingReleases: prev.fundingReleases.map(funding => funding.id === id ? { ...funding, ...updates } : funding)
    }));
  };

  const deleteFunding = (id: string) => {
    setData(prev => ({
      ...prev,
      fundingReleases: prev.fundingReleases.filter(funding => funding.id !== id)
    }));
  };

  const addFunding = () => {
    const newFunding: FundingRelease = {
      id: `fr${Date.now()}`,
      startStation: 0,
      endStation: 10,
      year: new Date().getFullYear(),
      amount: 10000000,
      status: 'planned',
      description: 'New funding release'
    };
    setData(prev => ({
      ...prev,
      fundingReleases: [...prev.fundingReleases, newFunding]
    }));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Road Inventory Straightline Diagram
          </h1>
          <p className="text-gray-600">
            Interactive visualization showing paved roads, proposed project stations, and funding releases
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Station Range Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Station Range: {stationRange[0]} km - {stationRange[1]} km
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min={0}
                  max={data.totalLength}
                  value={stationRange[0]}
                  onChange={(e) => setStationRange([parseFloat(e.target.value), stationRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min={0}
                  max={data.totalLength}
                  value={stationRange[1]}
                  onChange={(e) => setStationRange([stationRange[0], parseFloat(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 km</span>
                <span>{data.totalLength} km</span>
              </div>
            </div>

            {/* Surface Type Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Surface Type Filter
              </label>
              <select
                value={surfaceTypeFilter}
                onChange={(e) => setSurfaceTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {surfaceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Surface Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Funding Status Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Funding Status Filter
              </label>
              <select
                value={fundingStatusFilter}
                onChange={(e) => setFundingStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {fundingStatuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-4">
            <button
              onClick={() => {
                setStationRange([0, data.totalLength]);
                setSurfaceTypeFilter('all');
                setFundingStatusFilter('all');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <StraightLineDiagram
            data={data}
            stationRange={stationRange}
            surfaceTypeFilter={surfaceTypeFilter}
            fundingStatusFilter={fundingStatusFilter}
          />
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📸 Road Photo Management</h2>
          <p className="text-gray-600 mb-4">
            Upload geotagged photos to associate with road segments and stations
          </p>
          <PhotoUpload
            onPhotoProcessed={(metadata) => {
              console.log('Photo processed:', metadata);
              // Here you could automatically associate photos with nearby stations
              // or add them to the road inventory data
            }}
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Road Inventory Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Length</h3>
              <p className="text-3xl font-bold text-blue-600">{data.totalLength} km</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Paved Sections</h3>
              <p className="text-3xl font-bold text-green-600">
                {data.segments.filter(s => s.isPaved).length} / {data.segments.length}
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Project Stations</h3>
              <p className="text-3xl font-bold text-red-600">{data.projectStations.length}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-800">Road Segments</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(editMode === 'segments' ? null : 'segments')}
                  className={`px-3 py-1 rounded-md transition-colors text-sm ${
                    editMode === 'segments'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {editMode === 'segments' ? 'Exit Edit' : 'Edit'}
                </button>
                {editMode === 'segments' && (
                  <button
                    onClick={addSegment}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    + Add Segment
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Station Range</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Length (km)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Surface Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.segments.map((segment) => (
                    <tr key={segment.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'segments' ? (
                          <input
                            type="text"
                            value={segment.name}
                            onChange={(e) => updateSegment(segment.id, { name: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          segment.name
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'segments' ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={segment.startStation}
                              onChange={(e) => updateSegment(segment.id, { startStation: parseFloat(e.target.value) })}
                              className="w-20 px-2 py-1 border rounded"
                              step="0.1"
                            />
                            <span>-</span>
                            <input
                              type="number"
                              value={segment.endStation}
                              onChange={(e) => updateSegment(segment.id, { endStation: parseFloat(e.target.value) })}
                              className="w-20 px-2 py-1 border rounded"
                              step="0.1"
                            />
                          </div>
                        ) : (
                          `${segment.startStation}+000 - ${segment.endStation}+000`
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {segment.endStation - segment.startStation}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'segments' ? (
                          <select
                            value={segment.surfaceType}
                            onChange={(e) => updateSegment(segment.id, { surfaceType: e.target.value as any })}
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="asphalt">Asphalt</option>
                            <option value="concrete">Concrete</option>
                            <option value="gravel">Gravel</option>
                            <option value="unpaved">Unpaved</option>
                          </select>
                        ) : (
                          <span className="capitalize">{segment.surfaceType}</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'segments' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={segment.isPaved}
                              onChange={(e) => updateSegment(segment.id, { isPaved: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${
                              segment.isPaved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {segment.isPaved ? 'Paved' : 'Unpaved'}
                            </span>
                            <button
                              onClick={() => deleteSegment(segment.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            segment.isPaved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {segment.isPaved ? 'Paved' : 'Unpaved'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-800">Funding Releases</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(editMode === 'funding' ? null : 'funding')}
                  className={`px-3 py-1 rounded-md transition-colors text-sm ${
                    editMode === 'funding'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  {editMode === 'funding' ? 'Exit Edit' : 'Edit'}
                </button>
                {editMode === 'funding' && (
                  <button
                    onClick={addFunding}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                  >
                    + Add Funding
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Station Range</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fundingReleases.map((funding) => (
                    <tr key={funding.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'funding' ? (
                          <input
                            type="number"
                            value={funding.year}
                            onChange={(e) => updateFunding(funding.id, { year: parseInt(e.target.value) })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          funding.year
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'funding' ? (
                          <input
                            type="text"
                            value={funding.description}
                            onChange={(e) => updateFunding(funding.id, { description: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          funding.description
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'funding' ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={funding.startStation}
                              onChange={(e) => updateFunding(funding.id, { startStation: parseFloat(e.target.value) })}
                              className="w-20 px-2 py-1 border rounded"
                              step="0.1"
                            />
                            <span>-</span>
                            <input
                              type="number"
                              value={funding.endStation}
                              onChange={(e) => updateFunding(funding.id, { endStation: parseFloat(e.target.value) })}
                              className="w-20 px-2 py-1 border rounded"
                              step="0.1"
                            />
                          </div>
                        ) : (
                          `${funding.startStation}+000 - ${funding.endStation}+000`
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'funding' ? (
                          <input
                            type="number"
                            value={funding.amount}
                            onChange={(e) => updateFunding(funding.id, { amount: parseInt(e.target.value) })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          `$${(funding.amount / 1000000).toFixed(1)}M`
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'funding' ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={funding.status}
                              onChange={(e) => updateFunding(funding.id, { status: e.target.value as any })}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="completed">Completed</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="planned">Planned</option>
                            </select>
                            <button
                              onClick={() => deleteFunding(funding.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            funding.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : funding.status === 'ongoing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {funding.status.charAt(0).toUpperCase() + funding.status.slice(1)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-800">Proposed Project Stations</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(editMode === 'stations' ? null : 'stations')}
                  className={`px-3 py-1 rounded-md transition-colors text-sm ${
                    editMode === 'stations'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {editMode === 'stations' ? 'Exit Edit' : 'Edit'}
                </button>
                {editMode === 'stations' && (
                  <button
                    onClick={addStation}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    + Add Station
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Station</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Proposed Work</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projectStations.map((station) => (
                    <tr key={station.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'stations' ? (
                          <input
                            type="text"
                            value={station.name}
                            onChange={(e) => updateStation(station.id, { name: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          station.name
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'stations' ? (
                          <div className="flex items-center gap-2">
                            <span>Sta</span>
                            <input
                              type="number"
                              value={station.station}
                              onChange={(e) => updateStation(station.id, { station: parseFloat(e.target.value) })}
                              className="w-20 px-2 py-1 border rounded"
                              step="0.1"
                            />
                            <span>+000</span>
                          </div>
                        ) : (
                          `Sta ${station.station}+000`
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'stations' ? (
                          <input
                            type="text"
                            value={station.description}
                            onChange={(e) => updateStation(station.id, { description: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          station.description
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode === 'stations' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={station.proposedWork}
                              onChange={(e) => updateStation(station.id, { proposedWork: e.target.value })}
                              className="flex-1 px-2 py-1 border rounded"
                            />
                            <button
                              onClick={() => deleteStation(station.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          station.proposedWork
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Use</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li><strong>View Mode:</strong> Hover over road segments, funding bars, and project stations for details</li>
            <li><strong>Edit Mode:</strong> Click "Edit" buttons next to each table header to modify data</li>
            <li><strong>Add Items:</strong> Use the "+ Add" buttons that appear when in edit mode</li>
            <li><strong>Delete Items:</strong> Click "Delete" buttons next to items in edit mode</li>
            <li><strong>Filters:</strong> Use sliders and dropdowns to focus on specific data ranges</li>
            <li><strong>Real-time Updates:</strong> Changes appear immediately in the diagram</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
