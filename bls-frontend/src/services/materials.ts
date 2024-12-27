import { Material } from "../types/material";
import { get } from "../utils/http";

const MATERIALS_API_URL = "http://localhost:5000/api/materials";

export async function getMaterials(): Promise<Material[]> {
    return get<Material[]>(MATERIALS_API_URL);
}
