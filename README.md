# Wafeer - وَفير

## منصة متجر إلكتروني فلسطينية

تطبيق e-commerce حديث لبيع المستلزمات العائلية في ضواحي القدس مع خدمة الدفع عند الاستلام.

### ✨ الميزات الرئيسية

- 🏪 **واجهة متجر متقدمة** - عرض جميل للمنتجات مع إمكانية البحث
- 🛒 **سلة تسوق ذكية** - إدارة سهلة للمنتجات المختارة
- 💳 **نظام دفع آمن** - الدفع عند الاستلام بسهولة
- 👨‍💼 **لوحة تحكم أدمن قوية** - إدارة المنتجات والطلبات
- 📸 **رفع الصور المباشر** - رفع صور المنتجات من الهاتف
- 📊 **لوحة احصائيات** - تتبع المبيعات والطلبات
- 🔐 **حماية عالية** - استخدام Supabase للأمان

### 🛠️ التكنولوجيات المستخدمة

- **Next.js 14** - إطار عمل React
- **Supabase** - قاعدة البيانات والتخزين السحابي
- **Tailwind CSS** - تصميم الواجهات
- **Lucide React** - أيقونات عصرية

### 📋 المتطلبات

- Node.js 16+
- npm أو yarn
- حساب Supabase مجاني

### 🚀 التثبيت السريع

```bash
# 1. استنساخ المستودع
git clone https://github.com/wafeer26/wafeer-app.git
cd wafeer-app

# 2. تثبيت المكتبات
npm install

# 3. إعداد متغيرات البيئة
cp .env.local.example .env.local
# عدّل .env.local بإضافة بيانات Supabase

# 4. تشغيل التطبيق
npm run dev
```

سيفتح التطبيق على `http://localhost:3000`

### 🗄️ إعداد قاعدة البيانات

قم بإنشاء الجداول التالية في Supabase:

#### جدول المنتجات
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  price DECIMAL NOT NULL,
  old_price DECIMAL,
  stock INTEGER NOT NULL,
  description TEXT,
  main_image VARCHAR,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### جدول الطلبات
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  phone_number VARCHAR NOT NULL,
  region VARCHAR NOT NULL DEFAULT 'ضواحي القدس',
  address TEXT NOT NULL,
  notes TEXT,
  total_amount DECIMAL NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 💾 إعداد Supabase Storage

1. اذهب إلى Storage في لوحة Supabase
2. أنشئ bucket جديد باسم `products`
3. جعله عام (public) لعرض الصور

### 📱 الواجهات الرئيسية

#### واجهة العميل
- عرض جميع المنتجات
- إضافة المنتجات للسلة
- اتمام عملية الشراء
- تتبع الطلب

#### لوحة الأدمن
- إضافة منتجات جديدة
- إدارة المنتجات
- عرض جميع الطلبات
- احصائيات المبيعات

### 🔧 الإصلاحات والتحسينات

- ✅ إصلاح مشاكل الحالة (State Management)
- ✅ تحسين الأداء والتحميل
- ✅ إضافة معالجة الأخطاء
- ✅ تحسين واجهة المستخدم
- ✅ إضافة التحقق من صحة البيانات

### 📄 الترخيص

MIT License - استخدم بحرية 🎉

### 👥 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المستودع
2. إنشاء فرع للميزة الجديدة
3. إرسال Pull Request

### 📞 التواصل

للأسئلة والدعم، يرجى فتح Issue على GitHub.

---

مصنوعة بـ ❤️ لفلسطين
