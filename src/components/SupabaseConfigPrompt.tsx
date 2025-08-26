import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { configureSupabase, isSupabaseReady } from '@/lib/supabaseClient';

export const SupabaseConfigPrompt = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>(() => localStorage.getItem('SUPABASE_URL') || '');
  const [anonKey, setAnonKey] = useState<string>(() => localStorage.getItem('SUPABASE_ANON_KEY') || '');

  if (isSupabaseReady()) return null;

  const onSave = () => {
    if (!url || !anonKey) {
      toast({
        title: 'חסר מידע',
        description: 'נא להזין גם URL וגם Anon Key של Supabase',
        variant: 'destructive',
      });
      return;
    }

    configureSupabase(url.trim(), anonKey.trim());
    toast({
      title: 'התחברות הוגדרה',
      description: 'Supabase מחובר. אפשר לנסות שוב את הפעולה.',
    });
  };

  return (
    <section className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>חיבור Supabase</CardTitle>
          <CardDescription>
            הדביקו כאן את ה-URL וה-API Key (Anon) של הפרויקט. המפתחות הללו ציבוריים לשימוש בצד לקוח.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="supabase-url" className="text-sm font-medium">Supabase URL</label>
            <Input id="supabase-url" placeholder="https://xxxx.supabase.co" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="supabase-anon" className="text-sm font-medium">Supabase Anon Key</label>
            <Input id="supabase-anon" placeholder="הדביקו את ה-Anon Key" value={anonKey} onChange={(e) => setAnonKey(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSave}>שמור והתחבר</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SupabaseConfigPrompt;
