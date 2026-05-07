
import { Order, OrderStatus } from '../types';

export const formatPhoneNumber = (phone: string): string => {
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) clean = clean.substring(1);
  if (clean.startsWith("251")) clean = clean.substring(3);
  return clean;
};

export const isValidEthiopianPhone = (phone: string): boolean => {
  return phone.length === 9;
};

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Preparing': return 'bg-blue-100 text-blue-800';
    case 'Ready': return 'bg-green-100 text-green-800';
    case 'Completed': return 'bg-emerald-100 text-emerald-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
