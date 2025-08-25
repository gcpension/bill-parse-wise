import { useState, useEffect } from 'react';
import plansData from '@/data/all_plans_clean.json';

export interface PlanRecord {
  company: string;
  service: string;
  plan: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  transferBenefits: string | null;
  commitment: string | null;
  sla: string | null;
}

// Transform JSON data to our interface
const transformPlansData = (data: any[]): PlanRecord[] => {
  return data.map(item => ({
    company: item["שם_החברה"],
    service: item["סוג_השירות"],
    plan: item["שם_המסלול"],
    monthlyPrice: item["מחיר_חודשי_(₪)"],
    yearlyPrice: item["מחיר_שנתי_(₪)"],
    transferBenefits: item["הטבות_מעבר"],
    commitment: item["זמן_התחייבות"],
    sla: item["SLA___ציון_שירות"]
  }));
};

// Hook to provide all available plans
export const useAllPlans = (): PlanRecord[] => {
  const [plans, setPlans] = useState<PlanRecord[]>([]);

  useEffect(() => {
    // Transform and load plans from JSON
    const transformedPlans = transformPlansData(plansData);
    setPlans(transformedPlans);
  }, []);

  return plans;
};

// Utility function to return all plans
export const getAllPlans = (): PlanRecord[] => {
  return transformPlansData(plansData);
};

// Filter plans by service type (e.g., 'cellular', 'internet', 'tv', etc.)
export const getPlansByService = (service: string): PlanRecord[] => {
  const allPlans = transformPlansData(plansData);
  return allPlans.filter(plan => plan.service === service);
};

// Filter plans by company name
export const getPlansByCompany = (company: string): PlanRecord[] => {
  const allPlans = transformPlansData(plansData);
  return allPlans.filter(plan => plan.company === company);
};
