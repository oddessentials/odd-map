import { z } from 'zod';
import { normalizeOfficeCode, normalizeRegionId, validateSvgPathId } from './normalization.js';

export const OfficeCoordinateSchema = z.object({
  officeCode: z.string().transform(normalizeOfficeCode),
  lat: z.number(), // Reference only
  lon: z.number(), // Reference only
  svgX: z.number().nonnegative(),
  svgY: z.number().nonnegative(),
});

export const MapConfigSchema = z.object({
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
  coordinates: z.array(OfficeCoordinateSchema),
  pinAsset: z.string().optional(),
  regions: z
    .array(
      z.object({
        id: z.string().transform(normalizeRegionId),
        name: z.string(),
        // Auto-validates and normalizes using shared helper
        svgPathId: z.string().transform((id, ctx) => {
          try {
            // Will validate in verify scripts with clientId context
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
      })
    )
    .optional(),
});

export type MapConfig = z.infer<typeof MapConfigSchema>;
