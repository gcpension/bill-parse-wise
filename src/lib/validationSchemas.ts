import { z } from 'zod';

// Israeli ID validation
const israeliIdSchema = z.string()
  .min(8, 'תעודת זהות חייבת להיות לפחות 8 תווים')
  .max(9, 'תעודת זהות לא יכולה להיות יותר מ-9 תווים')
  .regex(/^\d+$/, 'תעודת זהות חייבת להכיל רק ספרות');

// Israeli company ID validation
const companyIdSchema = z.string()
  .min(8, 'מספר חברה חייב להיות לפחות 8 תווים')
  .max(9, 'מספר חברה לא יכול להיות יותר מ-9 תווים')
  .regex(/^\d+$/, 'מספר חברה חייב להכיל רק ספרות');

// Israeli phone validation
const israeliPhoneSchema = z.string()
  .min(9, 'מספר טלפון לא תקין')
  .max(11, 'מספר טלפון לא תקין')
  .regex(/^0(5[0-9]|[2-4]|7[0-9]|8|9)[0-9]{7,8}$/, 'מספר טלפון ישראלי לא תקין');

// Email validation
const emailSchema = z.string()
  .email('כתובת אימייל לא תקינה')
  .max(255, 'כתובת אימייל ארוכה מדי');

// Address validation
const addressSchema = z.object({
  street: z.string().min(1, 'שם רחוב נדרש').max(100, 'שם רחוב ארוך מדי'),
  number: z.string().min(1, 'מספר בית נדרש').max(10, 'מספר בית ארוך מדי'),
  city: z.string().min(1, 'עיר נדרשת').max(100, 'שם עיר ארוך מדי'),
  zip: z.string().max(10, 'מיקוד ארוך מדי').optional(),
});

// Service request validation
export const serviceRequestSchema = z.object({
  full_name: z.string().min(2, 'שם מלא נדרש').max(100, 'שם ארוך מדי'),
  national_id_or_corp: israeliIdSchema.or(companyIdSchema),
  email: emailSchema,
  phone: israeliPhoneSchema,
  service_address: addressSchema,
  action_type: z.enum(['switch', 'new', 'cancel', 'change_plan']),
  sector: z.enum(['electricity', 'cellular', 'internet', 'tv', 'internet_isp', 'internet_infra']),
  customer_type: z.enum(['private', 'business']),
  current_provider: z.string().max(100).optional(),
  target_provider: z.string().max(100).optional(),
  company_name: z.string().max(200).optional(),
  corp_registration_number: companyIdSchema.optional(),
  poa: z.boolean().optional(),
  privacy_tos: z.boolean().optional(),
  fees_ack: z.boolean().optional(),
}).refine(
  (data) => data.action_type !== 'switch' || data.target_provider,
  { message: 'ספק יעד נדרש למעבר', path: ['target_provider'] }
);

// Chat message validation
export const chatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1, 'הודעה ריקה').max(5000, 'הודעה ארוכה מדי'),
    })
  ).min(1).max(100),
  availablePlans: z.array(z.any()).optional(),
});

// Switch request validation
export const switchRequestSchema = z.object({
  personalDetails: z.object({
    firstName: z.string().min(1, 'שם פרטי נדרש').max(50, 'שם פרטי ארוך מדי'),
    lastName: z.string().min(1, 'שם משפחה נדרש').max(50, 'שם משפחה ארוך מדי'),
    idNumber: israeliIdSchema,
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'תאריך לא תקין'),
    address: addressSchema,
    phone: israeliPhoneSchema,
    email: emailSchema,
  }),
  currentService: z.object({
    providerName: z.string().min(1).max(100),
    customerNumber: z.string().max(50),
    serviceType: z.string().max(50),
    currentPlan: z.string().max(100),
    contractCommitment: z.string().max(50).optional(),
    commitmentEndDate: z.string().optional(),
  }),
  newService: z.object({
    newProvider: z.string().min(1).max(100),
    newPlan: z.string().min(1).max(100),
    switchDate: z.enum(['immediate', 'end_of_billing', 'end_of_commitment', 'custom']),
    customSwitchDate: z.string().optional(),
  }),
  payment: z.object({
    paymentMethod: z.string().max(50),
    creditCardLast4: z.string().max(4).optional(),
    bankAccount: z.string().max(50).optional(),
    isOwner: z.boolean(),
  }),
  consent: z.object({
    dataProcessingConsent: z.literal(true),
    powerOfAttorneyConsent: z.literal(true),
    termsAndConditionsConsent: z.literal(true),
    exitFeesAwareness: z.literal(true),
    gdprConsent: z.literal(true),
    finalConfirmation: z.literal(true),
  }),
  signature: z.object({
    signature: z.string().min(1),
    timestamp: z.string(),
    powerOfAttorneyAgreed: z.literal(true),
  }),
});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type SwitchRequest = z.infer<typeof switchRequestSchema>;
