import { Material } from "../types/material";
import { get } from "../utils/http";

const MATERIALS_API_URL = "http://localhost:5000/api/materials";

export async function getMaterials(): Promise<Material[]> {
    return get<Material[]>(MATERIALS_API_URL);
}

export async function getMaterialsDetailed(): Promise<any[]> {
    const response = await fetch("http://localhost:5000/api/materials/details");
    if (!response.ok) {
        throw new Error("Failed to fetch materials details");
    }
    return response.json();
}
