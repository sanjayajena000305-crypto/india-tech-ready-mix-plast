
import React, { useState, useMemo } from 'react';
import { Product, User, CompanyProfile, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_COMPANY_PROFILE, ADMIN_MOBILE_NUMBER } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import LoginModal from './components/LoginModal';
import NegotiationModal from './components/NegotiationModal';
import { EditIcon, TrashIcon, PlusIcon, UserIcon } from './components/icons';

type View = 'home' | 'productDetail' | 'admin' | 'checkout';
type AdminTab = 'products' | 'profile';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(INITIAL_COMPANY_PROFILE);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNegotiationModalOpen, setIsNegotiationModalOpen] = useState(false);

  const handleLogin = (mobile: string) => {
    const role = mobile === ADMIN_MOBILE_NUMBER ? 'admin' : 'customer';
    setCurrentUser({ mobile, role });
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const handleNavigate = (newView: View) => {
    setView(newView);
  };
  
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setView('productDetail');
  };

  const handleAddToCart = (productToAdd: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === productToAdd.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product: productToAdd, quantity }];
    });
    alert(`${productToAdd.name} added to cart!`);
  };

  const handleNegotiationAccept = (product: Product, price: number) => {
    const negotiatedProduct = { ...product, negotiatedPrice: price };
    handleAddToCart(negotiatedProduct);
    setTimeout(() => setIsNegotiationModalOpen(false), 2000);
  };

  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => {
      const price = item.product.negotiatedPrice ?? item.product.price;
      return total + price * item.quantity;
  }, 0), [cart]);


  // Admin Handlers
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleUpdateProfile = (updatedProfile: CompanyProfile) => {
    setCompanyProfile(updatedProfile);
    alert('Profile updated successfully!');
  };


  const renderView = () => {
    switch (view) {
      case 'productDetail':
        if (!selectedProduct) {
          setView('home');
          return null;
        }
        return (
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
             <button onClick={() => setView('home')} className="mb-6 text-sm font-medium text-primary hover:text-primary-hover">
                &larr; Back to all products
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full rounded-lg shadow-lg"/>
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{selectedProduct.name}</h1>
                    <p className="text-2xl font-semibold text-primary my-4">${selectedProduct.price.toFixed(2)}</p>
                    <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button onClick={() => handleAddToCart(selectedProduct)} className="w-full sm:w-auto px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">Add to Cart</button>
                        <button onClick={() => setIsNegotiationModalOpen(true)} className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-light transition-colors">Negotiate Price</button>
                    </div>
                </div>
            </div>
          </div>
        );
      case 'admin':
        return <AdminPanel products={products} profile={companyProfile} onUpdateProduct={handleUpdateProduct} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} onUpdateProfile={handleUpdateProfile} />;
      case 'checkout':
        return <CheckoutPage cart={cart} total={cartTotal} onCartUpdate={setCart} onCheckoutSuccess={() => {setCart([]); setView('home'); alert('Payment successful! Your order has been placed.')}} />;
      case 'home':
      default:
        return (
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header
        companyProfile={companyProfile}
        currentUser={currentUser}
        cartCount={cartCount}
        onNavigate={handleNavigate}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />
      <main>
        {renderView()}
      </main>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      <NegotiationModal
        isOpen={isNegotiationModalOpen}
        onClose={() => setIsNegotiationModalOpen(false)}
        product={selectedProduct}
        onNegotiationAccept={handleNegotiationAccept}
      />
    </div>
  );
};

// Sub-components for views to keep App.tsx organized
// --- AdminPanel Component ---
interface AdminPanelProps {
    products: Product[];
    profile: CompanyProfile;
    onUpdateProduct: (product: Product) => void;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onDeleteProduct: (id: number) => void;
    onUpdateProfile: (profile: CompanyProfile) => void;
}
const AdminPanel: React.FC<AdminPanelProps> = ({ products, profile, onUpdateProduct, onAddProduct, onDeleteProduct, onUpdateProfile }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('products');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Panel</h1>
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('products')} className={`${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Manage Products</button>
                    <button onClick={() => setActiveTab('profile')} className={`${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Company Profile</button>
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-700">Products List</h2>
                            <button onClick={() => setEditingProduct({} as Product)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm font-medium"><PlusIcon className="h-5 w-5"/>Add Product</button>
                        </div>
                        <div className="bg-white shadow rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{p.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${p.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => setEditingProduct(p)} className="text-primary hover:text-primary-hover"><EditIcon className="h-5 w-5"/></button>
                                                <button onClick={() => onDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="h-5 w-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {editingProduct && <ProductForm product={editingProduct} onSave={(p) => { p.id ? onUpdateProduct(p) : onAddProduct(p); setEditingProduct(null); }} onCancel={() => setEditingProduct(null)} />}
                    </div>
                )}
                {activeTab === 'profile' && <ProfileForm profile={profile} onSave={onUpdateProfile} />}
            </div>
        </div>
    );
};

// --- ProductForm Component ---
const ProductForm: React.FC<{ product: Partial<Product>, onSave: (product: Product) => void, onCancel: () => void }> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(product);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) : value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{product.id ? 'Edit Product' : 'Add Product'}</h3>
                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" className="w-full border-gray-300 rounded-md shadow-sm" />
                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
                <input name="price" type="number" value={formData.price || ''} onChange={handleChange} placeholder="Price" className="w-full border-gray-300 rounded-md shadow-sm" />
                <input name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="Image URL" className="w-full border-gray-300 rounded-md shadow-sm" />
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                    <button onClick={() => onSave(formData as Product)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Save</button>
                </div>
            </div>
        </div>
    );
};

// --- ProfileForm Component ---
const ProfileForm: React.FC<{ profile: CompanyProfile, onSave: (profile: CompanyProfile) => void }> = ({ profile, onSave }) => {
    const [formData, setFormData] = useState(profile);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-xl bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Edit Company Profile</h2>
            <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Company Name" className="w-full border-gray-300 rounded-md shadow-sm" />
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border-gray-300 rounded-md shadow-sm" />
                <input name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full border-gray-300 rounded-md shadow-sm" />
                <input name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleChange} placeholder="Contact Phone" className="w-full border-gray-300 rounded-md shadow-sm" />
                <div className="text-right">
                    <button onClick={() => onSave(formData)} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


// --- CheckoutPage Component ---
interface CheckoutPageProps {
    cart: CartItem[];
    total: number;
    onCartUpdate: (cart: CartItem[]) => void;
    onCheckoutSuccess: () => void;
}
const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, total, onCartUpdate, onCheckoutSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRemove = (productId: number) => {
        onCartUpdate(cart.filter(item => item.product.id !== productId));
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Mock payment processing
        setTimeout(() => {
            onCheckoutSuccess();
            setIsProcessing(false);
        }, 2000);
    }

    if (cart.length === 0) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Your Cart is Empty</h1>
                <p className="text-slate-600">Looks like you haven't added anything to your cart yet.</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 rounded-md object-cover"/>
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                        {item.product.negotiatedPrice && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Negotiated</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${(item.product.negotiatedPrice ?? item.product.price).toFixed(2)}</p>
                                    {item.product.negotiatedPrice && <p className="text-sm text-slate-500 line-through">${item.product.price.toFixed(2)}</p>}
                                    <button onClick={() => handleRemove(item.product.id)} className="text-red-500 hover:text-red-700 text-sm mt-1">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="mt-6 text-right">
                        <p className="text-lg font-semibold">Total: <span className="text-primary">${total.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Payment Details</h2>
                    <form onSubmit={handleCheckout} className="space-y-4">
                        <input required placeholder="Card Number" className="w-full border-gray-300 rounded-md shadow-sm" />
                        <input required placeholder="Cardholder Name" className="w-full border-gray-300 rounded-md shadow-sm" />
                        <div className="flex gap-4">
                            <input required placeholder="MM/YY" className="w-1/2 border-gray-300 rounded-md shadow-sm" />
                            <input required placeholder="CVC" className="w-1/2 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <button type="submit" disabled={isProcessing} className="w-full mt-4 bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-hover disabled:bg-slate-400 transition-colors">
                            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default App;
