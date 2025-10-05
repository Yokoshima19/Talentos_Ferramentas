
import React, { useState, useEffect, useCallback } from 'react';
import { Home } from './components/Home.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Management } from './components/Management.tsx';
import { Fleet } from './components/Fleet.tsx';
import { Ponto } from './components/Ponto.tsx';
import { UsersPage } from './components/Users.tsx';
import { Button, Input, Spinner, Toast, IconTalentosLogo, IconLogOut } from './components/ui.tsx';
import { useAuth } from './contexts/AuthContext.tsx';
import { auth, signInWithEmailAndPassword, firebaseSignOut } from './services/authService.ts';

// Login Page Component
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      let friendlyMessage = 'Ocorreu um erro. Tente novamente.';
      if (err.code) {
          switch (err.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/invalid-credential':
                  friendlyMessage = 'E-mail ou senha inválidos.';
                  break;
              case 'auth/invalid-email':
                  friendlyMessage = 'O formato do e-mail é inválido.';
                  break;
          }
      }
      setError(friendlyMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center">
            <IconTalentosLogo className="mx-auto h-12 w-12" />
            <h1 className="mt-4 text-3xl font-extrabold text-white">
              Acessar Dashboard
            </h1>
            <p className="mt-2 text-gray-400">
              Acesse para gerenciar suas finanças.
            </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" className="mt-1" />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-gray-400">Senha</label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="mt-1" />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
};


// Main App Component
export type Tab = 'home' | 'dashboard' | 'management' | 'fleet' | 'ponto' | 'users';

const App: React.FC = () => {
  const { user, profile, loading: authLoading, hasModuleAccess } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({ message: '', type: 'success', isVisible: false });
  
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  const navigateTo = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);
  
  const tabToModuleMap: Record<Tab, string> = {
    home: 'home', // Special case, not a real module
    dashboard: 'dashboard',
    management: 'gerenciamento',
    fleet: 'frota',
    ponto: 'ponto',
    users: 'users',
  };

  useEffect(() => {
    if (!profile) return;
    
    // Map the English tab state to the Portuguese module name for permission checks.
    const currentModule = tabToModuleMap[activeTab];
    
    // Reset to home if user loses access to the current tab (e.g., role change)
    if (activeTab !== 'home' && !hasModuleAccess(currentModule)) {
      setActiveTab('home');
    }
  }, [activeTab, hasModuleAccess, profile]);


  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginPage />;
  }
  
  const renderContent = () => {
    switch(activeTab) {
        case 'home':
            return <Home navigateTo={navigateTo} />;
        case 'dashboard':
            return hasModuleAccess('dashboard') ? <Dashboard /> : null;
        case 'management':
            return hasModuleAccess('gerenciamento') ? <Management showToast={showToast} /> : null;
        case 'fleet':
            return hasModuleAccess('frota') ? <Fleet /> : null;
        case 'ponto':
            return hasModuleAccess('ponto') ? <Ponto /> : null;
        case 'users':
            return hasModuleAccess('users') ? <UsersPage showToast={showToast} /> : null;
        default:
            return <Home navigateTo={navigateTo} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <nav className="bg-gray-800/70 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm-px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <IconTalentosLogo className="h-8 w-8"/>
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => setActiveTab('home')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'home' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Início</button>
                {hasModuleAccess('dashboard') && <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Dashboard</button>}
                {hasModuleAccess('gerenciamento') && <button onClick={() => setActiveTab('management')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'management' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Gerenciamento</button>}
                {hasModuleAccess('frota') && <button onClick={() => setActiveTab('fleet')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'fleet' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Frota</button>}
                {hasModuleAccess('ponto') && <button onClick={() => setActiveTab('ponto')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ponto' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Ponto</button>}
                {hasModuleAccess('users') && <button onClick={() => setActiveTab('users')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Usuários</button>}
              </div>
            </div>
             <div className="flex items-center gap-4">
               <span className="text-sm text-gray-400 hidden sm:block">{profile.email}</span>
                <Button onClick={() => firebaseSignOut(auth)} variant="secondary" className="p-2">
                  <IconLogOut className="h-5 w-5"/>
                </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {renderContent()}
      </main>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />
    </div>
  );
};

export default App;
