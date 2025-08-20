import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  CreditCard,
  AlertTriangle,
  Check,
  Settings as SettingsIcon,
  HelpCircle,
  ExternalLink,
  Star,
  MessageSquare
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const Settings = () => {
  const [savedAmount] = useState(8750);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
          הגדרות
        </h1>
        <p className="text-muted-foreground text-lg">
          נהל את הפרופיל שלך והתאם את המערכת לצרכים שלך
        </p>
      </div>

      <Card className="shadow-card bg-gradient-to-br from-success/10 to-success/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">החיסכון שלך עד כה</h3>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(savedAmount)}
              </p>
              <p className="text-sm text-muted-foreground">
                חסכת השנה בזכות חסכונט
              </p>
            </div>
            <div className="p-4 bg-success/20 rounded-full">
              <Star className="h-8 w-8 text-success fill-current" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>פרטים אישיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>שם מלא</Label>
              <Input defaultValue="משה כהן" />
            </div>
            <div className="space-y-2">
              <Label>אימייל</Label>
              <Input defaultValue="moshe@example.com" />
            </div>
            <Button>שמור שינויים</Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>התראות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>התראות אימייל</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>מבצעים חדשים</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>דוחות חודשיים</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import { 
  Save, 
  Trash2, 
  Download, 
  Upload, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  HelpCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EXPENSE_CATEGORIES } from '@/lib/categories';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    monthlyReport: boolean;
    savingsAlerts: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  preferences: {
    currency: string;
    language: string;
    theme: string;
    monthlyBudget: number;
  };
  categories: {
    enabled: string[];
    customKeywords: Record<string, string[]>;
  };
}

export const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: false,
      monthlyReport: true,
      savingsAlerts: true,
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      marketing: false,
    },
    preferences: {
      currency: 'ILS',
      language: 'he',
      theme: 'system',
      monthlyBudget: 2000,
    },
    categories: {
      enabled: EXPENSE_CATEGORIES.map(cat => cat.id),
      customKeywords: {},
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [customKeyword, setCustomKeyword] = useState('');
  const [selectedCategoryForKeyword, setSelectedCategoryForKeyword] = useState('');
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    toast({
      title: 'ההגדרות נשמרו',
      description: 'כל ההגדרות עודכנו בהצלחה',
    });
  };

  const handleExportData = () => {
    // Simulate data export
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cost-optimizer-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'הנתונים יוצאו',
      description: 'קובץ ההגדרות הורד למחשב שלך',
    });
  };

  const handleDeleteData = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו לא ניתנת לביטול.')) {
      toast({
        title: 'הנתונים נמחקו',
        description: 'כל הנתונים האישיים נמחקו מהמערכת',
        variant: 'destructive',
      });
    }
  };

  const addCustomKeyword = () => {
    if (!customKeyword.trim() || !selectedCategoryForKeyword) return;
    
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        customKeywords: {
          ...prev.categories.customKeywords,
          [selectedCategoryForKeyword]: [
            ...(prev.categories.customKeywords[selectedCategoryForKeyword] || []),
            customKeyword.trim()
          ]
        }
      }
    }));
    
    setCustomKeyword('');
    toast({
      title: 'מילת מפתח נוספה',
      description: `המילה "${customKeyword}" נוספה לקטגוריית ${EXPENSE_CATEGORIES.find(c => c.id === selectedCategoryForKeyword)?.nameHebrew}`,
    });
  };

  const removeCustomKeyword = (categoryId: string, keyword: string) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        customKeywords: {
          ...prev.categories.customKeywords,
          [categoryId]: prev.categories.customKeywords[categoryId]?.filter(k => k !== keyword) || []
        }
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">הגדרות</h1>
        <p className="text-muted-foreground">
          נהל את ההעדפות והפרטיות שלך
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">כללי</TabsTrigger>
          <TabsTrigger value="notifications">התראות</TabsTrigger>
          <TabsTrigger value="categories">קטגוריות</TabsTrigger>
          <TabsTrigger value="privacy">פרטיות</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Globe className="h-5 w-5" />
                <span>הגדרות כלליות</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">מטבע</Label>
                  <Select 
                    value={settings.preferences.currency} 
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, currency: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ILS">שקל ישראלי (₪)</SelectItem>
                      <SelectItem value="USD">דולר אמריקאי ($)</SelectItem>
                      <SelectItem value="EUR">יורו (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">שפה</Label>
                  <Select 
                    value={settings.preferences.language}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, language: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he">עברית</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">מראה</Label>
                  <Select 
                    value={settings.preferences.theme}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">לפי המערכת</SelectItem>
                      <SelectItem value="light">בהיר</SelectItem>
                      <SelectItem value="dark">כהה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">תקציב חודשי (₪)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={settings.preferences.monthlyBudget}
                    onChange={(e) => 
                      setSettings(prev => ({
                        ...prev,
                        preferences: { 
                          ...prev.preferences, 
                          monthlyBudget: Number(e.target.value) 
                        }
                      }))
                    }
                    placeholder="2000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Bell className="h-5 w-5" />
                <span>התראות</span>
              </CardTitle>
              <CardDescription>
                בחר איך תרצה לקבל התראות ועדכונים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">התראות באימייל</div>
                    <div className="text-sm text-muted-foreground">
                      קבל עדכונים חשובים באימייל
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">התראות דחיפה</div>
                    <div className="text-sm text-muted-foreground">
                      התראות מיידיות במכשיר
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">דוח חודשי</div>
                    <div className="text-sm text-muted-foreground">
                      סיכום חודשי של העלויות והחיסכון
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.monthlyReport}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, monthlyReport: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">התראות חיסכון</div>
                    <div className="text-sm text-muted-foreground">
                      התראות על הזדמנויות חיסכון חדשות
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.savingsAlerts}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, savingsAlerts: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Settings */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>קטגוריות פעילות</CardTitle>
              <CardDescription>
                בחר אילו קטגוריות לעקוב אחריהן
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {EXPENSE_CATEGORIES.map(category => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <div className="font-medium">{category.nameHebrew}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.keywords.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.categories.enabled.includes(category.id)}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          categories: {
                            ...prev.categories,
                            enabled: checked 
                              ? [...prev.categories.enabled, category.id]
                              : prev.categories.enabled.filter(id => id !== category.id)
                          }
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מילות מפתח מותאמות אישית</CardTitle>
              <CardDescription>
                הוסף מילות מפתח לזיהוי טוב יותר של הקטגוריות
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Select value={selectedCategoryForKeyword} onValueChange={setSelectedCategoryForKeyword}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nameHebrew}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="מילת מפתח חדשה"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  className="flex-1"
                />
                
                <Button onClick={addCustomKeyword} disabled={!customKeyword.trim() || !selectedCategoryForKeyword}>
                  הוסף
                </Button>
              </div>

              <div className="space-y-2">
                {EXPENSE_CATEGORIES.map(category => {
                  const customKeywords = settings.categories.customKeywords[category.id] || [];
                  if (customKeywords.length === 0) return null;

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-sm">{category.nameHebrew}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pr-5 rtl:pl-5">
                        {customKeywords.map(keyword => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                            <button
                              onClick={() => removeCustomKeyword(category.id, keyword)}
                              className="mr-1 rtl:ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Shield className="h-5 w-5" />
                <span>פרטיות ונתונים</span>
              </CardTitle>
              <CardDescription>
                שלוט בשימוש בנתונים האישיים שלך
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">איסוף נתונים</div>
                    <div className="text-sm text-muted-foreground">
                      אפשר איסוף נתונים לשיפור השירות
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, dataCollection: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">ניתוח שימוש</div>
                    <div className="text-sm text-muted-foreground">
                      שיתוף נתוני שימוש אנונימיים לשיפור האפליקציה
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, analytics: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">התקשורת שיווקית</div>
                    <div className="text-sm text-muted-foreground">
                      קבלת הצעות ועדכונים שיווקיים
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.marketing}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, marketing: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ניהול נתונים</CardTitle>
              <CardDescription>
                ייצא או מחק את הנתונים האישיים שלך
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  כל הנתונים נשמרים במכשיר שלך ולא נשלחים לשרתים חיצוניים
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="ml-2 h-4 w-4" />
                  ייצא נתונים
                </Button>
                
                <Button variant="destructive" onClick={handleDeleteData}>
                  <Trash2 className="ml-2 h-4 w-4" />
                  מחק את כל הנתונים
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              <span>שומר...</span>
            </div>
          ) : (
            <>
              <Save className="ml-2 h-4 w-4" />
              שמור הגדרות
            </>
          )}
        </Button>
      </div>
    </div>
  );
};