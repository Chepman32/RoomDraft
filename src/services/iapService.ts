/**
 * In-App Purchase Service
 * Handles all IAP operations using react-native-iap
 */

import {Platform} from 'react-native';
import {APP_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES} from '@utils/constants';

// Types for IAP (simplified - in production use react-native-iap types)
export interface IAPProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  type: 'consumable' | 'non-consumable' | 'subscription';
}

export interface IAPPurchase {
  productId: string;
  transactionId: string;
  purchaseDate: string;
  transactionReceipt: string;
}

export interface IAPResult {
  success: boolean;
  purchase?: IAPPurchase;
  error?: string;
}

// ============================================================================
// IAP Service Implementation
// ============================================================================

class IAPServiceImpl {
  private isInitialized: boolean = false;
  private products: IAPProduct[] = [];
  private productIds: string[] = [APP_CONFIG.iap.products.proUnlock];

  // Initialize IAP
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // In production with react-native-iap:
      // await RNIap.initConnection();
      // await this.loadProducts();

      this.isInitialized = true;
      console.log('IAP Service initialized');
    } catch (error) {
      console.error('IAP initialization failed:', error);
      throw new Error(ERROR_MESSAGES.iap.notAvailable);
    }
  }

  // Load products from stores
  private async loadProducts(): Promise<void> {
    try {
      // In production with react-native-iap:
      // const products = await RNIap.getProducts(this.productIds);

      // Mock products for now
      this.products = [
        {
          productId: APP_CONFIG.iap.products.proUnlock,
          title: 'RoomDraft Pro',
          description: 'Unlock unlimited plans, DXF export, and furniture library',
          price: APP_CONFIG.iap.prices.proUnlock,
          currency: 'USD',
          type: 'non-consumable',
        },
      ];

      console.log('Products loaded:', this.products.length);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  // Get available products
  async getProducts(): Promise<IAPProduct[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.products.length === 0) {
      await this.loadProducts();
    }

    return this.products;
  }

  // Get product by ID
  async getProduct(productId: string): Promise<IAPProduct | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.productId === productId);
  }

  // Purchase product
  async purchase(productId: string): Promise<IAPResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // In production with react-native-iap:
      // const purchase = await RNIap.requestPurchase(productId);
      // await this.finalizePurchase(purchase);

      // Mock purchase for now
      const mockPurchase: IAPPurchase = {
        productId,
        transactionId: `txn_${Date.now()}`,
        purchaseDate: new Date().toISOString(),
        transactionReceipt: 'mock_receipt_data',
      };

      console.log('Purchase completed:', mockPurchase);

      return {
        success: true,
        purchase: mockPurchase,
      };
    } catch (error: any) {
      console.error('Purchase failed:', error);

      return {
        success: false,
        error: error.message || ERROR_MESSAGES.iap.purchaseFailed,
      };
    }
  }

  // Restore purchases
  async restorePurchases(): Promise<IAPResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // In production with react-native-iap:
      // const purchases = await RNIap.getAvailablePurchases();

      console.log('Purchases restored');

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Restore failed:', error);

      return {
        success: false,
        error: error.message || ERROR_MESSAGES.iap.restoreFailed,
      };
    }
  }

  // Finalize purchase (acknowledge)
  private async finalizePurchase(purchase: IAPPurchase): Promise<void> {
    try {
      // In production with react-native-iap:
      // if (Platform.OS === 'ios') {
      //   await RNIap.finishTransaction(purchase);
      // } else {
      //   await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
      // }

      console.log('Purchase finalized:', purchase.transactionId);
    } catch (error) {
      console.error('Failed to finalize purchase:', error);
    }
  }

  // Validate receipt (server-side in production)
  async validateReceipt(receipt: string): Promise<boolean> {
    try {
      // In production: send receipt to your server for validation
      // Server validates with Apple/Google
      // Returns whether the purchase is valid

      console.log('Validating receipt...');

      // Mock validation
      return true;
    } catch (error) {
      console.error('Receipt validation failed:', error);
      return false;
    }
  }

  // Check if Pro is active
  async checkProStatus(): Promise<boolean> {
    try {
      // In production: check actual purchases
      // const purchases = await RNIap.getAvailablePurchases();
      // return purchases.some(p => p.productId === APP_CONFIG.iap.products.proUnlock);

      // For now, return false (free version)
      return false;
    } catch (error) {
      console.error('Failed to check Pro status:', error);
      return false;
    }
  }

  // Cleanup
  async cleanup(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // In production with react-native-iap:
      // await RNIap.endConnection();

      this.isInitialized = false;
      console.log('IAP Service cleaned up');
    } catch (error) {
      console.error('IAP cleanup failed:', error);
    }
  }
}

export const iapService = new IAPServiceImpl();

// ============================================================================
// IAP Hook for React Components
// ============================================================================

export const useIAP = () => {
  const [products, setProducts] = React.useState<IAPProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPro, setIsPro] = React.useState(false);

  React.useEffect(() => {
    loadProducts();
    checkPro();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const prods = await iapService.getProducts();
      setProducts(prods);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPro = async () => {
    const status = await iapService.checkProStatus();
    setIsPro(status);
  };

  const purchasePro = async (): Promise<IAPResult> => {
    setIsLoading(true);
    try {
      const result = await iapService.purchase(APP_CONFIG.iap.products.proUnlock);
      if (result.success) {
        await checkPro();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const restore = async (): Promise<IAPResult> => {
    setIsLoading(true);
    try {
      const result = await iapService.restorePurchases();
      if (result.success) {
        await checkPro();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    isPro,
    purchasePro,
    restore,
  };
};

// Need to add React import at top
import React from 'react';
