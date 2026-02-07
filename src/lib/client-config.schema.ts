/**
 * Client Configuration Schema - Zod Validation
 *
 * Runtime validation for client configuration JSON files.
 * Produces descriptive error messages per contract.
 */

import { z } from 'zod';

export const MAX_SUPPORTED_SCHEMA_VERSION = 1;

const HttpsUrlSchema = z
  .string()
  .regex(/^https:\/\//, 'URLs must use the HTTPS protocol.')
  .max(2048, 'URL exceeds maximum length.');

const HexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format. Expected CSS hex color (e.g., #1a5276).');

const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  source: z.enum(['verified', 'business_district', 'city_centroid', 'region_centroid']),
  confidence: z.enum(['high', 'medium', 'low']),
  approximate: z.boolean(),
});

const PersonnelSchema = z.object({
  name: z.string().min(1).max(128),
  title: z.string().min(1).max(128),
  phone: z.string().min(1).max(30),
  email: z.string().email('Invalid email format.').max(254),
  vcardUrl: HttpsUrlSchema.optional(),
});

const OfficeSchema = z.object({
  officeCode: z.string().min(1).max(32),
  city: z.string().min(1).max(128),
  state: z.string().min(1).max(128),
  officeType: z.enum(['Branch Office', 'Satellite Sales Office']),
  address: z.string().max(512).nullable().default(null),
  directionsUrl: HttpsUrlSchema.optional(),
  region: z.string().min(1).max(128),
  coordinates: CoordinatesSchema,
});

const DepartmentEmailsSchema = z.object({
  claims: z.string().email('Invalid email format.').max(254).optional(),
  lossRuns: z.string().email('Invalid email format.').max(254).optional(),
  accounting: z.string().email('Invalid email format.').max(254).optional(),
});

const GlobalContactsSchema = z.object({
  mainPhone: z.string().max(30).optional(),
  mainEmail: z.string().email('Invalid email format.').max(254).optional(),
  departmentEmails: DepartmentEmailsSchema.optional(),
  accountingContact: z
    .object({
      name: z.string().min(1).max(128),
      title: z.string().min(1).max(128),
      phone: z.string().min(1).max(30),
      email: z.string().email('Invalid email format.').max(254),
    })
    .optional(),
});

const CameraViewSchema = z.object({
  distance: z.number().positive(),
  lat: z.number(),
  lon: z.number(),
});

const MapProviderConfigSchema = z
  .object({
    provider: z.enum(['maplibre', 'apple']).default('maplibre'),
    tileStyleUrl: z.string().url().optional(),
    appleMapToken: z.string().optional(),
    defaultZoom: z.number().min(1).max(20).default(15),
  })
  .optional();

const BrandThemeSchema = z.object({
  primaryColor: HexColorSchema.optional(),
  accentColor: HexColorSchema.optional(),
  regionColors: z.record(z.string(), HexColorSchema).optional(),
  cameraViews: z.record(z.string(), CameraViewSchema).optional(),
  mapProvider: MapProviderConfigSchema,
});

const SpecialtyDivisionSchema = z.object({
  name: z.string().min(1),
  personnel: z.array(PersonnelSchema),
});

export const ClientConfigSchema = z
  .object({
    schemaVersion: z
      .number()
      .int()
      .min(1)
      .superRefine((val, ctx) => {
        if (val > MAX_SUPPORTED_SCHEMA_VERSION) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Configuration schema version ${val} is not supported. Maximum supported: ${MAX_SUPPORTED_SCHEMA_VERSION}.`,
          });
        }
      }),
    clientId: z
      .string()
      .regex(/^[a-z][a-z0-9]*$/, 'Invalid clientId: must be lowercase alphanumeric.'),
    name: z.string().min(1).max(256),
    copyrightHolder: z.string().min(1).max(256),
    tagline: z.string().max(500).optional(),
    offices: z.array(OfficeSchema).min(1),
    regionalPersonnel: z.record(z.string(), z.array(PersonnelSchema)).optional(),
    specialtyDivisions: z.array(SpecialtyDivisionSchema).optional(),
    globalContacts: GlobalContactsSchema.optional(),
    theme: BrandThemeSchema.optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .superRefine((data, ctx) => {
    const codes = new Set<string>();
    for (let i = 0; i < data.offices.length; i++) {
      const code = data.offices[i].officeCode;
      if (codes.has(code)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate office code: ${code}.`,
          path: ['offices', i, 'officeCode'],
        });
      }
      codes.add(code);
    }
  });

export type ValidatedClientConfig = z.infer<typeof ClientConfigSchema>;

/**
 * Format Zod validation errors into human-readable messages.
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
    return `${path}${issue.message}`;
  });
}
