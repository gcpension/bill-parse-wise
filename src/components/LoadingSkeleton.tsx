import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingSkeletonProps {
  type?: 'form' | 'results' | 'plans';
  count?: number;
}

export const LoadingSkeleton = ({ type = 'form', count = 3 }: LoadingSkeletonProps) => {
  if (type === 'form') {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mx-auto" />
            <div className="flex justify-center gap-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-2 h-1 rounded-full" />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === 'results') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Skeleton className="h-7 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl border">
                  <Skeleton className="h-5 w-5 mx-auto mb-2" />
                  <Skeleton className="h-4 w-16 mx-auto mb-1" />
                  <Skeleton className="h-6 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-2">
                <div className="text-center space-y-2">
                  <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'plans') {
    return (
      <div className="space-y-4">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-md" />
          ))}
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20 rounded-full" />
                      <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-center p-4 rounded-xl">
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-11 w-24 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};