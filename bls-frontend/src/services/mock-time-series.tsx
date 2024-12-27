import { TimeSeriesData } from "../types/timeSeries";

const timeSeriesData1: TimeSeriesData = {
  existing_data: [
    { ispredicted: false, month: 11, value: 314.435, year: 2024 },
    { ispredicted: false, month: 10, value: 305.49, year: 2024 },
    { ispredicted: false, month: 9, value: 290.55, year: 2024 },
    { ispredicted: false, month: 8, value: 297.382, year: 2024 },
    { ispredicted: false, month: 7, value: 322.36, year: 2024 },
    { ispredicted: false, month: 6, value: 335.207, year: 2024 },
    { ispredicted: false, month: 5, value: 310.021, year: 2024 },
    { ispredicted: false, month: 4, value: 272.242, year: 2024 },
    { ispredicted: false, month: 3, value: 264.333, year: 2024 },
    { ispredicted: false, month: 2, value: 267.409, year: 2024 },
    { ispredicted: false, month: 1, value: 259.053, year: 2024 },
    { ispredicted: false, month: 12, value: 258.599, year: 2023 }
  ],
  forecasted_data: [
    { ispredicted: true, month: 12, year: 2024, yhat: 288.82647208927057, yhat_lower: 246.55398956337967, yhat_upper: 330.7116055357734 },
    { ispredicted: true, month: 1, year: 2025, yhat: 310.6848214491291, yhat_lower: 266.55578153071804, yhat_upper: 353.1550810325287 },
    { ispredicted: true, month: 2, year: 2025, yhat: 299.32367915738075, yhat_lower: 256.9774976290948, yhat_upper: 340.5001292427697 },
    { ispredicted: true, month: 3, year: 2025, yhat: 307.60961461771655, yhat_lower: 267.853485786769, yhat_upper: 347.62680525163285 },
    { ispredicted: true, month: 4, year: 2025, yhat: 310.65671641455367, yhat_lower: 270.5224682098063, yhat_upper: 350.5131560733106 },
    { ispredicted: true, month: 5, year: 2025, yhat: 317.5268603211274, yhat_lower: 275.79547210903297, yhat_upper: 354.81811531398574 }
  ]
};

const timeSeriesData2: TimeSeriesData = {
  existing_data: [
    { ispredicted: false, month: 9, value: 160.4, year: 2024 },
    { ispredicted: false, month: 6, value: 159.6, year: 2024 },
    { ispredicted: false, month: 3, value: 158.1, year: 2024 },
    { ispredicted: false, month: 12, value: 155.8, year: 2023 }
  ],
  forecasted_data: [
    { ispredicted: true, month: 12, year: 2024, yhat: 161.70052204577212, yhat_lower: 161.33340772929623, yhat_upper: 162.061399145622 },
    { ispredicted: true, month: 3, year: 2025, yhat: 162.9914229892177, yhat_lower: 161.82622020488247, yhat_upper: 164.1411986390266 }
  ]
};

export async function getTimeSeriesData(materialId: number): Promise<TimeSeriesData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (materialId % 2 === 0) {
        resolve(timeSeriesData1);
      } else {
        resolve(timeSeriesData2);
      }
    }, 500);
  });
}
