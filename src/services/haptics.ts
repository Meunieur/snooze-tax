import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' | 'warning' | 'error') => {
  try {
    switch (type) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'warning':
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case 'error':
        await Haptics.notification({ type: NotificationType.Error });
        break;
    }
  } catch {
    // Fallback to Web Vibration API if Capacitor native is unavailable
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'heavy' || type === 'error') {
        navigator.vibrate([100, 50, 100, 50, 200]);
      } else if (type === 'warning') {
        navigator.vibrate([80, 40, 80]);
      } else {
        navigator.vibrate(50);
      }
    }
  }
};
