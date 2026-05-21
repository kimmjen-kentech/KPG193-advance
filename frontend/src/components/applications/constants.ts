/**
 * Illustrative assumption values for the Applications page.
 * NOT measured from KPG-193 data — used only for scenario calculations.
 * UI must clearly mark anything derived from these as "estimation/추정".
 *
 * Source attribution shown in the Coal Phaseout footnote.
 */

// IEA, "Emissions Factors 2023" — global average for fuel-based power generation.
// tCO2 per MWh produced.
export const EMISSION_FACTORS_TCO2_PER_MWH = {
  coal: '0.82',
  lng: '0.49',
  nuclear: '0',
} as const;

// Assumed average capacity factor for thermal generation when computing
// "annual CO2 avoided" given coal MW removed. Real CF varies; 0.6 is a common
// illustrative value for coal baseload.
export const COAL_ASSUMED_CF = '0.6';
