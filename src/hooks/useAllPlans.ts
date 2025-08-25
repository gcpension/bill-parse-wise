import { useState, useEffect } from 'react';
import { allPlans, PlanRecord } from '@/data/all-plans';

// Hook to provide all available plans
export const useAllPlans = (): PlanRecord[] => {
  const [plans, setPlans] = useState<PlanRecord[]>([]);

  useEffect(() => {
    // Load plans on mount
    setPlans(allPlans);
  }, []);

  return plans;
};

// Utility function to return all plans
export const getAllPlans = (): PlanRecord[] => {
  return allPlans;
};

// Filter plans by service type (e.g., 'cellular', 'internet', 'tv', etc.)
export const getPlansByService = (service: string): PlanRecord[] => {
  return allPlans.filter(plan => plan.service === service);
};

// Filter plans by company name
export const getPlansByCompany = (company: string): PlanRecord[] => {
  return allPlans.filter(plan => plan.company === company);
};
