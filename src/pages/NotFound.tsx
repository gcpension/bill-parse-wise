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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 flex items-center justify-center">
      <Card className="max-w-lg w-full text-center animate-fade-in">
        <CardHeader>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-6xl font-bold text-primary mb-4">
            404
          </CardTitle>
          <h2 className="text-2xl font-semibold text-foreground">
            העמוד לא נמצא
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-lg">
            הדף שחיפשת לא קיים או הועבר למקום אחר
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 אולי תרצה לנסות:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• לבדוק את כתובת האתר</li>
                <li>• להשתמש בתפריט הניווט</li>
                <li>• לחזור לעמוד הבית</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto hover-scale">
                <Home className="h-4 w-4 ml-2" />
                עמוד הבית
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto hover-scale"
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              חזור אחורה
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground pt-4 border-t border-border">
            אם הבעיה נמשכת, אנא צור קשר עם התמיכה הטכנית
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;