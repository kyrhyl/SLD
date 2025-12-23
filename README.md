# Road Inventory Straightline Diagram

An interactive Next.js application for visualizing road inventory data, including paved/unpaved sections, proposed project stations, and funding releases.

## Features

- **Interactive SVG-based diagram** showing road segments along a straightline
- **Visual differentiation** between paved and unpaved road sections
- **Funding release tracking** with color-coded status (completed, ongoing, planned)
- **Proposed project stations** marked with detailed information
- **Hover tooltips** for detailed information on each element
- **Interactive filters** with station range slider and dropdown filters
- **Editable data tables** for real-time road inventory management
- **Add, edit, and delete** road segments, project stations, and funding releases
- **Responsive design** with data tables and summary statistics
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## Interactive Controls

### Station Range Slider
- **Dual-range slider** to filter data by kilometer range
- **Visual indicator** shows the filtered range on the diagram with a blue shaded background
- **Real-time filtering** of road segments, project stations, and funding releases

### Surface Type Filter
- **Dropdown menu** to filter road segments by surface type
- **Options**: All, Asphalt, Concrete, Gravel, Unpaved
- **Real-time updates** show only matching road segments

### Funding Status Filter
- **Dropdown menu** to filter funding releases by status
- **Options**: All, Completed, Ongoing, Planned
- **Real-time updates** show only matching funding bars

### Edit Modes
- **Edit Segments**: Modify road segment names, station ranges, surface types, and paving status
- **Edit Stations**: Update project station names, locations, descriptions, and proposed work
- **Edit Funding**: Change funding years, amounts, descriptions, station ranges, and status
- **Add New Items**: Buttons to add new segments, stations, or funding releases
- **Delete Items**: Remove unwanted entries with delete buttons
- **Real-time Updates**: All changes immediately reflect in the diagram

### Button Locations
- **Edit buttons** are located in the header of each data table section
- **Add buttons** appear next to edit buttons when in edit mode
- **Delete buttons** appear in table rows when in edit mode

### Reset Filters
- **Reset button** to clear all filters and show full dataset

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
SLD/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with diagram and tables
│   └── globals.css         # Global styles
├── components/
│   └── StraightLineDiagram.tsx  # Main diagram component
├── types/
│   └── road.ts             # TypeScript interfaces
├── data/
│   └── sampleData.ts       # Sample road inventory data
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## Customizing Your Data

Edit `data/sampleData.ts` to customize the road inventory data:

### Road Segments
```typescript
segments: [
  {
    id: "seg1",
    name: "Section A",
    startStation: 0,
    endStation: 12,
    isPaved: true,
    surfaceType: "asphalt"
  },
  // Add more segments...
]
```

### Project Stations
```typescript
projectStations: [
  {
    id: "ps1",
    station: 5,
    name: "Station 1",
    description: "Bridge rehabilitation",
    proposedWork: "Structural repairs and repainting"
  },
  // Add more stations...
]
```

### Funding Releases
```typescript
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
  // Add more funding records...
]
```

## Diagram Legend

- **Dark lines**: Paved roads (asphalt/concrete)
- **Light dashed lines**: Unpaved roads (gravel/dirt)
- **Green bars**: Completed funding
- **Orange bars**: Ongoing funding
- **Blue bars**: Planned funding
- **Red circles**: Proposed project stations

## Interactive Features

- Hover over road segments to see surface type and station range
- Hover over funding bars to see amount and description
- Hover over project stations to see proposed work details
- View detailed tables below the diagram for all data

## Technologies Used

- **Next.js 15** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **SVG** - Vector graphics for diagram

## Future Enhancements

- Export diagram as PNG/PDF
- Zoom and pan functionality
- Filter by road status or funding year
- Import data from CSV/Excel
- Real-time data updates
- Print-friendly view
- Multiple road comparison

## License

MIT
