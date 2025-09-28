import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, X, MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpOptions = [
    {
      title: "צ'אט ישיר",
      description: "קבלו עזרה מיידית מהמומחים שלנו",
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => console.log("Open chat"),
      available: true
    },
    {
      title: "שיחת טלפון",
      description: "02-123-4567",
      icon: <Phone className="w-5 h-5" />,
      action: () => window.open("tel:02-123-4567"),
      available: true
    },
    {
      title: "אימייל",
      description: "help@easyswitch.co.il",
      icon: <Mail className="w-5 h-5" />,
      action: () => window.open("mailto:help@easyswitch.co.il"),
      available: true
    }
  ];

  return (
    <>
      {/* Help Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[90] animate-fade-in">
          <Card className="w-80 shadow-2xl border-2 border-blue-200/50 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heebo text-blue-800 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  איך נוכל לעזור?
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {helpOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full h-auto p-3 flex items-start gap-3 hover:bg-blue-50 text-right justify-start"
                  onClick={option.action}
                >
                  <div className="flex-shrink-0 text-blue-600">
                    {option.icon}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-medium text-gray-800 font-heebo">
                      {option.title}
                    </div>
                    <div className="text-sm text-gray-600 font-assistant">
                      {option.description}
                    </div>
                  </div>
                  {option.available && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      זמין
                    </Badge>
                  )}
                </Button>
              ))}
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-assistant">
                  <Clock className="w-4 h-4" />
                  <span>זמינים א׳-ה׳ 9:00-18:00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Help Button */}
      <Button
        className={cn(
          "fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl transition-all duration-300",
          "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
          "border-2 border-white/20 hover:scale-110",
          isOpen && "scale-110 shadow-3xl"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </Button>
    </>
  );
};