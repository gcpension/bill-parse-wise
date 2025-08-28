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
  MessageSquare,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/lib/errorHandler';
import { createHebrewPDF } from '@/lib/pdfUtils';
import TestDataSubmission from '@/components/TestDataSubmission';
import { SupabaseSetup } from '@/components/SupabaseSetup';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  monthlyBudget: string;
  preferredCategories: string[];
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newDeals: boolean;
  priceChanges: boolean;
  monthlyReports: boolean;
}

const initialProfile: UserProfile = {
  name: 'משה כהן',
  email: 'moshe@example.com',
  phone: '050-1234567',
  address: 'תל אביב, ישראל',
  monthlyBudget: '2500',
  preferredCategories: ['electricity', 'cellular']
};

const initialNotifications: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  newDeals: true,
  priceChanges: true,
  monthlyReports: true
};

export const Settings = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [autoAnalyze, setAutoAnalyze] = useState(() => {
    return localStorage.getItem('autoAnalyze') !== 'false';
  });
  const [savedAmount] = useState(8750);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState({
    profile: false,
    notifications: false,
    export: false,
    delete: false
  });

  const handleSaveProfile = async () => {
    setIsLoading(prev => ({ ...prev, profile: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('userProfile', JSON.stringify(profile));
      toast({
        title: "פרופיל נשמר בהצלחה!",
        description: "השינויים שלך נשמרו במערכת",
      });
    } catch (error) {
      handleError(error, 'Profile save');
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(prev => ({ ...prev, notifications: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      toast({
        title: "הגדרות התראות נשמרו!",
        description: "ההגדרות החדשות יופעלו מיד",
      });
    } catch (error) {
      handleError(error, 'Notifications save');
    } finally {
      setIsLoading(prev => ({ ...prev, notifications: false }));
    }
  };

  const handleExportData = async () => {
    setIsLoading(prev => ({ ...prev, export: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        profile,
        notifications,
        savedAmount,
        exportDate: new Date().toISOString(),
        savedForms: Object.keys(localStorage)
          .filter(key => key.startsWith('provider-switch-') || key.startsWith('switch-'))
          .reduce((acc, key) => {
            acc[key] = JSON.parse(localStorage.getItem(key) || '{}');
            return acc;
          }, {} as Record<string, any>)
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], { 
        type: 'application/json;charset=utf-8' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `חסכונט-נתונים-${new Date().toLocaleDateString('he-IL')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "הנתונים יוצאו בהצלחה!",
        description: "קובץ הנתונים שלך הורד למחשב",
      });
    } catch (error) {
      handleError(error, 'Data export');
    } finally {
      setIsLoading(prev => ({ ...prev, export: false }));
    }
  };

  const handleToggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('darkMode', checked.toString());
    
    // Apply dark mode to document
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: checked ? "מצב כהה הופעל" : "מצב בהיר הופעל",
      description: "השינויים יישמרו עבור הפעמים הבאות",
    });
  };

  const handleToggleAutoAnalyze = (checked: boolean) => {
    setAutoAnalyze(checked);
    localStorage.setItem('autoAnalyze', checked.toString());
    toast({
      title: `ניתוח אוטומטי ${checked ? 'הופעל' : 'בוטל'}`,
      description: checked ? "חשבונות ינותחו אוטומטית" : "תצטרך לנתח חשבונות ידנית",
    });
  };

  const handleDeleteAccount = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו לא ניתנת לביטול!')) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, delete: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear all user data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('userProfile') || 
            key.startsWith('notificationSettings') || 
            key.startsWith('provider-switch-') || 
            key.startsWith('switch-')) {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: "החשבון נמחק בהצלחה",
        description: "כל הנתונים שלך הוסרו מהמערכת",
        variant: "destructive"
      });

      // Redirect to home
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      handleError(error, 'Account deletion');
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const categoryNames = {
    electricity: 'חשמל',
    cellular: 'סלולר',
    internet: 'אינטרנט'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
          הגדרות
        </h1>
        <p className="text-muted-foreground text-lg">
          נהל את הפרופיל שלך והתאם את המערכת לצרכים שלך
        </p>
      </div>

      {/* Savings Summary */}
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2 rtl:space-x-reverse">
            <User className="h-4 w-4" />
            <span>פרופיל</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Bell className="h-4 w-4" />
            <span>התראות</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2 rtl:space-x-reverse">
            <ExternalLink className="h-4 w-4" />
            <span>שילובים</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2 rtl:space-x-reverse">
            <SettingsIcon className="h-4 w-4" />
            <span>העדפות</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Shield className="h-4 w-4" />
            <span>חשבון</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <User className="h-5 w-5" />
                <span>פרטים אישיים</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">כתובת</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">תקציב חודשי (₪)</Label>
                  <div className="relative">
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      type="number"
                      value={profile.monthlyBudget}
                      onChange={(e) => setProfile({ ...profile, monthlyBudget: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    התקציב הכולל שלך לחשמל, סלולר ואינטרנט
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>קטגוריות מעדיפות</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categoryNames).map(([key, name]) => (
                      <Badge
                        key={key}
                        variant={profile.preferredCategories.includes(key) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const updated = profile.preferredCategories.includes(key)
                            ? profile.preferredCategories.filter(cat => cat !== key)
                            : [...profile.preferredCategories, key];
                          setProfile({ ...profile, preferredCategories: updated });
                        }}
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    בחר קטגוריות שמעניינות אותך להתראות והמלצות
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading.profile}>
                {isLoading.profile ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Check className="ml-2 h-4 w-4" />
                    שמור שינויים
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Bell className="h-5 w-5" />
                <span>הגדרות התראות</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>התראות באימייל</Label>
                    <p className="text-sm text-muted-foreground">
                      קבל עדכונים באימייל על מבצעים וחיסכון
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>התראות SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      קבל הודעות טקסט על מבצעים דחופים
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>מבצעים חדשים</Label>
                    <p className="text-sm text-muted-foreground">
                      התראה כשיש מבצע חדש בקטגוריות שבחרת
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newDeals}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, newDeals: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>שינויי מחירים</Label>
                    <p className="text-sm text-muted-foreground">
                      התראה כשמחירי הספקים משתנים
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceChanges}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, priceChanges: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>דוחות חודשיים</Label>
                    <p className="text-sm text-muted-foreground">
                      סיכום חודשי של החיסכון שלך
                    </p>
                  </div>
                  <Switch
                    checked={notifications.monthlyReports}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, monthlyReports: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} disabled={isLoading.notifications}>
                {isLoading.notifications ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Check className="ml-2 h-4 w-4" />
                    שמור הגדרות
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <ExternalLink className="h-5 w-5" />
                <span>שילובים פעילים</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sheets Integration - Locked */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ExternalLink className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Google Sheets</h4>
                      <p className="text-sm text-green-700">
                        מחובר ופעיל - הטפסים נשלחים אוטומטית
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                    מחובר
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs text-green-600">
                    כל הטפסים נשלחים אוטומטית ל-Google Sheets המוגדר במערכת
                  </p>
                </div>
              </div>

              <Separator />
              
              {/* Test Data Submission */}
              <TestDataSubmission />
              
              <Separator />

              {/* Supabase Integration Status */}
              <SupabaseSetup />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Palette className="h-5 w-5" />
                <span>העדפות מערכת</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>מצב כהה</Label>
                    <p className="text-sm text-muted-foreground">
                      החלף למראה כהה של האפליקציה
                    </p>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleToggleDarkMode}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>ניתוח אוטומטי</Label>
                    <p className="text-sm text-muted-foreground">
                      נתח אוטומטית חשבוניות שהועלו
                    </p>
                  </div>
                  <Switch
                    checked={autoAnalyze}
                    onCheckedChange={handleToggleAutoAnalyze}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>שפת ממשק</Label>
                  <Select defaultValue="he">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he">עברית</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>תדירות בדיקת מחירים</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">יומי</SelectItem>
                      <SelectItem value="weekly">שבועי</SelectItem>
                      <SelectItem value="monthly">חודשי</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    באיזו תדירות לבדוק מחירים חדשים
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <HelpCircle className="h-5 w-5" />
                <span>עזרה ותמיכה</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" onClick={() => {
                  toast({
                    title: "יצירת קשר",
                    description: "אנו כאן לעזור! נציג יחזור אליך בהקדם",
                  });
                }}>
                  <MessageSquare className="ml-2 h-4 w-4" />
                  צור קשר עם התמיכה
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => {
                  window.open('/help', '_blank');
                  toast({
                    title: "מרכז העזרה נפתח",
                    description: "המדריכים זמינים בכרטיסייה חדשה",
                  });
                }}>
                  <ExternalLink className="ml-2 h-4 w-4" />
                  מרכז עזרה ומדריכים
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => {
                  toast({
                    title: "תודה על הדירוג!",
                    description: "המשוב שלך חשוב לנו מאוד",
                  });
                }}>
                  <Star className="ml-2 h-4 w-4" />
                  דרג את החסכונט
                </Button>
                <Button variant="outline" className="justify-start" onClick={async () => {
                  const guideContent = [
                    '',
                    '1. צור פרופיל אישי',
                    '2. העלה חשבונות או הזן נתונים ידנית',
                    '3. השווה בין ספקים',
                    '4. חתום דיגיטלית על מעבר ספק',
                    '5. חסוך כסף!'
                  ];
                  
                  const title = 'מדריך משתמש - חסכונט';
                  const pdf = await createHebrewPDF(title, guideContent);
                  pdf.save('user-guide-chasconot.pdf');
                  toast({
                    title: "מדריך הורד בהצלחה!",
                    description: "המדריך נשמר במחשב שלך כקובץ PDF",
                  });
                }}>
                  <Download className="ml-2 h-4 w-4" />
                  הורד מדריך שימוש
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Shield className="h-5 w-5" />
                <span>ניהול חשבון</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">ייצוא נתונים</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    הורד את כל הנתונים שלך בפורמט JSON או CSV
                  </p>
                  <Button variant="outline" onClick={handleExportData} disabled={isLoading.export}>
                    {isLoading.export ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        מייצא...
                      </>
                    ) : (
                      <>
                        <Download className="ml-2 h-4 w-4" />
                        ייצא נתונים
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">מדיניות פרטיות</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    הנתונים שלך מוצפנים ולא נמכרים לצדדים שלישיים
                  </p>
                  <Button variant="outline" onClick={() => {
                    window.open('/privacy-policy', '_blank');
                    toast({
                      title: "מדיניות פרטיות נפתחת",
                      description: "המדיניות נפתחת בכרטיסייה חדשה",
                    });
                  }}>
                    <ExternalLink className="ml-2 h-4 w-4" />
                    קרא מדיניות פרטיות
                  </Button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-2">מחיקת חשבון</h4>
                      <p className="text-sm text-red-700 mb-3">
                        מחיקת החשבון תמחק את כל הנתונים שלך לצמתיות. פעולה זו לא ניתנת לביטול.
                      </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isLoading.delete}
                  >
                    {isLoading.delete ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        מוחק...
                      </>
                    ) : (
                      <>
                        <Trash2 className="ml-2 h-4 w-4" />
                        מחק חשבון
                      </>
                    )}
                  </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Version Info */}
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>חסכונט גרסה 1.0.0</span>
                <span>עדכון אחרון: ינואר 2024</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};