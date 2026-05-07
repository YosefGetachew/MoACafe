
import { Order, OrderStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusColor } from '@/lib/order-utils';
import { CheckCircle2, Clock, MessageSquare, Trash2, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface StaffDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onSettle: (orderId: string) => void;
  onNotify: (order: Order) => void;
}

export function StaffDashboard({ orders, onUpdateStatus, onSettle, onNotify }: StaffDashboardProps) {
  const pendingOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Rejected');
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Orders</h2>
          <p className="text-muted-foreground">{pendingOrders.length} orders currently in queue</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
             {orders.filter(o => o.status === 'Pending').length} New
           </Badge>
           <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
             {orders.filter(o => o.status === 'Preparing').length} Cooking
           </Badge>
        </div>
      </div>

      {pendingOrders.length === 0 ? (
        <Card className="border-dashed h-64 flex flex-col items-center justify-center text-center">
          <Clock className="h-10 w-10 text-muted-foreground opacity-20 mb-4" />
          <p className="text-muted-foreground italic">No active orders yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          {pendingOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.customerName}</CardTitle>
                    <CardDescription>+251{order.customerPhone}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="max-h-[160px] pr-4">
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.price} ETB</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Amount</span>
                    <span className="text-xl font-bold">{order.total} ETB</span>
                  </div>
                  {order.deliveryOption === 'delivery' && (
                    <Badge variant="secondary" className="text-[10px]">
                      DELIVERY: {order.building} - {order.office}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.status === 'Pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'Preparing')}
                      className="flex-1"
                    >
                      <Clock className="h-3 w-3 mr-2" /> Start Prep
                    </Button>
                  )}
                  {order.status === 'Preparing' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => onNotify(order)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <MessageSquare className="h-3 w-3 mr-2" /> Notify & Ready
                    </Button>
                  )}
                  {order.status === 'Ready' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'Completed')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-2" /> Mark Done
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onSettle(order.id)}
                    className="flex-1"
                  >
                    Archive
                  </Button>
                  
                  {order.status === 'Pending' && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onUpdateStatus(order.id, 'Rejected')}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
