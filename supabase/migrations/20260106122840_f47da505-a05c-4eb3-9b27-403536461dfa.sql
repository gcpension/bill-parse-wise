-- Create reviews table for provider ratings
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('electricity', 'cellular', 'internet', 'tv')),
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  pros TEXT[],
  cons TEXT[],
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews (public feature)
CREATE POLICY "Reviews are publicly readable"
ON public.reviews
FOR SELECT
USING (true);

-- Only authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_reviews_provider ON public.reviews(provider_name);
CREATE INDEX idx_reviews_category ON public.reviews(category);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Add realtime for reviews
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- Insert some sample reviews
INSERT INTO public.reviews (provider_name, category, reviewer_name, rating, title, content, pros, cons, is_verified, helpful_count) VALUES
('סלקום', 'cellular', 'יוסי כהן', 5, 'שירות מעולה', 'עברתי לסלקום לפני חודשיים ואני מרוצה מאוד. קליטה טובה ושירות לקוחות מצוין.', ARRAY['קליטה מעולה', 'מחירים תחרותיים', 'שירות לקוחות זמין'], ARRAY['זמן המתנה ארוך לפעמים'], true, 23),
('פרטנר', 'cellular', 'מיכל לוי', 4, 'מומלץ בחום', 'חבילה משתלמת עם הרבה גיגה. הקליטה טובה ברוב האזורים.', ARRAY['מחיר טוב', 'הרבה דאטה'], ARRAY['קליטה בפריפריה בינונית'], true, 15),
('HOT', 'internet', 'דני אברהם', 4, 'אינטרנט מהיר', 'מהירות הורדה גבוהה ויציבות טובה. ההתקנה הייתה מהירה.', ARRAY['מהירות גבוהה', 'יציבות'], ARRAY['המחיר קצת גבוה'], true, 18),
('בזק', 'internet', 'רונית שמש', 3, 'סביר', 'השירות בסדר אבל היו כמה תקלות. התיקון היה מהיר.', ARRAY['טכנאים מקצועיים'], ARRAY['תקלות מדי פעם', 'מחיר גבוה'], false, 8),
('YES', 'tv', 'אלי גולן', 5, 'תכנים מעולים', 'מבחר ערוצים רחב ואיכות תמונה מצוינת. ממליץ!', ARRAY['מבחר תכנים', 'איכות HD', 'ממשק נוח'], ARRAY['מחיר פרימיום'], true, 31),
('חברת חשמל', 'electricity', 'שרה מזרחי', 4, 'אמין ויציב', 'שירות אמין. האפליקציה חדשה ונוחה לשימוש.', ARRAY['אמינות', 'אפליקציה נוחה'], ARRAY['אין הרבה אפשרויות'], false, 12);