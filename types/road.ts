export interface RoadSegment {
  id: string;
  name: string;
  startStation: number; // in kilometers
  endStation: number;
  isPaved: boolean;
  surfaceType: 'asphalt' | 'concrete' | 'gravel' | 'unpaved';
}

export interface ProjectStation {
  id: string;
  station: number; // in kilometers
  name: string;
  description: string;
  proposedWork: string;
}

export interface FundingRelease {
  id: string;
  startStation: number;
  endStation: number;
  year: number;
  amount: number;
  status: 'completed' | 'ongoing' | 'planned';
  description: string;
}

export interface RoadInventoryData {
  roadName: string;
  totalLength: number; // in kilometers
  segments: RoadSegment[];
  projectStations: ProjectStation[];
  fundingReleases: FundingRelease[];
}
