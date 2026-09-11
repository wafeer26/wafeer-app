"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShoppingBag, Heart, Search, PlusCircle, 
  ShoppingCart, Upload, RefreshCw, CheckCircle, Sparkles, Tag 
} from 'lucide-react';

// إعداد الاتصال بـ Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function WafeerApp() {
  const [view, setView] = useState('store'); // 'store' | 'admin' | 'checkout'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // بيانات الطلب (الدفع عند الاستلام)
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    region: 'ضواحي القدس',
    address: '',
    notes: '',
  });

  // بيانات الأدمن لإضافة منتج جديد
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    oldPrice: '',
    stock: '',
    description: '',
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState([]);

  // 1. جلب المنتجات من Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  // 2. جلب الطلبات لوحة الأدمن
  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (view === 'admin') fetchOrders();
  }, [view]);

  // 3. رفع صورة المنتج إلى Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      setNewProduct({ ...newProduct, imageUrl: data.publicUrl });
      alert('تم رفع صورة المنتج بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء رفع الصورة: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 4. إضافة منتج من الأدمن
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.imageUrl) return alert('يرجى رفع صورة للمنتج أولاً');

    const { error } = await supabase.from('products').insert([
      {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        old_price: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
        stock: parseInt(newProduct.stock),
        description: newProduct.description,
        main_image: newProduct.imageUrl,
        is_available: true,
      },
    ]);

    if (error) {
      alert('خطأ في حفظ المنتج: ' + error.message);
    } else {
      alert('تم نشر المنتج بنجاح في متجر Wafeer!');
      setNewProduct({ name: '', price: '', oldPrice: '', stock: '', description: '', imageUrl: '' });
      fetchProducts();
    }
  };

  // 5. إرسال الطلب (الدفع عند الاستلام)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('السلة فارغة!');

    const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

    const { error } = await supabase.from('orders').insert([
      {
        customer_name: customer.name,
        phone_number: customer.phone,
        region: customer.region,
        address: customer.address,
        notes: customer.notes,
        total_amount: totalAmount,
        status: 'pending',
      },
    ]);

    if (error) {
      alert('حدث خطأ أثناء التأكيد: ' + error.message);
    } else {
      alert('شكراً لك! تم إرسال طلبك بنجاح وسنتواصل معك قريباً لتأكيد التوصيل.');
      setCart([]);
      setView('store');
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => setView('store')} className="text-2xl font-extrabold text-[#D9777F]">
            Wafeer <span className="text-xs text-gray-500 font-normal">وَفير</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === 'admin' ? 'store' : 'admin')}
              className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-200"
            >
              {view === 'admin' ? 'الرجوع للمتجر' : 'لوحة الأدمن'}
            </button>

            <button
              onClick={() => setView('checkout')}
              className="p-2 text-gray-600 hover:text-[#D9777F] relative bg-gray-100 rounded-full"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D9777F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* واجهة المتجر */}
        {view === 'store' && (
          <div>
            <div className="bg-gradient-to-r from-[#D9777F] to-[#B85B63] rounded-2xl p-6 text-white text-center md:text-right shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-1">منصة Wafeer – وَفير</h2>
              <p className="text-xs opacity-90">تسوقي أحدث المستلزمات العائلية | التوصيل لضواحي القدس والدفع عند الاستلام 🚚</p>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#D9777F]" /> المنتجات المتوفرة
            </h3>

            {loading ? (
              <p className="text-center text-xs text-gray-400 py-10">جاري تحميل المنتجات...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-10">لا توجد منتجات حالياً. أضيفي أول منتج من "لوحة الأدمن".</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img src={prod.main_image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{prod.name}</h4>
                      <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">{prod.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#D9777F]">{prod.price} ₪</span>
                        <button
                          onClick={() => { setCart([...cart, prod]); alert('تمت الإضافة للسلة!'); }}
                          className="bg-gray-900 text-white text-[11px] px-3 py-1.5 rounded-lg hover:bg-[#D9777F]"
                        >
                          إضافة للسلة
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* واجهة إتمام الطلب */}
        {view === 'checkout' && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">إتمام الطلب (الدفع عند الاستلام)</h3>
            <div className="mb-4 text-xs bg-gray-50 p-3 rounded-lg flex justify-between font-bold">
              <span>المجموع الكلي: {totalAmount} ₪</span>
              <span>عدد المنتجات: {cart.length}</span>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  className="w-full border p-2 rounded-lg outline-none"
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  className="w-full border p-2 rounded-lg outline-none"
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">العنوان التفصيلي</label>
                <textarea
                  required
                  className="w-full border p-2 rounded-lg outline-none"
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-[#D9777F] text-white py-3 rounded-lg font-bold text-sm">
                تأكيد الطلب الآن
              </button>
            </form>
          </div>
        )}

        {/* لوحة تحكم الأدمن */}
        {view === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-base font-bold text-gray-800 mb-4">إضافة منتج جديد</h3>
              <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">رفع صورة المنتج من الآيفون</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs" />
                  {uploading && <p className="text-emerald-600 mt-1">جاري رفع الصورة...</p>}
                </div>
                <div>
                  <label className="block font-bold mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    className="w-full border p-2 rounded-lg"
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">السعر (₪)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      className="w-full border p-2 rounded-lg"
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">الكمية</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      className="w-full border p-2 rounded-lg"
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">الوصف</label>
                  <textarea
                    value={newProduct.description}
                    className="w-full border p-2 rounded-lg"
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-[#D9777F] text-white py-2.5 rounded-lg font-bold">
                  حفظ ونشر المنتج
                </button>
              </form>
            </div>

            {/* الطلبات الواردة */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-base font-bold text-gray-800 mb-4">الطلبات الواردة</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-gray-400">لا توجد طلبات جديدة.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border p-3 rounded-lg bg-gray-50">
                      <p className="font-bold">{ord.customer_name} - {ord.total_amount} ₪</p>
                      <p>هاتف: {ord.phone_number}</p>
                      <p>العنوان: {ord.address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}