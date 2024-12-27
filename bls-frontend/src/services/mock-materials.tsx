import { Material } from "../types/material";

export const mockMaterials: Material[] = [
  {
    id: 1,
    name: "Aluminum",
    series_id: "WPU102302"
  },
  {
    id: 2,
    name: "Asphalt",
    series_id: "WPU058"
  },
  {
    id: 3,
    name: "Commercial and Institutional Type Electric Lighting Fixture",
    series_id: "WPU108303"
  },
  {
    id: 4,
    name: "Concrete Brick",
    series_id: "WPU133131"
  },
  {
    id: 5,
    name: "Construction Machinery",
    series_id: "WPU112"
  },
  {
    id: 6,
    name: "Copper Wire",
    series_id: "WPU10230101"
  },
  {
    id: 7,
    name: "Elevator, Escalator and other Lifts",
    series_id: "WPU1142"
  },
  {
    id: 8,
    name: "Glass",
    series_id: "WPU131"
  },
  {
    id: 9,
    name: "Gypsum",
    series_id: "WPU137"
  },
  {
    id: 10,
    name: "HVAC and Commercial Refregeration",
    series_id: "WPU1148"
  },
  {
    id: 11,
    name: "Insulation",
    series_id: "WPU1392"
  },
  {
    id: 12,
    name: "Lumber and Plywood",
    series_id: "WPU084"
  },
  {
    id: 13,
    name: "Paint and Coating",
    series_id: "WPU0623"
  },
  {
    id: 14,
    name: "Plumbing",
    series_id: "WPS105402"
  },
  {
    id: 15,
    name: "Semi-conductor/Electronics",
    series_id: "WPU11785602"
  },
  {
    id: 16,
    name: "Steel Beam",
    series_id: "WPU10170810"
  },
  {
    id: 17,
    name: "Steel Gates",
    series_id: "WPU10740813"
  },
  {
    id: 18,
    name: "Steel Joist",
    series_id: "WPU10740510"
  },
  {
    id: 19,
    name: "Switchgear, Switchboard, Industrial Controls and Equipment",
    series_id: "WPU1175"
  },
  {
    id: 20,
    name: "Manufacturing and Labor Cost",
    series_id: "CIU2013000000000I"
  },
  {
    id: 21,
    name: "Crude Oil Import",
    series_id: "EIUIR10000"
  },
  {
    id: 22,
    name: "Electricity - west",
    series_id: "CUUS0400SEHF01"
  },
  {
    id: 23,
    name: "Electricity - midwest",
    series_id: "CUUS0200SEHF01"
  },
  {
    id: 24,
    name: "Electricity - south",
    series_id: "CUUS0300SEHF01"
  },
  {
    id: 25,
    name: "Electricity - northeast",
    series_id: "CUUS0100SEHF01"
  },
  {
    id: 26,
    name: "Transportation",
    series_id: "WPU301"
  },
  {
    id: 27,
    name: "Warehousing",
    series_id: "WPU32"
  }
];

export async function getMaterials(): Promise<Material[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMaterials);
    }, 500); // Simulate a delay of 0.5 second
  });
}
