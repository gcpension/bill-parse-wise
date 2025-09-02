import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { handleError } from '@/lib/errorHandler';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log 404 errors for analytics without showing to user
    if (process.env.NODE_ENV === 'development') {
      console.warn("404 Error: Route not found:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50 p-6 flex items-center justify-center">
      <Card className="max-w-lg w-full text-center animate-fade-in bg-white/80 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader>
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-6xl font-black text-primary mb-6">
            404
          </CardTitle>
          <h2 className="text-3xl font-bold text-foreground">
            העמוד לא נמצא
          </h2>
        </CardHeader>
        <CardContent className="space-y-8">
          <p className="text-muted-foreground text-xl leading-relaxed">
            הדף שחיפשת לא קיים או הועבר למקום אחר
          </p>
          
          <div className="space-y-6">
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-sm font-semibold text-primary mb-3">
                💡 אולי תרצה לנסות:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-right">
                <li>• לבדוק את כתובת האתר</li>
                <li>• להשתמש בתפריט הניווט</li>
                <li>• לחזור לעמוד הבית</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300">
                <Home className="h-5 w-5 ml-2" />
                עמוד הבית
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-white/50 border-border/50 px-8 py-3 rounded-2xl font-semibold hover:bg-white/80 transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 ml-2" />
              חזור אחורה
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground pt-6 border-t border-border/50">
            אם הבעיה נמשכת, אנא צור קשר עם התמיכה הטכנית
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;