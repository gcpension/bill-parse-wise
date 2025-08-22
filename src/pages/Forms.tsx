import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { ServiceForm } from "@/components/ServiceForm";
import { 
  Smartphone, 
  Tv, 
  Wifi, 
  Zap, 
  User, 
  Building,
  ArrowRight
} from "lucide-react";

const serviceCategories = {
  cellular: { name: 'סלולר', icon: Smartphone },
  tv: { name: 'טלוויזיה', icon: Tv },
  internet: { name: 'אינטרנט', icon: Wifi },
  electricity: { name: 'חשמל', icon: Zap }
};

const customerTypes = [
  {
    id: 'private',
    name: 'לקוח פרטי',
    description: 'עבור אנשים פרטיים',
    icon: User
  },
  {
    id: 'business',
    name: 'לקוח עסקי',
    description: 'עבור חברות ועסקים',
    icon: Building
  }
];

export const Forms = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedCustomerType, setSelectedCustomerType] = useState<string | null>(null);

  if (!category || !serviceCategories[category as keyof typeof serviceCategories]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5" dir="rtl">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">קטגוריה לא נמצאה</h1>
            <p className="text-muted-foreground mb-6">הקטגוריה שבחרתם אינה קיימת במערכת</p>
            <Button onClick={() => navigate('/')}>חזרה לעמוד הבית</Button>
          </Card>
        </div>
      </div>
    );
  }

  const serviceConfig = serviceCategories[category as keyof typeof serviceCategories];
  const IconComponent = serviceConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5" dir="rtl">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconComponent className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              מעבר ספק {serviceConfig.name}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            בחרו את סוג הלקוח שלכם ומלאו את הטופס הרלוונטי לביצוע המעבר
          </p>
        </div>

        {!selectedCustomerType ? (
          <>
            {/* Customer Type Selection */}
            <div className="max-w-4xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-center mb-6">איזה סוג לקוח אתם?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerTypes.map((type, index) => (
                  <Card 
                    key={type.id}
                    className="p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 animate-fade-in group"
                    style={{animationDelay: `${index * 0.1}s`}}
                    onClick={() => setSelectedCustomerType(type.id)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                        <type.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        בחר ומלא טופס
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Process Info */}
            <Card className="max-w-4xl mx-auto p-6 bg-primary/5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-primary" />
                מה יקרה אחרי מילוי הטופס?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <div className="font-medium">בדיקת נתונים</div>
                    <div className="text-muted-foreground">נבדוק את הנתונים ונאמת את הזהות</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <div className="font-medium">הגשת בקשה</div>
                    <div className="text-muted-foreground">נגיש את הבקשה לספק החדש</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <div className="font-medium">ביצוע המעבר</div>
                    <div className="text-muted-foreground">המעבר יבוצע תוך 7-30 ימי עבודה</div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <ServiceForm 
            category={category} 
            customerType={selectedCustomerType}
            onBack={() => setSelectedCustomerType(null)}
          />
        )}
      </main>
    </div>
  );
};