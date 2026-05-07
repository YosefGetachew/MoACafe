
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface CheckoutDetailsProps {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  delivery: string;
  setDelivery: (v: string) => void;
  payment: string;
  setPayment: (v: string) => void;
  building: string;
  setBuilding: (v: string) => void;
  office: string;
  setOffice: (v: string) => void;
}

export function CheckoutDetails({
  name, setName, phone, setPhone, delivery, setDelivery,
  payment, setPayment, building, setBuilding, office, setOffice
}: CheckoutDetailsProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
          Contact Info
        </h4>
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-semibold">+251</span>
            <Input 
              id="phone" 
              placeholder="912345678" 
              className="pl-12"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
          Preferences
        </h4>
        <div className="grid gap-2">
          <Label>Delivery Option</Label>
          <Select value={delivery} onValueChange={setDelivery}>
            <SelectTrigger>
              <SelectValue placeholder="Select delivery" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pickup">Self-Pickup</SelectItem>
              <SelectItem value="delivery">Campus Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {delivery === 'delivery' && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
            <div className="grid gap-2">
              <Label htmlFor="building">Building</Label>
              <Input 
                id="building" 
                placeholder="Block 5" 
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="office">Office</Label>
              <Input 
                id="office" 
                placeholder="402" 
                value={office}
                onChange={(e) => setOffice(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <Label>Payment Method</Label>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash on Hand</SelectItem>
              <SelectItem value="telebirr">Telebirr</SelectItem>
              <SelectItem value="cbebirr">CBE Birr</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
