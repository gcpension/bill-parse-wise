import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, BadgeCheck, Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { enhancedToast } from '@/components/EnhancedToast';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  provider_name: string;
  category: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  content: string;
  pros: string[] | null;
  cons: string[] | null;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
}

interface ProviderReviewsProps {
  providerName: string;
  category: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

export const ProviderReviews = ({ providerName, category, reviews, onReviewAdded }: ProviderReviewsProps) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    reviewer_name: '',
    rating: 5,
    title: '',
    content: '',
    pros: '',
    cons: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!newReview.reviewer_name || !newReview.content) {
      enhancedToast.error({ title: 'נא למלא את כל השדות הנדרשים' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        provider_name: providerName,
        category,
        reviewer_name: newReview.reviewer_name,
        rating: newReview.rating,
        title: newReview.title || null,
        content: newReview.content,
        pros: newReview.pros ? newReview.pros.split(',').map(s => s.trim()) : null,
        cons: newReview.cons ? newReview.cons.split(',').map(s => s.trim()) : null
      });

      if (error) throw error;

      enhancedToast.success({ title: 'הביקורת נשלחה בהצלחה!' });
      setShowAddReview(false);
      setNewReview({ reviewer_name: '', rating: 5, title: '', content: '', pros: '', cons: '' });
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
      enhancedToast.error({ title: 'שגיאה בשליחת הביקורת' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string, currentCount: number) => {
    try {
      await supabase
        .from('reviews')
        .update({ helpful_count: currentCount + 1 })
        .eq('id', reviewId);
      onReviewAdded();
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Review Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">ביקורות לקוחות</h2>
          <p className="text-muted-foreground">{reviews.length} ביקורות על {providerName}</p>
        </div>
        
        <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
          <DialogTrigger asChild>
            <Button className="touch-button">
              <Plus className="ml-2 h-4 w-4" />
              הוסף ביקורת
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>כתוב ביקורת על {providerName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">שם *</Label>
                <Input
                  id="name"
                  value={newReview.reviewer_name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewer_name: e.target.value }))}
                  placeholder="השם שלך"
                />
              </div>

              <div>
                <Label>דירוג *</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className="p-1 touch-button"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          star <= newReview.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300 hover:text-yellow-400"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="title">כותרת</Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="כותרת קצרה לביקורת"
                />
              </div>

              <div>
                <Label htmlFor="content">תוכן הביקורת *</Label>
                <Textarea
                  id="content"
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="ספר על החוויה שלך..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="pros">יתרונות (מופרדים בפסיקים)</Label>
                <Input
                  id="pros"
                  value={newReview.pros}
                  onChange={(e) => setNewReview(prev => ({ ...prev, pros: e.target.value }))}
                  placeholder="מחיר טוב, שירות מהיר"
                />
              </div>

              <div>
                <Label htmlFor="cons">חסרונות (מופרדים בפסיקים)</Label>
                <Input
                  id="cons"
                  value={newReview.cons}
                  onChange={(e) => setNewReview(prev => ({ ...prev, cons: e.target.value }))}
                  placeholder="זמן המתנה, קליטה"
                />
              </div>

              <Button 
                onClick={handleSubmitReview} 
                className="w-full"
                disabled={submitting}
              >
                <Send className="ml-2 h-4 w-4" />
                {submitting ? 'שולח...' : 'שלח ביקורת'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      <AnimatePresence>
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">אין עדיין ביקורות</h3>
              <p className="text-muted-foreground mb-4">היה הראשון לכתוב ביקורת על {providerName}</p>
              <Button onClick={() => setShowAddReview(true)}>
                <Plus className="ml-2 h-4 w-4" />
                כתוב ביקורת
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {review.reviewer_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.reviewer_name}</span>
                            {review.is_verified && (
                              <Badge variant="secondary" className="text-xs">
                                <BadgeCheck className="h-3 w-3 ml-1" />
                                מאומת
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-5 w-5",
                              star <= review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Title & Content */}
                    {review.title && (
                      <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                    )}
                    <p className="text-muted-foreground mb-4">{review.content}</p>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {review.pros && review.pros.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-success">יתרונות:</span>
                          <ul className="mt-1 space-y-1">
                            {review.pros.map((pro, i) => (
                              <li key={i} className="text-sm flex items-center gap-1">
                                <span className="text-success">+</span> {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.cons && review.cons.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-destructive">חסרונות:</span>
                          <ul className="mt-1 space-y-1">
                            {review.cons.map((con, i) => (
                              <li key={i} className="text-sm flex items-center gap-1">
                                <span className="text-destructive">-</span> {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Helpful Button */}
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id, review.helpful_count)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ThumbsUp className="h-4 w-4 ml-1" />
                        מועיל ({review.helpful_count})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
