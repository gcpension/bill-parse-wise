import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { configureSupabase, getSupabaseConfig, isSupabaseReady } from '@/lib/supabaseClient';
import { CheckCircle, Save, Trash2 } from 'lucide-react';

export const SupabaseSetup = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(() => getSupabaseConfig());

  useEffect(() => {
    setReady(isSupabaseReady());
  }, []);

  const handleSave = () => {
    if (!url || !anonKey) {
      toast({ title: 'חסר מידע', description: 'אנא הזן URL ו-Anon Key', variant: 'destructive' });
      return;
    }
    configureSupabase(url, anonKey);
    const cfg = getSupabaseConfig();
    setCurrent(cfg);
    setReady(true);
    toast({ title: 'חיבור נשמר ✅', description: 'Supabase מחובר בהצלחה' });
  };

  const handleClear = () => {
    try {
      localStorage.removeItem('SUPABASE_URL');
      localStorage.removeItem('SUPABASE_ANON_KEY');
    } catch {}
    setUrl('');
    setAnonKey('');
    setReady(false);
    setCurrent(getSupabaseConfig());
    toast({ title: 'החיבור הוסר', description: 'ניתן להזין פרטים מחדש' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3.5 20.29a1 1 0 00.9 1.41h15.2a1 1 0 00.9-1.41L12 2z" />
          </svg>
          חיבור Supabase ידני (אופציונלי)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {ready ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" /> מחובר
            </Badge>
          ) : (
            <Badge variant="outline">לא מחובר</Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <Input id="supabase-url" dir="ltr" placeholder="https://xxxxx.supabase.co" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-key">Supabase Anon Key</Label>
            <Input id="supabase-key" dir="ltr" type="password" placeholder="eyJhbGciOiJI..." value={anonKey} onChange={(e) => setAnonKey(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> שמור והתחבר
          </Button>
          <Button variant="destructive" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" /> נקה
          </Button>
        </div>

        {current?.isConfigured && (
          <div className="text-xs text-muted-foreground" dir="ltr">
            Using: {current.url?.slice(0, 32)}...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
