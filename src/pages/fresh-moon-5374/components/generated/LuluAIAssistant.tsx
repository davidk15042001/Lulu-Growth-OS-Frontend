import { useState } from 'react';
import { Activity, Archive, ArrowRight, BarChart3, Bell, BookOpen, Bot, Brain, CalendarDays, Check, CheckSquare, ChevronDown, ChevronRight, CircleHelp, Copy, FileText, GitBranch, Globe2, Heart, HelpCircle, History, LayoutDashboard, Lightbulb, LineChart, Menu, MessageSquare, Mic, MoreHorizontal, Paperclip, Package, PanelRightClose, Plus, RefreshCw, Search, Send, Settings, ShieldAlert, ShoppingBag, Sparkles, Target, TrendingUp, UserRound, X, Zap } from 'lucide-react';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
const C = {
  bg: 'var(--foreground)',
  sidebar: 'var(--foreground)',
  surface: 'var(--foreground)',
  elevated: 'var(--foreground)',
  border: 'rgba(0,0,0,0.06)',
  borderHover: 'rgba(0,0,0,0.12)',
  violet: 'var(--border)',
  soft: 'var(--border)',
  text: 'var(--border)',
  secondary: 'var(--muted-foreground)',
  muted: 'var(--muted-foreground)',
  green: 'var(--chart-4)',
  amber: 'var(--foreground)',
  red: 'var(--foreground)',
  blue: 'var(--primary)'
};
type IconType = typeof LayoutDashboard;
type Conversation = {
  title: string;
  preview: string;
  time: string;
};
type Kpi = {
  label: string;
  value: string;
  delta: string;
  tone: 'good' | 'watch';
};
type LiveMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
type ConversationResponse = { id: string };
type AiResponse = { assistantMessage: { id: string; content: string } };
const conversations: Conversation[] = [{
  title: 'Business Performance Overview',
  preview: 'How is my business performing...',
  time: 'Just now'
}, {
  title: 'Growth Opportunities Q4',
  preview: 'What is my biggest growth...',
  time: '2h ago'
}, {
  title: 'Marketing Analysis',
  preview: 'How is my marketing performing...',
  time: 'Yesterday'
}, {
  title: 'Risk Assessment Review',
  preview: 'Are there any risks I should...',
  time: 'Dec 12'
}, {
  title: 'Advertising ROAS Analysis',
  preview: 'Why did my ROAS decline...',
  time: 'Dec 10'
}, {
  title: 'Customer Retention Strategy',
  preview: 'What can I do to reduce churn...',
  time: 'Dec 8'
}, {
  title: 'SEO Opportunity Report',
  preview: 'Show me our top SEO opportunities...',
  time: 'Dec 5'
}];
const prompts = [{
  category: 'Business',
  text: 'How is my business performing today?'
}, {
  category: 'Growth',
  text: 'What is my biggest growth opportunity?'
}, {
  category: 'Risks',
  text: 'Are there any risks I should know about?'
}, {
  category: 'Marketing',
  text: 'How is my marketing performing?'
}, {
  category: 'Tasks',
  text: 'What should I work on first?'
}, {
  category: 'AI Insights',
  text: 'What changed in my business recently?'
}];
const kpis: Kpi[] = [{
  label: 'Revenue',
  value: '€48,240',
  delta: '↑ 8.4%',
  tone: 'good'
}, {
  label: 'New Customers',
  value: '142',
  delta: '↑ 12.1%',
  tone: 'good'
}, {
  label: 'Conversion Rate',
  value: '3.8%',
  delta: '↓ 0.4pp',
  tone: 'watch'
}];
const navMain: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Insights Center',
  icon: LineChart
}, {
  label: 'Business Health',
  icon: Heart
}, {
  label: 'Growth Score',
  icon: TrendingUp
}, {
  label: 'KPI Explorer',
  icon: BarChart3
}];
const navAi: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'AI Assistant',
  icon: Sparkles
}, {
  label: 'AI Recommendations',
  icon: Lightbulb
}, {
  label: 'AI Tasks',
  icon: CheckSquare
}, {
  label: 'Opportunity Center',
  icon: Target
}, {
  label: 'Risk Center',
  icon: ShieldAlert
}, {
  label: 'AI Decision Center',
  icon: GitBranch
}, {
  label: 'AI Agents',
  icon: Bot
}, {
  label: 'AI Knowledge',
  icon: BookOpen
}, {
  label: 'AI Actions',
  icon: Zap
}, {
  label: 'AI Conversations',
  icon: MessageSquare
}, {
  label: 'AI Activity',
  icon: Activity
}];
const platforms = [{
  name: 'Shopify',
  icon: ShoppingBag,
  dot: C.green
}, {
  name: 'Google Analytics',
  icon: BarChart3,
  dot: C.blue
}, {
  name: 'Google Ads',
  icon: Target,
  dot: C.red
}, {
  name: 'Meta Ads',
  icon: Globe2,
  dot: C.blue
}];
const sources = [{
  name: 'Shopify',
  dot: C.green
}, {
  name: 'Google Analytics',
  dot: C.blue
}, {
  name: 'Google Ads',
  dot: C.red
}, {
  name: 'Meta Ads',
  dot: C.blue
}];
const contextKpis = [{
  label: 'Revenue',
  value: '€1.24M',
  delta: '↑8.4%',
  tone: 'good'
}, {
  label: 'Customers',
  value: '12,480',
  delta: '↑11.4%',
  tone: 'good'
}, {
  label: 'Conv. Rate',
  value: '3.8%',
  delta: '↓0.4pp',
  tone: 'watch'
}, {
  label: 'ROAS',
  value: '5.4x',
  delta: '↓6%',
  tone: 'watch'
}];
const knowledge = [{
  label: 'Company Information',
  icon: BookOpen
}, {
  label: 'Products & Services',
  icon: Package
}, {
  label: 'Business Description',
  icon: FileText
}];
function Avatar() {
  return <span className="ai-avatar" aria-label="Lulu AI">L</span>;
}
function SectionLabel({
  children
}: {
  children: string;
}) {
  return <p className="section-label">{children}</p>;
}
export function LuluAIAssistant() {
  const [activeConversation, setActiveConversation] = useState(0);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processingState, setProcessingState] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [messageError, setMessageError] = useState('');
  const startNewConversation = () => {
    setConversationId(null);
    setLiveMessages([]);
    setQuery('');
    setMessageError('');
  };
  const sendMessage = async (message = query) => {
    const content = message.trim();
    const workspaceId = getSelectedWorkspaceId();
    if (!content || !workspaceId || processingState) return;
    setMessageError('');
    setQuery('');
    setLiveMessages(current => [...current, { id: `local-${Date.now()}`, role: 'user', content }]);
    setProcessingState(true);
    try {
      let activeId = conversationId;
      if (!activeId) {
        const conversation = await requestApi<ConversationResponse>({
          path: `/workspaces/${workspaceId}/ai/conversations`,
          method: 'POST',
          body: { title: content.slice(0, 80) }
        });
        activeId = conversation.data.id;
        setConversationId(activeId);
      }
      const response = await requestApi<AiResponse>({
        path: `/workspaces/${workspaceId}/ai/conversations/${activeId}/respond`,
        method: 'POST',
        body: { content }
      });
      setLiveMessages(current => [...current, {
        id: response.data.assistantMessage.id,
        role: 'assistant',
        content: response.data.assistantMessage.content
      }]);
    } catch (error) {
      setMessageError(getFriendlyErrorMessage(error, 'Lulu AI could not prepare an answer. Please try again.'));
    } finally {
      setProcessingState(false);
    }
  };
  return <div className="lulu-app">
    <aside className="left-nav"><LuluSectionNavigation activeId="fresh-moon-5374" /></aside>

    <aside className="history-rail" aria-label="Conversation history">
      <header className="rail-header"><strong>Conversations</strong><button className="new-small" onClick={startNewConversation}><Plus size={13} /> New</button></header>
      <label className="search-box"><Search size={14} /><input aria-label="Search conversations" placeholder="Search conversations..." /></label>
      <div className="conversation-list">
        {conversations.map((conversation, index) => <button key={conversation.title} onClick={() => setActiveConversation(index)} className={`conversation-item ${activeConversation === index ? 'selected' : ''}`}><div className="conversation-title"><strong>{conversation.title}</strong><time>{conversation.time}</time></div><span>{conversation.preview}</span></button>)}
      </div>
      <button className="history-footer"><History size={14} /> View archived conversations</button>
    </aside>

    <main className="chat-column">
      <header className="chat-header"><div className="chat-heading"><strong>Business Performance Overview</strong><span className="status"><i /> Active</span><span className="updated">Updated just now</span></div><div className="header-actions"><span className="connected-pill"><i /> Business Context: Connected</span><div className="menu-wrap"><button className="icon-btn" aria-label="Conversation options" onClick={() => setShowMenu(!showMenu)}><MoreHorizontal size={18} /></button>{showMenu && <div className="dropdown"><button>Rename</button><button>Archive</button><button>Export</button><button>Delete</button></div>}</div><button className="primary-btn" onClick={startNewConversation}><Sparkles size={14} /> New Conversation</button><button className="icon-btn context-toggle" aria-label="Toggle business context" onClick={() => setShowContextPanel(!showContextPanel)}><PanelRightClose size={17} /></button></div></header>
      <div className="messages" role="log" aria-live="polite" aria-label="Conversation">
        <section className="welcome"><Avatar /><div><h1>Good morning, Sarah</h1><p>What would you like to understand or accomplish today?</p><small>I can analyze your business data, explain insights, identify opportunities and risks, help prioritize tasks and perform supported actions.</small></div></section>
        <section className="prompt-grid" aria-label="Suggested prompts">{prompts.map(prompt => <button key={prompt.text} className="prompt-card" onClick={() => void sendMessage(prompt.text)}><span>{prompt.category}</span><strong>{prompt.text}</strong><ArrowRight size={14} /></button>)}</section>
        <article className="message user-message"><div>How is my business performing today?</div><time>9:14 AM</time></article>
        <article className="ai-message"><Avatar /><div className="ai-content"><div className="response-card"><header><strong>Business Performance Overview</strong><span className="ai-badge">AI</span></header><p className="summary">Your business is performing well today. Revenue is up 8.4% compared to the same period last month, driven primarily by strong organic search performance and a recovery in email marketing conversions.</p><div className="kpi-row">{kpis.map(kpi => <div className="mini-kpi" key={kpi.label}><span>{kpi.label}</span><strong>{kpi.value}</strong><em className={kpi.tone}>{kpi.delta}</em><small className={kpi.tone}>{kpi.tone === 'good' ? 'Good' : 'Watch'}</small></div>)}</div><h2>Key Highlights</h2><ul className="highlights"><li>Organic search traffic up 14.2%</li><li>Email campaign ROAS improved to 7.2x</li><li>Advertising spend efficiency slightly decreased (-6%)</li><li>Customer lifetime value trending upward</li></ul><div className="risk-callout"><strong>⚠ Advertising ROAS has declined 14% compared to last period.</strong> Review recommended.</div><div className="source-row"><SectionLabel>SOURCES</SectionLabel>{sources.map(source => <span className="source-pill" key={source.name}><i style={{
                    background: source.dot
                  }} />{source.name}</span>)}</div><div className="confidence"><i /> Confidence: High <span title="Based on complete, real-time integration data.">ⓘ</span></div></div><div className="action-bar"><button><Copy size={13} /> Copy</button><button><RefreshCw size={13} /> Regenerate</button><button onClick={() => setShowConfirmDialog(true)}><CheckSquare size={13} /> Create Task</button><button><BarChart3 size={13} /> Open KPI Explorer</button><button><MessageSquare size={13} /> Ask Follow-up</button></div></div></article>
        <div className="followups">{['Show me the KPIs', 'Compare with last month', 'Show related risks', 'Create a task', 'Explain further'].map(item => <button key={item}>{item}</button>)}</div>
        <article className="message user-message processing-user"><div>What should I work on first?</div></article>
        {liveMessages.map(message => message.role === 'user'
          ? <article className="message user-message" key={message.id}><div>{message.content}</div></article>
          : <article className="ai-message message" key={message.id}><Avatar /><div className="ai-content"><div className="response-card"><header><strong>Lulu AI</strong><span className="ai-badge">AI</span></header><p className="summary live-response">{message.content}</p></div></div></article>)}
        {processingState && <article className="ai-message processing"><Avatar /><div className="processing-card"><div className="dots"><i /><i /><i /></div><p>Analyzing your tasks and priorities...</p></div></article>}
        {messageError && <p className="message-error" role="alert">{messageError}</p>}
      </div>
      <footer className="composer-wrap"><div className="composer"><div className="attachment"><span>📊 Q4 Revenue Report.pdf</span><button aria-label="Remove attachment"><X size={13} /></button></div><div className="input-row"><button className="icon-btn" aria-label="Attach context"><Paperclip size={17} /></button><textarea aria-label="Message input" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Ask Lulu anything about your business..." rows={1} /><button className={`icon-btn mic ${voiceActive ? 'listening' : ''}`} onClick={() => setVoiceActive(!voiceActive)} aria-label="Voice input" aria-pressed={voiceActive}><Mic size={17} /></button><button className="send-btn" aria-label="Send message" disabled={processingState || !query.trim()} onClick={() => void sendMessage()}><Send size={15} /></button></div><div className="composer-meta">Lulu AI · Business context connected · 4 integrations active</div></div></footer>
    </main>

    {showContextPanel && <aside className="context-panel" aria-label="Business context"><header><strong>Business Context</strong><button aria-label="Collapse context panel" onClick={() => setShowContextPanel(false)}><ChevronRight size={17} /></button></header><div className="context-scroll"><section><SectionLabel>BUSINESS CONTEXT</SectionLabel><div className="business-name"><strong>Meridian Commerce Ltd</strong><span><i /> Connected</span></div><p>Industry: E-commerce · B2C</p></section><section><SectionLabel>CONNECTED PLATFORMS</SectionLabel>{platforms.map(platform => {
            const Icon = platform.icon;
            return <div className="platform-row" key={platform.name}><Icon size={16} /><strong>{platform.name}</strong><span><i style={{
                  background: platform.dot
                }} /> Connected</span></div>;
          })}</section><section><SectionLabel>TIME RANGE</SectionLabel><button className="select-control"><CalendarDays size={15} /> Last 30 Days <ChevronDown size={14} /></button></section><section><SectionLabel>RELEVANT KPIS</SectionLabel>{contextKpis.map(kpi => <div className="context-kpi" key={kpi.label}><span>{kpi.label}</span><strong>{kpi.value}</strong><em className={kpi.tone}>{kpi.delta}</em></div>)}</section><section><SectionLabel>AI MEMORY</SectionLabel><div className="memory-card"><strong><Brain size={15} /> Using saved context</strong><p>Industry preference, KPI priorities, preferred report format.</p><a href="#memory">Manage Memory →</a></div></section><section><div className="agent-card"><Bot size={18} /><div><strong>Specialized Agent Available</strong><p>A specialized Marketing Agent can handle detailed campaign analysis.</p><button>Continue with Agent →</button></div></div></section><section><SectionLabel>KNOWLEDGE USED</SectionLabel>{knowledge.map(item => {
            const Icon = item.icon;
            return <div className="knowledge-pill" key={item.label}><Icon size={14} /> {item.label}</div>;
          })}<a className="knowledge-link" href="#knowledge">View Knowledge →</a></section></div></aside>}

    {showConfirmDialog && <div className="modal-backdrop" role="presentation"><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><button className="dialog-close" onClick={() => setShowConfirmDialog(false)} aria-label="Close dialog"><X size={17} /></button><h2 id="confirm-title">Confirm Action</h2><p>You are about to create a new task.</p><dl><div><dt>Action</dt><dd>Create task</dd></div><div><dt>Target</dt><dd>Advertising ROAS review</dd></div><div><dt>Connected Platform</dt><dd>Google Ads</dd></div><div><dt>Scope</dt><dd>Current business context</dd></div></dl><div className="dialog-actions"><button onClick={() => setShowConfirmDialog(false)}>Cancel</button><button className="primary-btn" onClick={() => setShowConfirmDialog(false)}>Confirm</button></div></section></div>}
    <style>{styles}</style>
  </div>;
}
const styles = `
*{box-sizing:border-box}button,textarea,input{font:inherit}.lulu-app{height:100vh;width:100%;display:flex;overflow:hidden;background:${C.bg};color:${C.text};font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px}.left-nav,.history-rail,.context-panel{background:${C.sidebar}}.left-nav{width:240px;flex:none;display:flex;flex-direction:column;border-right:1px solid ${C.border};padding:18px 12px 12px}.brand{height:42px;display:flex;align-items:center;gap:8px;padding:0 10px;font-size:16px}.brand-spark{display:grid;place-items:center;width:22px;height:22px;border-radius:7px;background:${C.violet};color:white}.nav-scroll{overflow:auto;flex:1}.section-label{font-size:10px;color:${C.muted};font-weight:600;letter-spacing:.08em;margin:18px 10px 7px}.nav-item{width:100%;border:0;background:transparent;color:${C.muted};display:flex;align-items:center;gap:11px;padding:8px 10px;border-radius:7px;text-align:left;cursor:pointer;font-size:13px;margin:1px 0}.nav-item:hover{color:${C.secondary};background:rgba(0,0,0,.04)}.nav-item.active{color:${C.soft};background:rgba(0,0,0,.15);border-left:3px solid ${C.violet};padding-left:7px}.nav-bottom{border-top:1px solid ${C.border};padding-top:9px}.user-profile{display:flex;align-items:center;gap:9px;padding:14px 8px 2px;color:${C.text};font-size:12px}.user-profile strong,.user-profile small{display:block}.user-profile small{color:${C.muted};font-size:11px;margin-top:2px}.user-profile>svg{margin-left:auto;color:${C.muted}}.user-avatar{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:var(--background);color:var(--foreground);font-size:10px;font-weight:700}.history-rail{width:260px;flex:none;border-right:1px solid ${C.border};display:flex;flex-direction:column;padding:18px 12px 12px}.rail-header{display:flex;justify-content:space-between;align-items:center;padding:0 4px 15px}.rail-header strong{font-size:13px}.new-small{border:0;background:${C.violet};color:var(--foreground);border-radius:6px;padding:5px 8px;display:flex;gap:4px;align-items:center;font-size:12px;cursor:pointer}.search-box{height:33px;background:${C.elevated};border:1px solid ${C.border};border-radius:8px;display:flex;align-items:center;gap:7px;color:${C.muted};padding:0 10px}.search-box input{background:none;border:0;outline:0;width:100%;color:${C.text};font-size:12px}.search-box input::placeholder{color:${C.muted}}.conversation-list{overflow:auto;flex:1;margin-top:12px}.conversation-item{border:0;border-left:2px solid transparent;background:transparent;color:${C.muted};width:100%;text-align:left;padding:11px 9px;cursor:pointer;border-radius:0 7px 7px 0}.conversation-item:hover{background:rgba(0,0,0,.04)}.conversation-item.selected{border-left-color:${C.violet};background:rgba(0,0,0,.1)}.conversation-title{display:flex;justify-content:space-between;gap:6px}.conversation-title strong{color:${C.text};font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.conversation-title time{font-size:10px;white-space:nowrap;color:${C.muted}}.conversation-item>span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:5px;font-size:11px}.history-footer{border:0;background:none;color:${C.muted};font-size:11px;display:flex;gap:7px;padding:12px 5px 0;cursor:pointer}.chat-column{min-width:480px;flex:1;display:flex;flex-direction:column;min-height:0;background:${C.bg}.chat-header{height:56px;flex:none;background:${C.surface};border-bottom:1px solid ${C.border};padding:0 20px 0 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}.chat-heading,.header-actions{display:flex;align-items:center;gap:12px}.chat-heading strong{font-size:15px}.status{color:${C.green};font-size:11px}.status i,.connected-pill i,.confidence i,.business-name i,.platform-row i{display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;margin-right:5px}.updated{font-size:11px;color:${C.muted};padding-left:2px}.connected-pill{color:${C.secondary};background:${C.elevated};border:1px solid ${C.border};padding:6px 9px;border-radius:6px;font-size:11px;white-space:nowrap}.connected-pill i{background:${C.soft}}.primary-btn{display:flex;align-items:center;gap:7px;border:0;background:${C.violet};color:var(--foreground);border-radius:8px;padding:8px 11px;font-size:12px;cursor:pointer}.primary-btn:hover,.send-btn:hover{filter:brightness(1.12)}.icon-btn{display:grid;place-items:center;border:0;background:none;color:${C.muted};padding:6px;border-radius:6px;cursor:pointer}.icon-btn:hover{background:rgba(0,0,0,.05);color:${C.text}}.menu-wrap{position:relative}.dropdown{position:absolute;right:0;top:34px;background:${C.elevated};border:1px solid ${C.borderHover};border-radius:8px;padding:5px;z-index:5;box-shadow:0 14px 30px var(--muted-foreground);width:120px}.dropdown button{display:block;width:100%;background:none;border:0;color:${C.secondary};text-align:left;padding:7px 9px;border-radius:5px;font-size:12px;cursor:pointer}.dropdown button:hover{background:rgba(0,0,0,.06);color:${C.text}}.messages{overflow:auto;flex:1;padding:26px 24px 18px;max-width:840px;width:100%;margin:0 auto}.welcome{display:flex;gap:13px;margin:2px 0 20px}.ai-avatar{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--primary),var(--primary));color:var(--primary-foreground);font-weight:700;font-size:14px;box-shadow:0 0 18px rgba(0,0,0,.3)}.welcome h1{font-size:22px;line-height:1.2;margin:0 0 6px;font-weight:600}.welcome p{margin:0;color:${C.secondary};font-size:14px}.welcome small{display:block;color:${C.muted};font-size:12px;line-height:18px;max-width:600px;margin-top:8px}.prompt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 25px 43px}.prompt-card{position:relative;min-height:70px;text-align:left;border:1px solid ${C.border};background:${C.surface};border-radius:9px;color:${C.text};padding:11px;cursor:pointer;transition:transform .2s,border-color .2s}.prompt-card:hover{transform:scale(1.02);border-color:rgba(0,0,0,.55)}.prompt-card span{display:block;text-transform:uppercase;letter-spacing:.07em;color:${C.muted};font-size:10px;margin-bottom:7px}.prompt-card strong{display:block;font-size:12px;line-height:16px;padding-right:13px;font-weight:500}.prompt-card svg{position:absolute;right:9px;bottom:10px;color:${C.soft}}.message{animation:fadeSlideUp .3s ease-out}.user-message{display:flex;flex-direction:column;align-items:flex-end;margin:0 0 20px}.user-message>div{background:${C.elevated};border-radius:16px 16px 4px 16px;padding:11px 15px;max-width:75%;color:${C.text};font-size:13px}.user-message time{font-size:10px;color:${C.muted};margin-top:5px;margin-right:3px}.ai-message{display:flex;gap:12px;align-items:flex-start}.ai-content{min-width:0;flex:1}.response-card{background:${C.surface};border:1px solid ${C.border};border-radius:10px;padding:18px 19px}.response-card header{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}.response-card header strong{font-size:15px}.ai-badge{font-size:10px;color:${C.soft};background:rgba(0,0,0,.16);padding:3px 6px;border-radius:5px;font-weight:600}.summary{color:${C.secondary};font-size:13px;line-height:21px;margin:0 0 17px}.live-response{white-space:pre-wrap;margin-bottom:0}.message-error{margin:12px 0;color:${C.red};font-size:12px;text-align:center}.kpi-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px}.mini-kpi{background:${C.elevated};border-radius:8px;padding:10px}.mini-kpi span,.mini-kpi strong,.mini-kpi em,.mini-kpi small{display:block}.mini-kpi span{font-size:10px;color:${C.muted};margin-bottom:7px}.mini-kpi strong{font-size:16px}.mini-kpi em{font-size:11px;font-style:normal;margin-top:4px}.mini-kpi small{font-size:9px;margin-top:7px;width:max-content;padding:2px 5px;border-radius:4px}.good{color:${C.green}.watch{color:${C.amber}}small.good{background:rgba(0,0,0,.12)}small.watch{background:rgba(0,0,0,.12)}.response-card h2{font-size:13px;margin:0 0 8px}.highlights{list-style:none;padding:0;margin:0 0 17px;color:${C.secondary};font-size:12px;line-height:22px}.highlights li:before{content:'•';color:${C.soft};font-size:16px;margin-right:8px}.risk-callout{border-left:3px solid ${C.amber};background:rgba(0,0,0,.08);padding:9px 11px;color:${C.secondary};font-size:11px;line-height:17px;margin-bottom:17px}.risk-callout strong{color:${C.text};font-weight:500}.source-row{display:flex;align-items:center;gap:5px;flex-wrap:wrap}.source-row .section-label{margin:0 4px 0 0}.source-pill{background:${C.elevated};border:1px solid ${C.border};padding:3px 7px;border-radius:99px;color:${C.secondary};font-size:10px}.source-pill i{display:inline-block;width:5px;height:5px;border-radius:50%;margin:0 4px 1px 0}.confidence{color:${C.secondary};font-size:11px;margin-top:15px}.confidence i{background:${C.soft}.confidence span{color:${C.muted};margin-left:4px;cursor:help}.action-bar{display:flex;gap:12px;padding:9px 2px 0;flex-wrap:wrap}.action-bar button{border:0;background:none;color:${C.muted};display:flex;align-items:center;gap:5px;padding:2px 0;font-size:11px;cursor:pointer}.action-bar button:hover{color:${C.text}}.followups{display:flex;gap:7px;flex-wrap:wrap;padding:13px 0 20px 42px}.followups button{border:1px solid ${C.border};background:${C.surface};color:${C.secondary};border-radius:99px;padding:6px 10px;font-size:11px;cursor:pointer}.followups button:hover{border-color:${C.violet};color:${C.soft}}.processing-user{margin-top:0}.processing{margin-bottom:10px}.processing-card{background:${C.surface};border:1px solid ${C.border};border-radius:10px;padding:16px 19px;min-width:250px}.dots{display:flex;gap:6px}.dots i{width:7px;height:7px;border-radius:50%;background:${C.violet};display:block}.processing-card p{font-size:12px;color:${C.muted};font-style:italic;margin:10px 0 0}.composer-wrap{flex:none;background:${C.sidebar};border-top:1px solid ${C.border};padding:14px 24px}.composer{background:${C.surface};border:1px solid rgba(0,0,0,.08);border-radius:14px;padding:10px 14px 8px}.attachment{display:flex;gap:7px;margin-bottom:8px}.attachment span{background:${C.elevated};border-radius:6px;padding:4px 8px;color:${C.secondary};font-size:11px}.attachment button{border:0;background:none;color:${C.muted};cursor:pointer}.input-row{display:flex;align-items:flex-end;gap:7px}.input-row textarea{background:transparent;border:0;outline:0;color:${C.text};resize:none;flex:1;min-height:24px;max-height:120px;padding:3px 0;font-size:13px}.input-row textarea::placeholder{color:${C.muted}}.mic.listening{color:${C.soft};background:rgba(0,0,0,.15);border-radius:50%;animation:pulseRing 1.4s infinite}.send-btn{width:32px;height:32px;border:0;border-radius:50%;background:${C.violet};color:white;display:grid;place-items:center;cursor:pointer}.send-btn:disabled{cursor:not-allowed;opacity:.45}.composer-meta{text-align:center;color:${C.muted};font-size:10px;margin-top:7px}.context-panel{width:280px;flex:none;border-left:1px solid ${C.border};display:flex;flex-direction:column}.context-panel>header{height:56px;flex:none;border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;padding:0 16px;font-size:13px}.context-panel header button{border:0;background:none;color:${C.muted};cursor:pointer}.context-scroll{overflow:auto;padding:0 16px 20px}.context-scroll section{padding:15px 0;border-bottom:1px solid ${C.border}}.context-scroll section:last-child{border-bottom:0}.context-scroll .section-label{margin:0 0 10px}.business-name{font-size:12px;display:flex;justify-content:space-between;gap:5px}.business-name span,.platform-row span{font-size:10px;color:${C.green};white-space:nowrap}.business-name p,.context-scroll section>p{font-size:11px;color:${C.muted};margin:5px 0 0}.platform-row{display:flex;align-items:center;gap:8px;color:${C.secondary};padding:7px 0;font-size:12px}.platform-row svg{color:${C.muted}.platform-row strong{font-weight:500}.platform-row span{margin-left:auto}.platform-row i{background:${C.green}!important}.select-control{width:100%;display:flex;align-items:center;gap:7px;border:1px solid ${C.border};background:${C.elevated};color:${C.secondary};border-radius:7px;padding:8px 9px;font-size:12px;cursor:pointer}.select-control svg:last-child{margin-left:auto}.context-kpi{display:flex;align-items:center;gap:6px;font-size:11px;padding:5px 0}.context-kpi span{color:${C.secondary};flex:1}.context-kpi strong{font-size:11px}.context-kpi em{font-style:normal;font-size:10px}.memory-card{background:${C.elevated};border-radius:8px;padding:10px}.memory-card strong{display:flex;align-items:center;gap:6px;font-size:11px}.memory-card strong svg{color:${C.soft}}.memory-card p{font-size:10px;color:${C.muted};line-height:15px;margin:7px 0}.memory-card a,.agent-card button,.knowledge-link{color:${C.soft};font-size:10px;text-decoration:none}.agent-card{display:flex;gap:9px;background:rgba(0,0,0,.08);border-left:3px solid ${C.violet};border-radius:7px;padding:11px}.agent-card>svg{color:${C.soft};flex:none}.agent-card strong{font-size:11px}.agent-card p{font-size:10px;line-height:15px;color:${C.muted};margin:5px 0}.agent-card button{border:0;background:none;padding:0;cursor:pointer}.knowledge-pill{display:flex;align-items:center;gap:7px;color:${C.secondary};font-size:11px;padding:7px 0}.knowledge-pill svg{color:${C.muted}}.knowledge-link{display:block;margin-top:5px}.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.7);display:grid;place-items:center;z-index:20}.confirm-dialog{position:relative;width:440px;background:${C.elevated};border:1px solid ${C.borderHover};border-radius:12px;padding:26px;box-shadow:0 24px 60px var(--muted-foreground)}.dialog-close{position:absolute;right:14px;top:14px;background:none;border:0;color:${C.muted};cursor:pointer}.confirm-dialog h2{font-size:18px;margin:0 0 7px}.confirm-dialog>p{color:${C.secondary};font-size:13px;margin:0 0 20px}.confirm-dialog dl{margin:0}.confirm-dialog dl div{display:flex;justify-content:space-between;border-top:1px solid ${C.border};padding:10px 0;font-size:12px}.confirm-dialog dt{color:${C.muted}}.confirm-dialog dd{margin:0;color:${C.text}}.dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.dialog-actions>button:first-child{background:none;border:1px solid ${C.borderHover};color:${C.secondary};border-radius:8px;padding:8px 13px;cursor:pointer}.dialog-actions .primary-btn{padding:8px 16px}@keyframes fadeSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}@keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(0,0,0,.6)}100%{box-shadow:0 0 0 8px rgba(0,0,0,0)}}.dots i{animation:bounce .9s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}@media (prefers-reduced-motion:reduce){.dots i,.mic.listening{animation:none}.dots i{transform:none}.message{animation:none}}@media(max-width:1180px){.left-nav{width:210px}.context-panel{width:245px}.connected-pill{display:none}}@media(max-width:900px){.left-nav{width:60px;padding-left:8px;padding-right:8px}.brand{padding:0;justify-content:center}.brand strong,.nav-item span,.section-label,.user-profile>span:not(.user-avatar),.user-profile>svg{display:none}.nav-item{justify-content:center;padding:9px}.nav-item.active{padding-left:7px}.history-rail{width:220px}.context-panel{display:none}.context-toggle{display:none}}@media(max-width:650px){.history-rail{display:none}.chat-header{padding:0 12px}.chat-heading .updated{display:none}.chat-heading strong{font-size:13px}.header-actions .primary-btn{font-size:0;padding:8px}.header-actions .primary-btn svg{margin:0}.messages{padding-left:14px;padding-right:14px}.prompt-grid{margin-left:0;grid-template-columns:repeat(2,1fr)}.composer-wrap{padding:10px}.kpi-row{grid-template-columns:1fr}.welcome h1{font-size:19px}}
`;

/* Lulu dropdown navigation — intentionally isolated from page content. */
const luluDropdownNavigation = [{
  "label": "Dashboard",
  "pages": [{
    "id": "fancily-leaf-1766",
    "label": "Executive Dashboard"
  }]
}, {
  "label": "AI",
  "pages": [{
    "id": "fresh-moon-5374",
    "label": "Assistant"
  }, {
    "id": "radiant-dusk-9079",
    "label": "Agents"
  }, {
    "id": "calmly-park-3313",
    "label": "Agent Marketplace"
  }, {
    "id": "rich-field-1880",
    "label": "Knowledge"
  }, {
    "id": "wondrously-second-5656",
    "label": "Actions"
  }, {
    "id": "sunny-moon-6307",
    "label": "Conversations"
  }, {
    "id": "sparkling-cave-8456",
    "label": "Activity"
  }]
}, {
  "label": "CRM",
  "pages": [{
    "id": "bright-meadow-7537",
    "label": "Overview"
  }, {
    "id": "sturdy-month-1562",
    "label": "Contacts"
  }, {
    "id": "kindly-pool-8785",
    "label": "Companies"
  }, {
    "id": "swift-hour-7844",
    "label": "Leads"
  }, {
    "id": "smartly-shade-4619",
    "label": "Deals"
  }, {
    "id": "calmly-cloud-9988",
    "label": "Pipeline"
  }, {
    "id": "cosmic-pool-1616",
    "label": "Activities"
  }, {
    "id": "deeply-noon-9539",
    "label": "Tasks"
  }, {
    "id": "sunnily-gulf-7520",
    "label": "Customer Segments"
  }, {
    "id": "gracefully-storm-2649",
    "label": "Customer Intelligence"
  }]
}, {
  "label": "Marketing",
  "pages": [{
    "id": "dreamily-soil-9290",
    "label": "Campaigns"
  }, {
    "id": "wondrous-cloud-1355",
    "label": "Content"
  }, {
    "id": "sparklingly-home-7386",
    "label": "Strategy"
  }, {
    "id": "gently-shade-2476",
    "label": "Campaigns"
  }, {
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "kind-time-4492",
    "label": "Keywords"
  }, {
    "id": "smartly-shore-1468",
    "label": "Competitors"
  }, {
    "id": "breezily-wood-5980",
    "label": "Audiences"
  }, {
    "id": "breezy-shore-6734",
    "label": "Analytics"
  }]
}, {
  "label": "Advertising",
  "pages": [{
    "id": "finely-garden-9221",
    "label": "Overview"
  }, {
    "id": "friendly-path-8200",
    "label": "Analytics"
  }, {
    "id": "wise-brook-1762",
    "label": "Campaigns"
  }, {
    "id": "softly-second-7684",
    "label": "Audiences"
  }, {
    "id": "happily-storm-2690",
    "label": "Creatives"
  }, {
    "id": "sunny-minute-1092",
    "label": "Budgets"
  }, {
    "id": "zesty-grass-9196",
    "label": "AI Optimization"
  }, {
    "id": "nicely-shade-2637",
    "label": "Tracking & Attribution"
  }, {
    "id": "nice-moon-2056",
    "label": "AI Campaign & Ad Builder"
  }, {
    "id": "sunnily-peak-7188",
    "label": "Publishing & Approval Center"
  }, {
    "id": "solid-sand-5563",
    "label": "AI Experiments & A/B Testing"
  }, {
    "id": "sunny-summer-2293",
    "label": "Ad Accounts & Platform Management"
  }]
}, {
  "label": "Intelligence",
  "pages": [{
    "id": "serene-cloud-7079",
    "label": "Intelligence Overview"
  }, {
    "id": "tender-water-4095",
    "label": "Executive Overview"
  }, {
    "id": "swiftly-cliff-4166",
    "label": "Business Health"
  }, {
    "id": "sharp-current-9677",
    "label": "Growth"
  }, {
    "id": "proudly-river-8017",
    "label": "Revenue"
  }, {
    "id": "dreamily-shade-6192",
    "label": "Customers"
  }, {
    "id": "nicely-hour-4035",
    "label": "Sales"
  }, {
    "id": "eagerly-winter-3152",
    "label": "Marketing"
  }, {
    "id": "sharply-wood-4560",
    "label": "Advertising Intelligence"
  }, {
    "id": "bold-ocean-5847",
    "label": "Ecommerce Intelligence"
  }, {
    "id": "cozily-path-5612",
    "label": "Finance Intelligence"
  }, {
    "id": "gently-light-6089",
    "label": "Operations Intelligence"
  }, {
    "id": "cool-town-1727",
    "label": "Products Intelligence"
  }, {
    "id": "swift-pool-5077",
    "label": "KPI Explorer"
  }, {
    "id": "friendly-ground-4157",
    "label": "Reports"
  }, {
    "id": "brave-stream-5322",
    "label": "Comparisons"
  }, {
    "id": "sparkling-time-5280",
    "label": "Comparisons"
  }, {
    "id": "wispy-current-7490",
    "label": "Forecasts"
  }, {
    "id": "kindly-year-8981",
    "label": "Benchmarks"
  }, {
    "id": "serenely-creek-1765",
    "label": "Trends"
  }, {
    "id": "sparklingly-light-7230",
    "label": "Anomalies"
  }, {
    "id": "clever-soil-5964",
    "label": "Attribution"
  }, {
    "id": "serenely-week-1771",
    "label": "AI Insights"
  }, {
    "id": "daring-home-4179",
    "label": "AI Recommendations"
  }, {
    "id": "wispy-leaf-3778",
    "label": "AI Tasks"
  }, {
    "id": "happily-brook-7061",
    "label": "Opportunities"
  }, {
    "id": "radiant-cave-9340",
    "label": "Decisions"
  }, {
    "id": "boldly-time-5189",
    "label": "Risk Center"
  }, {
    "id": "proud-rain-4772",
    "label": "Activity Timeline"
  }]
}, {
  "label": "Ecommerce",
  "pages": [{
    "id": "smart-ocean-3898",
    "label": "Overview"
  }, {
    "id": "nice-year-6253",
    "label": "Stores"
  }, {
    "id": "nicely-ocean-1051",
    "label": "Products"
  }, {
    "id": "richly-forest-5832",
    "label": "Categories"
  }, {
    "id": "mightily-shore-7108",
    "label": "Orders"
  }, {
    "id": "fancy-ground-8040",
    "label": "Customers"
  }, {
    "id": "serenely-sand-9226",
    "label": "Carts"
  }, {
    "id": "smart-village-1099",
    "label": "Inventory"
  }, {
    "id": "dreamy-shade-5445",
    "label": "Returns & Refunds"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
    "id": "sharply-sky-4161",
    "label": "Discounts & Promotions"
  }, {
    "id": "wildly-time-4260",
    "label": "Carts & Abandoned Carts"
  }, {
    "id": "quietly-moon-4186",
    "label": "Shipping"
  }, {
    "id": "merry-castle-3260",
    "label": "Payments"
  }, {
    "id": "merry-cliff-8846",
    "label": "Coupons"
  }, {
    "id": "safely-dawn-7731",
    "label": "Subscriptions"
  }, {
    "id": "purely-dusk-2409",
    "label": "Shipping & Fulfillment"
  }, {
    "id": "soft-hill-4757",
    "label": "Taxes"
  }, {
    "id": "safely-air-9334",
    "label": "Collections"
  }, {
    "id": "merry-land-6169",
    "label": "Store Performance"
  }]
}, {
  "label": "Finance",
  "pages": [{
    "id": "quietly-stone-4158",
    "label": "Overview"
  }, {
    "id": "breezy-soil-2475",
    "label": "Invoices"
  }, {
    "id": "tender-creek-3139",
    "label": "Offers & Quotes"
  }, {
    "id": "cool-rain-6499",
    "label": "Income"
  }, {
    "id": "richly-land-8084",
    "label": "Transactions"
  }, {
    "id": "calm-tide-3752",
    "label": "Payments"
  }, {
    "id": "zesty-earth-3938",
    "label": "Expenses"
  }, {
    "id": "bravely-bay-4544",
    "label": "Customers"
  }, {
    "id": "eager-minute-1586",
    "label": "Vendors"
  }, {
    "id": "fair-bridge-8618",
    "label": "Accounts"
  }, {
    "id": "soft-town-3284",
    "label": "Cash Flow"
  }, {
    "id": "wisely-gate-3183",
    "label": "Budgets"
  }, {
    "id": "sharp-morning-7310",
    "label": "Financial Planning"
  }, {
    "id": "sparklingly-city-3338",
    "label": "Reconciliation"
  }, {
    "id": "radiant-hour-5376",
    "label": "Recurring Revenue"
  }, {
    "id": "lucky-park-8649",
    "label": "Payouts"
  }, {
    "id": "vibrantly-second-9428",
    "label": "Financial Automation"
  }, {
    "id": "sturdy-week-3372",
    "label": "Taxes"
  }, {
    "id": "boldly-field-4971",
    "label": "Finance Settings"
  }]
}, {
  "label": "Sales",
  "pages": [{
    "id": "fine-park-8079",
    "label": "Overview"
  }, {
    "id": "softly-autumn-9038",
    "label": "Leads"
  }, {
    "id": "wildly-sun-6424",
    "label": "Opportunities"
  }, {
    "id": "deeply-month-1392",
    "label": "Deals"
  }, {
    "id": "sweet-evening-7753",
    "label": "Pipeline"
  }, {
    "id": "warmly-road-3804",
    "label": "Activities"
  }, {
    "id": "wondrously-gate-2200",
    "label": "Tasks"
  }, {
    "id": "sharp-cliff-6925",
    "label": "Customer Segments"
  }, {
    "id": "lovingly-shore-4782",
    "label": "Forecast"
  }, {
    "id": "rich-moon-9195",
    "label": "Reports"
  }, {
    "id": "lively-house-6788",
    "label": "Commissions"
  }, {
    "id": "gentle-cliff-7133",
    "label": "Goals"
  }, {
    "id": "kindly-morning-7115",
    "label": "Territories"
  }, {
    "id": "friendly-tower-1528",
    "label": "Lead Assignment"
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
  }]
}, {
  "label": "Integrations",
  "pages": [{
    "id": "glad-coast-1428",
    "label": "Integrations"
  }]
}, {
  "label": "Billing",
  "pages": [{
    "id": "pure-minute-5446",
    "label": "Billing"
  }]
}] as const;
function LuluSectionNavigation({
  activeId
}: {
  activeId: string;
}) {
  return <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Lulu AI sections">
    {luluDropdownNavigation.map(section => {
      const isActiveSection = section.pages.some(page => page.id === activeId);
      return <details key={section.label} open={isActiveSection} className="group rounded-lg">
        <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm transition [&::-webkit-details-marker]:hidden ${isActiveSection ? 'bg-secondary/15 font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
          <span>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
