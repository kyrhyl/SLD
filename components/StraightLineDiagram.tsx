'use client';

import React, { useState } from 'react';
import { RoadInventoryData, RoadSegment, ProjectStation, FundingRelease } from '@/types/road';

interface StraightLineDiagramProps {
  data: RoadInventoryData;
  width?: number;
  height?: number;
  stationRange?: [number, number];
  surfaceTypeFilter?: string;
  fundingStatusFilter?: string;
}

const StraightLineDiagram: React.FC<StraightLineDiagramProps> = ({
  data,
  width = 1200,
  height = 600,
  stationRange = [0, data.totalLength],
  surfaceTypeFilter = 'all',
  fundingStatusFilter = 'all'
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [hoveredFunding, setHoveredFunding] = useState<string | null>(null);

  // Filter data based on props
  const filteredSegments = data.segments.filter(segment => {
    const inRange = segment.startStation < stationRange[1] && segment.endStation > stationRange[0];
    const surfaceMatch = surfaceTypeFilter === 'all' || segment.surfaceType === surfaceTypeFilter;
    return inRange && surfaceMatch;
  });

  const filteredStations = data.projectStations.filter(station => {
    return station.station >= stationRange[0] && station.station <= stationRange[1];
  });

  const filteredFunding = data.fundingReleases.filter(funding => {
    const inRange = funding.startStation < stationRange[1] && funding.endStation > stationRange[0];
    const statusMatch = fundingStatusFilter === 'all' || funding.status === fundingStatusFilter;
    return inRange && statusMatch;
  });

  // Layout parameters
  const margin = { top: 80, right: 100, bottom: 80, left: 100 };
  const diagramWidth = width - margin.left - margin.right;
  const diagramHeight = height - margin.top - margin.bottom;

  // Scale factor: pixels per kilometer
  const scale = diagramWidth / data.totalLength;

  // Convert station (km) to x position
  const getX = (station: number) => margin.left + station * scale;

  // Y positions for different layers
  const roadY = margin.top + 150;
  const fundingY = margin.top + 50;
  const stationY = margin.top + 250;

  // Colors
  const getSegmentColor = (segment: RoadSegment) => {
    if (segment.isPaved) {
      return segment.surfaceType === 'asphalt' ? '#2C3E50' : '#34495E';
    }
    return segment.surfaceType === 'gravel' ? '#95A5A6' : '#BDC3C7';
  };

  const getFundingColor = (funding: FundingRelease) => {
    switch (funding.status) {
      case 'completed': return '#27AE60';
      case 'ongoing': return '#F39C12';
      case 'planned': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  return (
    <div className="straightline-diagram">
      <svg width={width} height={height} style={{ background: '#f8f9fa' }}>
        {/* Title */}
        <text
          x={width / 2}
          y={30}
          textAnchor="middle"
          style={{ fontSize: '24px', fontWeight: 'bold', fill: '#2C3E50' }}
        >
          {data.roadName} - Straightline Diagram
        </text>

        {/* Station Range Indicator */}
        {stationRange[0] > 0 || stationRange[1] < data.totalLength ? (
          <g>
            <rect
              x={getX(stationRange[0])}
              y={margin.top - 10}
              width={getX(stationRange[1]) - getX(stationRange[0])}
              height={height - margin.top - margin.bottom + 20}
              fill="#E3F2FD"
              opacity={0.3}
              stroke="#2196F3"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
            <text
              x={(getX(stationRange[0]) + getX(stationRange[1])) / 2}
              y={margin.top - 15}
              textAnchor="middle"
              style={{ fontSize: '12px', fill: '#2196F3', fontWeight: 'bold' }}
            >
              Filtered Range: {stationRange[0]} - {stationRange[1]} km
            </text>
          </g>
        ) : null}

        {/* Funding Releases Layer */}
        <g>
          <text
            x={margin.left - 10}
            y={fundingY}
            textAnchor="end"
            style={{ fontSize: '14px', fontWeight: 'bold', fill: '#555' }}
          >
            Funding:
          </text>
          {filteredFunding.map((funding) => {
            const x1 = getX(funding.startStation);
            const x2 = getX(funding.endStation);
            const isHovered = hoveredFunding === funding.id;

            return (
              <g key={funding.id}>
                {/* Funding bar */}
                <rect
                  x={x1}
                  y={fundingY - 15}
                  width={x2 - x1}
                  height={30}
                  fill={getFundingColor(funding)}
                  opacity={isHovered ? 1 : 0.7}
                  stroke="#fff"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredFunding(funding.id)}
                  onMouseLeave={() => setHoveredFunding(null)}
                  style={{ cursor: 'pointer' }}
                />
                {/* Funding label */}
                <text
                  x={(x1 + x2) / 2}
                  y={fundingY + 5}
                  textAnchor="middle"
                  style={{ fontSize: '11px', fill: '#fff', fontWeight: 'bold', pointerEvents: 'none' }}
                >
                  {funding.year}
                </text>
                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={(x1 + x2) / 2 - 100}
                      y={fundingY - 60}
                      width={200}
                      height={40}
                      fill="#333"
                      rx={5}
                      opacity={0.95}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={fundingY - 45}
                      textAnchor="middle"
                      style={{ fontSize: '12px', fill: '#fff', fontWeight: 'bold' }}
                    >
                      {funding.description}
                    </text>
                    <text
                      x={(x1 + x2) / 2}
                      y={fundingY - 28}
                      textAnchor="middle"
                      style={{ fontSize: '11px', fill: '#fff' }}
                    >
                      ${(funding.amount / 1000000).toFixed(1)}M - {funding.status}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Road Segments Layer */}
        <g>
          <text
            x={margin.left - 10}
            y={roadY}
            textAnchor="end"
            style={{ fontSize: '14px', fontWeight: 'bold', fill: '#555' }}
          >
            Road:
          </text>
          {filteredSegments.map((segment) => {
            const x1 = getX(segment.startStation);
            const x2 = getX(segment.endStation);
            const isHovered = hoveredSegment === segment.id;

            return (
              <g key={segment.id}>
                {/* Road segment line */}
                <line
                  x1={x1}
                  y1={roadY}
                  x2={x2}
                  y2={roadY}
                  stroke={getSegmentColor(segment)}
                  strokeWidth={isHovered ? 16 : 12}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ cursor: 'pointer' }}
                />
                {/* Pattern for unpaved roads */}
                {!segment.isPaved && (
                  <line
                    x1={x1}
                    y1={roadY}
                    x2={x2}
                    y2={roadY}
                    stroke="#fff"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                {/* Segment label */}
                <text
                  x={(x1 + x2) / 2}
                  y={roadY + 30}
                  textAnchor="middle"
                  style={{ fontSize: '12px', fill: '#555', fontWeight: 'bold' }}
                >
                  {segment.name}
                </text>
                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={(x1 + x2) / 2 - 80}
                      y={roadY - 50}
                      width={160}
                      height={35}
                      fill="#333"
                      rx={5}
                      opacity={0.95}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={roadY - 35}
                      textAnchor="middle"
                      style={{ fontSize: '12px', fill: '#fff', fontWeight: 'bold' }}
                    >
                      {segment.isPaved ? 'Paved' : 'Unpaved'} - {segment.surfaceType}
                    </text>
                    <text
                      x={(x1 + x2) / 2}
                      y={roadY - 20}
                      textAnchor="middle"
                      style={{ fontSize: '11px', fill: '#fff' }}
                    >
                      Sta {segment.startStation}+000 to {segment.endStation}+000
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Project Stations Layer */}
        <g>
          <text
            x={margin.left - 10}
            y={stationY - 10}
            textAnchor="end"
            style={{ fontSize: '14px', fontWeight: 'bold', fill: '#555' }}
          >
            Proposed:
          </text>
          {filteredStations.map((station) => {
            const x = getX(station.station);
            const isHovered = hoveredStation === station.id;

            return (
              <g key={station.id}>
                {/* Connection line */}
                <line
                  x1={x}
                  y1={roadY + 6}
                  x2={x}
                  y2={stationY - 30}
                  stroke="#E74C3C"
                  strokeWidth={2}
                  strokeDasharray="4,4"
                />
                {/* Station marker */}
                <circle
                  cx={x}
                  cy={stationY - 30}
                  r={isHovered ? 10 : 8}
                  fill="#E74C3C"
                  stroke="#fff"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                  style={{ cursor: 'pointer' }}
                />
                {/* Station label */}
                <text
                  x={x}
                  y={stationY}
                  textAnchor="middle"
                  style={{ fontSize: '11px', fill: '#E74C3C', fontWeight: 'bold' }}
                >
                  {station.name}
                </text>
                <text
                  x={x}
                  y={stationY + 13}
                  textAnchor="middle"
                  style={{ fontSize: '10px', fill: '#999' }}
                >
                  Sta {station.station}+000
                </text>
                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 100}
                      y={stationY - 90}
                      width={200}
                      height={50}
                      fill="#333"
                      rx={5}
                      opacity={0.95}
                    />
                    <text
                      x={x}
                      y={stationY - 72}
                      textAnchor="middle"
                      style={{ fontSize: '12px', fill: '#fff', fontWeight: 'bold' }}
                    >
                      {station.description}
                    </text>
                    <text
                      x={x}
                      y={stationY - 58}
                      textAnchor="middle"
                      style={{ fontSize: '11px', fill: '#fff' }}
                    >
                      {station.proposedWork}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Scale markers */}
        <g>
          {Array.from({ length: Math.floor(data.totalLength / 10) + 1 }, (_, i) => i * 10).map((km) => {
            const x = getX(km);
            return (
              <g key={km}>
                <line
                  x1={x}
                  y1={roadY - 60}
                  x2={x}
                  y2={roadY - 50}
                  stroke="#999"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={roadY - 65}
                  textAnchor="middle"
                  style={{ fontSize: '10px', fill: '#666' }}
                >
                  {km} km
                </text>
              </g>
            );
          })}
          {/* Scale line */}
          <line
            x1={margin.left}
            y1={roadY - 55}
            x2={margin.left + diagramWidth}
            y2={roadY - 55}
            stroke="#999"
            strokeWidth={1}
          />
        </g>

        {/* Legend */}
        <g transform={`translate(${width - margin.right + 20}, ${margin.top})`}>
          <text x={0} y={0} style={{ fontSize: '14px', fontWeight: 'bold', fill: '#555' }}>
            Legend
          </text>
          
          {/* Road types */}
          <text x={0} y={25} style={{ fontSize: '12px', fill: '#666' }}>Road Surface:</text>
          <line x1={0} y1={35} x2={50} y2={35} stroke="#2C3E50" strokeWidth={4} />
          <text x={55} y={38} style={{ fontSize: '11px', fill: '#666' }}>Paved</text>
          
          <line x1={0} y1={50} x2={50} y2={50} stroke="#BDC3C7" strokeWidth={4} strokeDasharray="5,5" />
          <text x={55} y={53} style={{ fontSize: '11px', fill: '#666' }}>Unpaved</text>
          
          {/* Funding status */}
          <text x={0} y={75} style={{ fontSize: '12px', fill: '#666' }}>Funding:</text>
          <rect x={0} y={82} width={50} height={12} fill="#27AE60" />
          <text x={55} y={91} style={{ fontSize: '11px', fill: '#666' }}>Completed</text>
          
          <rect x={0} y={100} width={50} height={12} fill="#F39C12" />
          <text x={55} y={109} style={{ fontSize: '11px', fill: '#666' }}>Ongoing</text>
          
          <rect x={0} y={118} width={50} height={12} fill="#3498DB" />
          <text x={55} y={127} style={{ fontSize: '11px', fill: '#666' }}>Planned</text>
          
          {/* Project stations */}
          <text x={0} y={150} style={{ fontSize: '12px', fill: '#666' }}>Proposed:</text>
          <circle cx={25} cy={162} r={6} fill="#E74C3C" stroke="#fff" strokeWidth={2} />
          <text x={55} y={165} style={{ fontSize: '11px', fill: '#666' }}>Station</text>
        </g>
      </svg>
    </div>
  );
};

export default StraightLineDiagram;
