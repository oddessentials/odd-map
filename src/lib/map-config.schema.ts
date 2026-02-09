import { z } from 'zod';
import { normalizeOfficeCode, normalizeRegionId, validateSvgPathId } from './normalization.js';

// --- Projection & SVG Override sub-schemas (T004) ---

export const ProjectionParamsSchema = z.object({
  type: z.literal('geoAlbersUsa'),
  scale: z.number().positive(),
  translate: z.tuple([z.number(), z.number()]),
});

export const SvgOverrideSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type ProjectionParams = z.infer<typeof ProjectionParamsSchema>;
export type SvgOverride = z.infer<typeof SvgOverrideSchema>;

// --- V1 coordinate schema (renamed from OfficeCoordinateSchema) ---

export const OfficeCoordinateV1Schema = z.object({
  officeCode: z.string().transform(normalizeOfficeCode),
  lat: z.number(), // Reference only
  lon: z.number(), // Reference only
  svgX: z.number().nonnegative(),
  svgY: z.number().nonnegative(),
});

// Backwards-compatible alias
export const OfficeCoordinateSchema = OfficeCoordinateV1Schema;

// --- V2 coordinate schema ---

export const OfficeCoordinateV2Schema = z.object({
  officeCode: z.string().transform(normalizeOfficeCode),
  lat: z.number(),
  lon: z.number(),
  svgOverride: SvgOverrideSchema.optional(),
});

// --- Shared region schema ---

const RegionSchema = z.object({
  id: z.string().transform(normalizeRegionId),
  name: z.string(),
  svgPathId: z.string().transform((id, ctx) => {
    try {
      return validateSvgPathId(id);
    } catch (err) {
      const error = err as Error;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error.message,
      });
      return z.NEVER;
    }
  }),
});

// --- V1 config schema ---

export const MapConfigV1Schema = z.object({
  configVersion: z.literal(1),
  mapId: z.string(),
  clientId: z.string(),
  mapAssetHash: z.string().regex(/^[a-f0-9]{64}$/),
  viewBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  coordinates: z.array(OfficeCoordinateV1Schema),
  pinAsset: z.string().optional(),
  regions: z.array(RegionSchema).optional(),
  projection: ProjectionParamsSchema.optional(),
});

// --- V2 config schema ---

export const MapConfigV2Schema = z.object({
  configVersion: z.literal(2),
  mapId: z.string(),
  clientId: z.string(),
  mapAssetHash: z.string().regex(/^[a-f0-9]{64}$/),
  viewBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  projection: ProjectionParamsSchema,
  coordinates: z.array(OfficeCoordinateV2Schema),
  pinAsset: z.string().optional(),
  regions: z.array(RegionSchema).optional(),
});

// --- Discriminated union ---

export const MapConfigSchema = z.discriminatedUnion('configVersion', [
  MapConfigV1Schema,
  MapConfigV2Schema,
]);

// --- Exported types ---

export type MapConfigV1 = z.infer<typeof MapConfigV1Schema>;
export type MapConfigV2 = z.infer<typeof MapConfigV2Schema>;
export type MapConfig = z.infer<typeof MapConfigSchema>;
