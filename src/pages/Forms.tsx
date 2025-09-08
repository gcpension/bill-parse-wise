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
      <div className="min-h-screen bg-gradient-to-br from-primary/8 via-background to-accent/12 animate-fade-in" dir="rtl">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-32 w-40 h-40 gradient-primary rounded-full blur-3xl opacity-15 animate-float" />
          <div className="absolute bottom-40 right-20 w-32 h-32 gradient-electric rounded-full blur-2xl opacity-20 animate-pulse" />
        </div>

        <Navigation />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center shadow-elegant border-2 border-primary/20 bg-gradient-to-br from-card to-accent/20">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">❌</span>
              </div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                קטגוריה לא נמצאה
              </h1>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                הקטגוריה שבחרתם אינה קיימת במערכת. נא לבחור קטגוריה אחרת מהעמוד הראשי
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="w-full btn-gradient hover-scale"
              >
                חזרה לעמוד הבית
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const serviceConfig = serviceCategories[category as keyof typeof serviceCategories];
  const IconComponent = serviceConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/8 via-background to-accent/12 animate-fade-in" dir="rtl">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-56 h-56 gradient-primary rounded-full blur-3xl opacity-10 animate-float" />
        <div className="absolute top-60 right-32 w-32 h-32 gradient-electric rounded-full blur-2xl opacity-20 animate-bounce-gentle" />
        <div className="absolute bottom-32 left-1/2 w-48 h-48 gradient-sunset rounded-full blur-3xl opacity-15 animate-pulse" />
        <div className="absolute bottom-60 right-20 w-24 h-24 gradient-vibrant rounded-full blur-xl opacity-25 animate-spin-slow" />
      </div>

      <Navigation />
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-8">
          <div className="relative inline-block">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-bounce-gentle">
                  <IconComponent className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -inset-2 gradient-primary opacity-30 blur-xl rounded-2xl -z-10" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-electric-blue bg-clip-text text-transparent animate-shimmer-text bg-300%">
                מעבר ספק {serviceConfig.name}
              </h1>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            בחרו את סוג הלקוח שלכם ומלאו את הטופס הרלוונטי לביצוע המעבר המהיר והחכם ביותר
          </p>

          <div className="flex items-center justify-center gap-6 text-sm bg-gradient-to-r from-accent/50 to-primary/10 p-4 rounded-xl border border-primary/20 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>תהליך מהיר</span>
            </div>
            <div className="w-1 h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>ליווי מקצועי</span>
            </div>
            <div className="w-1 h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
              <span>חסכון מובטח</span>
            </div>
          </div>
        </div>

        {!selectedCustomerType ? (
          <>
            {/* Enhanced Customer Type Selection */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  איזה סוג לקוח אתם?
                </h2>
                <p className="text-muted-foreground text-lg">
                  בחרו את הסוג המתאים לקבלת הטופס המותאם במיוחד עבורכם
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {customerTypes.map((type, index) => (
                  <Card 
                    key={type.id}
                    className="p-8 cursor-pointer transition-all duration-500 hover:shadow-elegant hover:scale-[1.02] animate-fade-in group border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-card to-accent/20 relative overflow-hidden"
                    style={{animationDelay: `${index * 0.2}s`}}
                    onClick={() => setSelectedCustomerType(type.id)}
                  >
                    {/* Card Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="text-center relative z-10">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto group-hover:shadow-glow transition-all duration-500 animate-bounce-gentle">
                          <type.icon className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute -inset-4 gradient-primary opacity-20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                        {type.name}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        {type.description}
                      </p>
                      
                      <Button className="w-full btn-gradient group-hover:shadow-glow transition-all duration-300 text-lg py-3">
                        בחר ומלא טופס
                        <ArrowRight className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enhanced Process Info */}
            <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-primary/5 via-accent/30 to-primary/10 border-2 border-primary/20 shadow-colorful">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    מה יקרה אחרי מילוי הטופס?
                  </span>
                </h3>
                <p className="text-muted-foreground text-lg">
                  תהליך המעבר מתבצע בשלושה שלבים פשוטים ומהירים
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "בדיקת נתונים",
                    description: "נבדוק את הנתונים ונאמת את הזהות תוך 24 שעות",
                    icon: "🔍",
                    color: "primary"
                  },
                  {
                    step: "2", 
                    title: "הגשת בקשה",
                    description: "נגיש את הבקשה לספק החדש ונתחיל את התהליך",
                    icon: "📋",
                    color: "success"
                  },
                  {
                    step: "3",
                    title: "ביצוע המעבר", 
                    description: "המעבר יבוצע תוך 7-30 ימי עבודה עם ליווי מלא",
                    icon: "✅",
                    color: "electric-blue"
                  }
                ].map((item, index) => (
                  <div 
                    key={item.step}
                    className="text-center p-6 glass rounded-2xl border border-white/20 hover-scale animate-slide-up relative"
                    style={{animationDelay: `${index * 0.15}s`}}
                  >
                    <div className={`w-16 h-16 gradient-${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elegant`}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        שלב {item.step}
                      </Badge>
                    </div>
                    <div className="font-semibold text-lg mb-3">{item.title}</div>
                    <div className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                ))}
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