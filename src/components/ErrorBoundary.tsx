import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 flex items-center justify-center">
          <Card className="max-w-lg w-full animate-fade-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-destructive animate-pulse" />
              </div>
              <CardTitle className="text-2xl text-destructive">
                אופס! משהו השתבש
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  {this.props.fallbackMessage || 'אירעה שגיאה לא צפויה במערכת'}
                </p>
                <p className="text-sm text-muted-foreground">
                  אנחנו כבר עובדים על פתרון הבעיה
                </p>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 bg-muted rounded-lg text-left">
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={this.handleReload}
                  variant="default"
                  className="hover-scale"
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  נסה שוב
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="hover-scale"
                >
                  <Home className="h-4 w-4 ml-2" />
                  חזור לעמוד הבית
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}