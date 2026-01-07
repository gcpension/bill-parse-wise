import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlanCardSkeletonProps {
  viewMode?: 'grid' | 'list' | 'carousel';
  count?: number;
}

const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={cn("relative overflow-hidden bg-muted rounded", className)}>
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
      animate={{ translateX: ['100%', '-100%'] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
    />
  </div>
);

const GridCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-4 space-y-4">
      {/* Header with logo */}
      <div className="flex items-center gap-3">
        <ShimmerEffect className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <ShimmerEffect className="h-4 w-24" />
          <ShimmerEffect className="h-3 w-32" />
        </div>
        <ShimmerEffect className="h-6 w-16 rounded-full" />
      </div>
      
      {/* Plan name */}
      <ShimmerEffect className="h-5 w-3/4" />
      
      {/* Features */}
      <div className="space-y-2">
        <ShimmerEffect className="h-3 w-full" />
        <ShimmerEffect className="h-3 w-5/6" />
        <ShimmerEffect className="h-3 w-4/6" />
      </div>
      
      {/* Price and CTA */}
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-1">
          <ShimmerEffect className="h-7 w-20" />
          <ShimmerEffect className="h-3 w-14" />
        </div>
        <ShimmerEffect className="h-10 w-24 rounded-xl" />
      </div>
    </CardContent>
  </Card>
);

const ListCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <ShimmerEffect className="w-14 h-14 rounded-xl flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <ShimmerEffect className="h-5 w-20 rounded-full" />
            <ShimmerEffect className="h-4 w-32" />
          </div>
          <ShimmerEffect className="h-4 w-48" />
          <div className="flex gap-2">
            <ShimmerEffect className="h-6 w-16 rounded-full" />
            <ShimmerEffect className="h-6 w-20 rounded-full" />
          </div>
        </div>
        
        {/* Price section */}
        <div className="flex-shrink-0 text-left space-y-2">
          <ShimmerEffect className="h-7 w-20" />
          <ShimmerEffect className="h-3 w-14" />
        </div>
        
        {/* CTA */}
        <ShimmerEffect className="h-10 w-24 rounded-xl flex-shrink-0" />
      </div>
    </CardContent>
  </Card>
);

const CarouselCardSkeleton = () => (
  <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center space-y-3">
          <ShimmerEffect className="w-16 h-16 rounded-2xl mx-auto" />
          <ShimmerEffect className="h-5 w-24 mx-auto" />
          <ShimmerEffect className="h-4 w-32 mx-auto" />
        </div>
        
        {/* Price */}
        <div className="text-center py-4">
          <ShimmerEffect className="h-10 w-28 mx-auto" />
          <ShimmerEffect className="h-3 w-16 mx-auto mt-2" />
        </div>
        
        {/* Features */}
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <ShimmerEffect key={i} className="h-4 w-full" />
          ))}
        </div>
        
        {/* CTA */}
        <ShimmerEffect className="h-12 w-full rounded-xl" />
      </CardContent>
    </Card>
  </div>
);

const CompanyGroupSkeleton = () => (
  <div className="space-y-4">
    {/* Company Header */}
    <div className="flex items-center gap-4 pb-3 border-b border-border">
      <ShimmerEffect className="w-14 h-14 rounded-xl" />
      <div className="flex-1 space-y-2">
        <ShimmerEffect className="h-6 w-32" />
        <ShimmerEffect className="h-4 w-24" />
      </div>
    </div>
    
    {/* Plans grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <GridCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const PlanCardSkeleton: React.FC<PlanCardSkeletonProps> = ({ 
  viewMode = 'grid', 
  count = 3 
}) => {
  if (viewMode === 'carousel') {
    return (
      <div className="flex justify-center gap-4 overflow-hidden py-8">
        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <CarouselCardSkeleton />
          </motion.div>
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <ListCardSkeleton />
          </motion.div>
        ))}
      </div>
    );
  }

  // Grid view with company groups
  return (
    <div className="space-y-8">
      {Array.from({ length: Math.ceil(count / 3) }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <CompanyGroupSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

export default PlanCardSkeleton;
