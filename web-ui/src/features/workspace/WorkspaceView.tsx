'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, MessageSquare, Layout, CheckCircle2, 
  Clock, AlertTriangle, Terminal as TerminalIcon, 
  Send, Bell, Search, Settings, ExternalLink 
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';

export default function WorkspaceView() {
  const [activeTab, setActiveTab] = useState<'jira' | 'slack'>('slack');

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* 1. Sidebar - Navigation & Slack Channels */}
      <aside className="w-64 bg-[#0A0A0A] border-right border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black">S</div>
          <span className="font-bold tracking-tighter italic">SENIORITY<span className="text-primary">.AI</span></span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Slack Simulator Section */}
          <div>
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Team Chat</h4>
            <div className="space-y-1">
              {['general', 'dev-team', 'ci-cd-alerts', 'hotfixes'].map(channel => (
                <button 
                  key={channel}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    channel === 'dev-team' ? 'bg-primary/10 text-primary' : 'text-white/50 hover:bg-white/5'
                  }`}
                >
                  <Hash className="w-4 h-4" /> {channel}
                </button>
              ))}
            </div>
          </div>

          {/* DMs (Personas) */}
          <div>
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Direct Messages</h4>
            <div className="space-y-1">
              {[
                { name: 'Boss (Tech Lead)', status: 'online', color: 'bg-emerald-500' },
                { name: 'QA (Tester)', status: 'idle', color: 'bg-yellow-500' },
                { name: 'Dev Junior', status: 'online', color: 'bg-emerald-500' },
              ].map(user => (
                <button key={user.name} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/5">
                  <div className={`w-2 h-2 rounded-full ${user.color}`} /> {user.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">Trainee Dev</p>
              <p className="text-[10px] text-white/30 italic">Juniority: 12%</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Navbar Header */}
        <header className="h-16 border-b border-white/5 bg-[#050505] flex items-center justify-between px-8">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('slack')}
              className={`text-sm font-bold transition-colors ${activeTab === 'slack' ? 'text-primary underline underline-offset-8 decoration-2' : 'text-white/40'}`}
            >
              Slack Terminal
            </button>
            <button 
              onClick={() => setActiveTab('jira')}
              className={`text-sm font-bold transition-colors ${activeTab === 'jira' ? 'text-primary underline underline-offset-8 decoration-2' : 'text-white/40'}`}
            >
              Jira Board
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <Clock className="w-4 h-4" /> 02:14:55 remaining
            </div>
            <Bell className="w-5 h-5 text-white/30" />
            <Settings className="w-5 h-5 text-white/30" />
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Content Switching */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'slack' ? (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="glass p-6 rounded-2xl flex items-start gap-4 border-l-4 border-l-primary">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">B</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Boss (Tech Lead) <span className="text-white/20 font-normal">10:42 AM</span></p>
                    <p className="text-sm leading-relaxed">
                      "Che, te asigné el ticket <strong>BANK-101</strong>. Es un fix prioritario porque estamos perdiendo consistencia en la DB con los montos negativos. Checkealo ASAP y abrí un PR. No te olvides de los tests, ok?"
                    </p>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 font-bold">QA</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">QA (Tester) <span className="text-white/10 font-normal">11:15 AM</span></p>
                    <p className="text-sm text-white/60 leading-relaxed italic">
                      "Esperando que muevas el ticket a 'Ready for Test' para empezar a romperlo."
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">Jira <span className="text-primary">Board</span></h2>
                    <p className="text-white/40 text-sm">Sprint #1 - Banking Core Modernization</p>
                  </div>
                  <Button variant="outline" className="text-xs gap-2">
                    <ExternalLink className="w-3 h-3" /> View Repository
                  </Button>
                </div>

                {/* Jira Card */}
                <div className="glass p-8 rounded-3xl border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-black bg-primary/20 text-primary px-3 py-1 rounded-full tracking-widest">BANK-101</span>
                    <span className="text-xs text-white/40">Estimate: 2h</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Fix: Negative amount validation in transfers</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Functional Analysis</h4>
                      <p className="text-sm text-white/60 leading-relaxed">
                        Currently, the system doesn't validate the 'amount' field in the transfer payload. Malicious users can send negative values, effectively "stealing" funds or corrupting accounting balances.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Technical Notes</h4>
                      <p className="text-xs text-white/40 leading-relaxed font-mono">
                        // Location: services/transfer.py <br/>
                        // Expected: Validation before DB commit. <br/>
                        // Requirement: 100% test coverage for the fix.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Terminal/Status Sidebar */}
          <aside className="w-80 border-l border-white/5 bg-[#080808] p-6 flex flex-col gap-8">
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">System Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">Docker Sandbox</span>
                  <span className="text-emerald-500 font-bold">● Running</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">MCP Agent</span>
                  <span className="text-emerald-500 font-bold">● Connected</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">GitHub Sync</span>
                  <span className="text-emerald-500 font-bold">● Ready</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <TerminalIcon className="w-3 h-3" /> Real-time Logs
              </h4>
              <div className="flex-1 bg-black rounded-xl p-4 font-mono text-[10px] text-emerald-500/80 space-y-2 overflow-y-auto border border-white/5">
                <p>{'>'} seniority-ai orchestrator v1.0</p>
                <p className="text-white/40">-- Waiting for git push --</p>
                <p className="text-yellow-500/80">[SYSTEM] Local files modified by fs_saboteur</p>
                <p className="text-white/40">[JIRA] Ticket BANK-101 created.</p>
              </div>
            </div>

            <Button className="w-full py-4 rounded-xl text-xs gap-2">
              <CheckCircle2 className="w-4 h-4" /> Open Pull Request
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
