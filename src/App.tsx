
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { NavBar } from './components/NavBar';
import { CafeteriaCard } from './components/CafeteriaCard';
import { MenuCard } from './components/MenuCard';
import { CheckoutDetails } from './components/CheckoutDetails';
import { StaffDashboard } from './components/StaffDashboard';
import { LoginForm } from './components/LoginForm';
import { CAFETERIAS, MENU_ITEMS, STAFF_USERS } from './constants';
import { MenuItem, Cafeteria, Order, OrderStatus } from './types';
import { isValidEthiopianPhone, formatPhoneNumber } from './lib/order-utils';
import { orderService } from './services/orderService';
import { auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, ChevronRight, Utensils, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function App() {
  // --- STATE ---
  const [selectedCafe, setSelectedCafe] = useState<Cafeteria | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- FORM STATE ---
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [building, setBuilding] = useState("");
  const [office, setOffice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState<Order[]>([]);

  const [history, setHistory] = useState<Order[]>(() => {
    const saved = localStorage.getItem("cafeteria-history");
    return saved ? JSON.parse(saved) : [];
  });

  // --- REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    let unsubscribe: () => void;

    if (selectedCafe && isStaff) {
      unsubscribe = orderService.subscribeToOrders(selectedCafe.id, (newOrders) => {
        setOrders(newOrders);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedCafe, isStaff]);

  useEffect(() => {
    localStorage.setItem("cafeteria-history", JSON.stringify(history));
  }, [history]);

  // --- HANDLERS ---
  const handleAddToCart = (item: MenuItem) => {
    setCart([...cart, item]);
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (index: number) => {
    const next = [...cart];
    next.splice(index, 1);
    setCart(next);
  };

  const handleLogin = async (user: string, pass: string) => {
    const staffUser = (STAFF_USERS as any)[user.toLowerCase()];
    if (staffUser && staffUser.password === pass) {
      try {
        await signInAnonymously(auth);
        const cafe = CAFETERIAS.find(c => c.id === staffUser.cafeteriaId);
        setSelectedCafe(cafe || null);
        setIsStaff(true);
        setShowLogin(false);
        toast.success(`Welcome back, ${cafe?.name} Staff`);
      } catch (error) {
        toast.error("Firebase auth failed. Using local mode.");
        const cafe = CAFETERIAS.find(c => c.id === staffUser.cafeteriaId);
        setSelectedCafe(cafe || null);
        setIsStaff(true);
        setShowLogin(false);
      }
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsStaff(false);
    setSelectedCafe(null);
    auth.signOut();
    toast.info("Logged out successfully");
  };

  const placeOrder = async () => {
    if (!selectedCafe) return;
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Please fill in contact details");
      return;
    }

    const cleanPhone = formatPhoneNumber(customerPhone);
    if (!isValidEthiopianPhone(cleanPhone)) {
      toast.error("Enter a valid 9-digit phone number");
      return;
    }

    const orderId = Math.random().toString(36).substr(2, 9);
    const newOrder: Omit<Order, 'createdAt'> = {
      id: orderId,
      cafeteriaId: selectedCafe.id,
      customerName,
      customerPhone: cleanPhone,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0),
      paymentMethod: paymentMethod as any,
      deliveryOption: deliveryOption as any,
      building: deliveryOption === 'delivery' ? building : undefined,
      office: deliveryOption === 'delivery' ? office : undefined,
      status: 'Pending',
    };

    try {
      await orderService.createOrder(newOrder as any);
      setCart([]);
      setIsCartOpen(false);
      setCustomerName("");
      setCustomerPhone("");
      setBuilding("");
      setOffice("");
      toast.success("Order Placed Successfully!");
    } catch (err) {
      toast.error("Failed to place order. Try again.");
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, status);
      toast.info(`Order status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const settleOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    try {
      await orderService.archiveOrder(orderId);
      setHistory([...history, { ...order, settledAt: new Date().toISOString() }]);
      toast.success("Order archived to history");
    } catch (err) {
      toast.error("Failed to archive order.");
    }
  };

  const notifyReady = (order: Order) => {
    updateOrderStatus(order.id, 'Ready');
    const msg = `Hello ${order.customerName}, your order from ${selectedCafe?.name} is READY!`;
    window.open(`https://wa.me/251${order.customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const categories: string[] = Array.from(new Set(MENU_ITEMS.map(i => i.category)));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-stone-50/30 text-slate-900 font-sans selection:bg-primary/10">
      <NavBar 
        cafeName={selectedCafe?.name}
        isStaff={isStaff}
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
        onTitleClick={() => !isStaff && setSelectedCafe(null)}
      />

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {isStaff ? (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <StaffDashboard 
                orders={orders.filter(o => o.cafeteriaId === selectedCafe?.id)}
                onUpdateStatus={updateOrderStatus}
                onSettle={settleOrder}
                onNotify={notifyReady}
              />
            </motion.div>
          ) : !selectedCafe ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 py-8"
            >
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                    <Utensils className="h-3 w-3" />
                    Premium Campus Experience
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                    Smart Dining <br />
                    <span className="text-primary italic">Simplified.</span>
                 </h1>
                 <p className="text-xl text-muted-foreground leading-relaxed">
                    Access the best campus cafeterias from your fingertips. Fresh food, delivered or for pickup, without the wait.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {CAFETERIAS.map((cafe) => (
                  <CafeteriaCard 
                    key={cafe.id}
                    cafeteria={cafe}
                    isSelected={false}
                    onClick={() => setSelectedCafe(cafe)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-12"
            >
                <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-200/60">
                   <div className="h-32 w-32 bg-stone-50 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border border-stone-100">
                      <img src={selectedCafe.logo} className="w-20 h-20 object-contain" />
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h2 className="text-4xl font-black text-slate-900 leading-tight">{selectedCafe.name}</h2>
                      <p className="text-lg text-muted-foreground mt-2 max-w-xl">{selectedCafe.description}</p>
                   </div>
                   <Button variant="outline" size="lg" onClick={() => setSelectedCafe(null)} className="rounded-2xl border-2 hover:bg-stone-50">
                     Change Cafeteria
                   </Button>
                </div>

                <Tabs defaultValue={categories[0]} className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b-2 border-stone-100 rounded-none px-0 h-14 mb-8">
                    {categories.map(cat => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full font-bold text-base transition-all"
                      >
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {categories.map(cat => (
                    <TabsContent key={cat} value={cat} className="space-y-12">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {MENU_ITEMS.filter(item => item.category === cat).map(item => (
                          <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- CART OVERLAY --- */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-stone-200">
          <SheetHeader className="p-8 border-b bg-stone-50/50">
            <SheetTitle className="flex items-center gap-3 text-2xl font-black">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Your Order
            </SheetTitle>
            <SheetDescription className="text-base">Review items and choose your preferences.</SheetDescription>
          </SheetHeader>
          
          <div className="flex-grow overflow-hidden flex flex-col">
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-12 space-y-6">
                 <div className="bg-stone-100 p-8 rounded-full border border-stone-200">
                    <ShoppingBag className="h-12 w-12 text-stone-400" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-xl font-bold text-slate-800">Hungry much?</p>
                    <p className="text-muted-foreground">Add some delicious items from the menu to get started.</p>
                 </div>
                 <Button className="rounded-xl px-8" onClick={() => setIsCartOpen(false)}>Browse Menu</Button>
              </div>
            ) : (
              <ScrollArea className="flex-grow px-8">
                <div className="py-8 space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-stone-400 tracking-widest">Selected Items</h4>
                    <div className="space-y-4">
                      {cart.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4 transition-all">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                            <img src={item.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
                            <p className="text-xs font-bold text-primary mt-1">{item.price} ETB</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(i)} className="text-stone-300 hover:text-destructive hover:bg-destructive/5 rounded-xl">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-stone-100" />
                  
                  <CheckoutDetails 
                    name={customerName} setName={setCustomerName}
                    phone={customerPhone} setPhone={setCustomerPhone}
                    delivery={deliveryOption} setDelivery={setDeliveryOption}
                    payment={paymentMethod} setPayment={setPaymentMethod}
                    building={building} setBuilding={setBuilding}
                    office={office} setOffice={setOffice}
                  />
                </div>
              </ScrollArea>
            )}
          </div>

          {cart.length > 0 && (
            <SheetFooter className="p-8 border-t bg-stone-50/80 backdrop-blur-sm">
              <div className="w-full space-y-6">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Total to Pay</p>
                      <p className="text-4xl font-black tracking-tighter text-slate-900">{cartTotal} <span className="text-base font-bold">ETB</span></p>
                   </div>
                </div>
                <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform" onClick={placeOrder}>
                  Confirm Order Now
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* --- STAFF LOGIN MODAL --- */}
      <Sheet open={showLogin} onOpenChange={setShowLogin}>
        <SheetContent side="right" className="p-0 border-none sm:max-w-md">
           <div className="h-full flex items-center justify-center p-8 bg-stone-50/50">
              <LoginForm onLogin={handleLogin} />
           </div>
        </SheetContent>
      </Sheet>

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
