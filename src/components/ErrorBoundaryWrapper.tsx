import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-red-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800 mb-2">
            אופס! משהו השתבש
          </CardTitle>
          <p className="text-red-600">
            {error?.message || 'אירעה שגיאה בלתי צפויה'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">מה קרה?</h4>
            <p className="text-sm text-red-700">
              הפונקציה נתקלה בבעיה טכנית. אנחנו עובדים על פתרון.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={resetError}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4" />
              נסה שוב
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Home className="w-4 h-4" />
              חזור לעמוד הראשי
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                פרטים טכניים (למפתחים)
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded border overflow-auto text-red-800">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { ErrorBoundary, DefaultErrorFallback };