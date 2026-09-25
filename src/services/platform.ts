import { Capacitor } from '@capacitor/core';

export const isAndroid = Capacitor.getPlatform() === 'android';
export const isIOS = Capacitor.getPlatform() === 'ios';
export const isWeb = Capacitor.getPlatform() === 'web';

export interface PaymentBrandInfo {
  name: string;
  badge: string;
  shortName: string;
  iconType: 'google' | 'apple' | 'card';
}

export const getPaymentBrandInfo = (): PaymentBrandInfo => {
  if (isAndroid) {
    return {
      name: 'Google Pay',
      badge: 'GPay',
      shortName: 'GPay',
      iconType: 'google'
    };
  }
  if (isIOS) {
    return {
      name: 'Apple Pay',
      badge: 'Pay',
      shortName: 'Pay',
      iconType: 'apple'
    };
  }
  return {
    name: 'Google Pay / Apple Pay',
    badge: 'Pay',
    shortName: 'Pay',
    iconType: 'card'
  };
};
