import { useAllPlans } from "@/hooks/useAllPlans";

const AllPlans = () => {
  const plans = useAllPlans();

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <p className="text-muted-foreground">סה"כ נמצאו {plans.length} מסלולים</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-medium">חברה</th>
              <th className="px-4 py-2 text-left font-medium">סוג שירות</th>
              <th className="px-4 py-2 text-left font-medium">שם המסלול</th>
              <th className="px-4 py-2 text-left font-medium">מחיר חודשי (\u20aa)</th>
              <th className="px-4 py-2 text-left font-medium">מחיר שנתי (\u20aa)</th>
              <th className="px-4 py-2 text-left font-medium">הטבות</th>
              <th className="px-4 py-2 text-left font-medium">תקופת התחייבות</th>
              <th className="px-4 py-2 text-left font-medium">SLA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((plan, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{plan.company}</td>
                <td className="px-4 py-2">{plan.service}</td>
                <td className="px-4 py-2">{plan.plan}</td>
                <td className="px-4 py-2">{plan.monthlyPrice !== null ? `₪${plan.monthlyPrice}` : "בהתאם לפנייה"}</td>
                <td className="px-4 py-2">{plan.yearlyPrice !== null ? `₪${plan.yearlyPrice}` : "בהתאם לפנייה"}</td>
                <td className="px-4 py-2">{plan.transferBenefits ?? "-"}</td>
                <td className="px-4 py-2">{plan.commitment ?? "-"}</td>
                <td className="px-4 py-2">{plan.sla ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPlans;
