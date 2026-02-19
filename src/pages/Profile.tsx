import React, { useState } from 'react';
import { User, Settings, CreditCard, Bell, LogOut } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
export function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell
  }];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display font-bold mb-8">
          Account Settings
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <GlassCard className="p-4 space-y-2">
              {tabs.map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-primary-cyan/20 to-primary-purple/20 text-white border border-white/10' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>

                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )}
              <div className="h-px bg-white/10 my-2" />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </GlassCard>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <GlassCard className="p-8 min-h-[500px]">
              {activeTab === 'profile' &&
              <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-cyan to-primary-purple p-1">
                      <div className="w-full h-full rounded-full bg-[#0D0D0D] flex items-center justify-center overflow-hidden">
                        <User className="w-10 h-10 text-white/50" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">John Doe</h2>
                      <p className="text-white/60">Member since 2023</p>
                      <button className="text-sm text-primary-cyan hover:underline mt-1">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">
                        Full Name
                      </label>
                      <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none" />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">
                        Email
                      </label>
                      <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none" />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">
                        Phone
                      </label>
                      <input
                      type="tel"
                      defaultValue="+1 (555) 000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none" />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">
                        Location
                      </label>
                      <input
                      type="text"
                      defaultValue="New York, USA"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none" />

                    </div>
                  </div>

                  <div className="pt-4">
                    <GradientButton>Save Changes</GradientButton>
                  </div>
                </div>
              }

              {activeTab === 'settings' &&
              <div className="text-center py-20">
                  <Settings className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">
                    Settings panel content placeholder
                  </p>
                </div>
              }
            </GlassCard>
          </div>
        </div>
      </div>
    </div>);

}