import { Terminal, Zap, Cpu, HardDrive, ShieldCheck } from 'lucide-react';

export default function HeroTerminalWidget() {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 sm:-inset-2 rounded-2xl sm:rounded-[2rem] bg-gradient-to-tr from-indigo-500/30 via-fuchsia-500/20 to-amber-500/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative rounded-2xl border border-white/15 bg-[#0a0a14]/90 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-white/5 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 inline-block shrink-0" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block shrink-0" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block shrink-0" />
            <span className="ml-1 sm:ml-2 text-xs font-mono text-gray-400 flex items-center gap-1.5 truncate">
              <Terminal size={14} className="text-indigo-400 shrink-0" />
              <span className="truncate">ToggleMesh.SDK.Benchmark.cs</span>
            </span>
          </div>

          <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono rounded border border-white/10 bg-white/5 text-indigo-300 shrink-0">
            BenchmarkDotNet v0.15.8
          </span>
        </div>

        <div className="p-3 sm:p-4 font-mono text-[11px] sm:text-sm text-gray-300 overflow-x-auto leading-relaxed bg-[#05050b]/80">
          <div className="text-gray-400 mb-2.5 pb-2.5 border-b border-white/5">
            <div><span className="text-purple-400">[GlobalSetup]</span></div>
            <div><span className="text-blue-400">public void</span> <span className="text-amber-300">Setup</span>() =&gt;</div>
            <div className="pl-3 sm:pl-4"><span className="text-gray-300">_benchUser</span> = <span className="text-blue-400">new</span> ToggleMeshUser&lt;<span className="text-cyan-300">AotContext</span>&gt;(<span className="text-emerald-300">"user-123"</span>, _ctx);</div>
          </div>

          <div>
            <span className="text-purple-400">[Benchmark]</span>
          </div>
          <div>
            <span className="text-blue-400">public bool</span>{' '}
            <span className="text-amber-300">Evaluate_10Rules_AOT</span>()
          </div>
          <div>{'{'}</div>
          <div className="pl-3 sm:pl-4 text-gray-400">
            <span className="text-purple-400">return</span> _client.<span className="text-amber-200">IsEnabled</span>(
          </div>
          <div className="pl-6 sm:pl-8 text-gray-400">
            <span className="text-emerald-300">"bench-flag-10rules"</span>, <span className="text-blue-400">ref</span> _benchUser);
          </div>
          <div>{'}'}</div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-3 border-t border-white/10 bg-white/[0.02]">
          <div className="p-1.5 sm:p-2.5 rounded-xl border border-white/5 bg-white/5 text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-medium text-gray-400 mb-0.5 sm:mb-1 truncate">
              <Zap size={11} className="text-amber-400 shrink-0" />
              <span className="truncate">Throughput</span>
            </div>
            <div className="text-xs min-[360px]:text-sm sm:text-lg font-bold text-amber-300 font-mono tracking-tight whitespace-nowrap">
              115,248 <span className="text-[9px] sm:text-[10px] text-gray-400 font-normal">RPS</span>
            </div>
          </div>

          <div className="p-1.5 sm:p-2.5 rounded-xl border border-white/5 bg-white/5 text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-medium text-gray-400 mb-0.5 sm:mb-1 truncate">
              <Cpu size={11} className="text-indigo-400 shrink-0" />
              <span className="truncate">Latency</span>
            </div>
            <div className="text-xs min-[360px]:text-sm sm:text-lg font-bold text-indigo-300 font-mono tracking-tight whitespace-nowrap">
              &lt; 29.84 <span className="text-[9px] sm:text-[10px] text-gray-400 font-normal">ns</span>
            </div>
          </div>

          <div className="p-1.5 sm:p-2.5 rounded-xl border border-white/5 bg-white/5 text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-medium text-gray-400 mb-0.5 sm:mb-1 truncate">
              <HardDrive size={11} className="text-emerald-400 shrink-0" />
              <span className="truncate">Heap Alloc</span>
            </div>
            <div className="text-xs min-[360px]:text-sm sm:text-lg font-bold text-emerald-300 font-mono tracking-tight whitespace-nowrap">
              0 <span className="text-[9px] sm:text-[10px] text-gray-400 font-normal">Bytes</span>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 py-2 border-t border-white/5 bg-black/40 text-[10px] sm:text-[11px] text-gray-400 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="flex items-center gap-1 text-emerald-400 whitespace-nowrap">
            <ShieldCheck size={13} className="shrink-0" />
            Self-Hosted & GDPR Compliant
          </span>
          <span className="text-gray-400 font-mono text-[10px] sm:text-[11px] whitespace-nowrap">Intel i7-14700K · .NET 10 AOT</span>
        </div>
      </div>
    </div>
  );
}
