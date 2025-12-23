import { RoadInventoryData } from '@/types/road';

export const sampleRoadData: RoadInventoryData = {
  roadName: "National Highway 101",
  totalLength: 50, // 50 km
  segments: [
    {
      id: "seg1",
      name: "Section A",
      startStation: 0,
      endStation: 12,
      isPaved: true,
      surfaceType: "asphalt"
    },
    {
      id: "seg2",
      name: "Section B",
      startStation: 12,
      endStation: 18,
      isPaved: false,
      surfaceType: "gravel"
    },
    {
      id: "seg3",
      name: "Section C",
      startStation: 18,
      endStation: 30,
      isPaved: true,
      surfaceType: "concrete"
    },
    {
      id: "seg4",
      name: "Section D",
      startStation: 30,
      endStation: 38,
      isPaved: false,
      surfaceType: "unpaved"
    },
    {
      id: "seg5",
      name: "Section E",
      startStation: 38,
      endStation: 50,
      isPaved: true,
      surfaceType: "asphalt"
    }
  ],
  projectStations: [
    {
      id: "ps1",
      station: 5,
      name: "Station 1",
      description: "Bridge rehabilitation",
      proposedWork: "Structural repairs and repainting"
    },
    {
      id: "ps2",
      station: 15,
      name: "Station 2",
      description: "Road paving",
      proposedWork: "Convert gravel to asphalt"
    },
    {
      id: "ps3",
      station: 25,
      name: "Station 3",
      description: "Intersection improvement",
      proposedWork: "Traffic light installation"
    },
    {
      id: "ps4",
      station: 35,
      name: "Station 4",
      description: "Road widening",
      proposedWork: "Expand to 4 lanes"
    },
    {
      id: "ps5",
      station: 45,
      name: "Station 5",
      description: "Drainage system",
      proposedWork: "Install new drainage"
    }
  ],
  fundingReleases: [
    {
      id: "fr1",
      startStation: 0,
      endStation: 12,
      year: 2022,
      amount: 15000000,
      status: "completed",
      description: "Initial paving - Phase 1"
    },
    {
      id: "fr2",
      startStation: 18,
      endStation: 30,
      year: 2023,
      amount: 25000000,
      status: "completed",
      description: "Concrete resurfacing - Phase 2"
    },
    {
      id: "fr3",
      startStation: 12,
      endStation: 18,
      year: 2024,
      amount: 12000000,
      status: "ongoing",
      description: "Paving Section B - Phase 3"
    },
    {
      id: "fr4",
      startStation: 30,
      endStation: 38,
      year: 2025,
      amount: 18000000,
      status: "planned",
      description: "Road improvement - Phase 4"
    }
  ]
};
