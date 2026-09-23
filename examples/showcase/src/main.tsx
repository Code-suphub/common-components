import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button as AntButton, ConfigProvider, Input as AntInput, Select as AntSelect } from "antd";
import { ArrowDown, ArrowUpDown, Check, ChevronDown, Command, Github, Layers3, SlidersHorizontal, Sparkles } from "lucide-react";
import { createCommonAntdTheme } from "@local/common-components/react/antd";
import { Select, type SelectOption, type SelectVariant } from "@local/common-components/react/select";
import { DataTable, type DataTableColumn } from "@local/common-components/react/table";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Field, FieldLabel, Input, Skeleton, Spinner, Switch, Textarea } from "@local/common-components/react/ui";
import "@local/common-components/react/select/styles.css";
import "@local/common-components/react/table/styles.css";
import "@local/common-components/react/ui/styles.css";
import "antd/dist/reset.css";
import "./style.css";

type Section = "select" | "table" | "primitives" | "antd";
type Asset = { id: string; symbol: string; name: string; category: string; value: number; change: number };

const options: SelectOption[] = [
  { value: "vti", label: "Vanguard 全市场 ETF", group: "美股", keywords: ["VTI"] },
  { value: "voo", label: "标普 500 ETF", group: "美股", keywords: ["VOO"] },
  { value: "510300", label: "沪深 300 ETF", group: "A 股" },
  { value: "bond", label: "中短债组合", group: "固收" },
  { value: "cash", label: "现金管理", group: "现金" },
  { value: "disabled", label: "已停用资产", group: "其他", disabled: true },
];

const allAssets: Asset[] = [
  { id: "1", symbol: "VTI", name: "Vanguard 全市场 ETF", category: "全球股票", value: 426800, change: 1.24 },
  { id: "2", symbol: "510300", name: "沪深 300 ETF", category: "指数基金", value: 318400, change: -0.42 },
  { id: "3", symbol: "AGG", name: "iShares 核心债券 ETF", category: "债券", value: 246100, change: 0.08 },
  { id: "4", symbol: "CASH", name: "现金管理", category: "现金", value: 82100, change: 0.01 },
];

const variants: SelectVariant[] = ["classic", "soft", "outline", "filled", "pill", "compact", "dark", "minimal"];
const formatMoney = (value: number) => `¥ ${value.toLocaleString("en-US")}`;

function App() {
  const [section, setSection] = useState<Section>("select");
  const [query, setQuery] = useState("");
  const [single, setSingle] = useState("vti");
  const [multi, setMulti] = useState<string[]>(["510300", "bond"]);
  const [custom, setCustom] = useState<string[]>(["11", "22"]);
  const [variant, setVariant] = useState<SelectVariant>("soft");
  const [sortColumn, setSortColumn] = useState<string | null>("value");
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending" | null>("descending");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string[]>([]);
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns: DataTableColumn<Asset>[] = useMemo(() => [
    { id: "name", header: "资产", cell: (asset) => <span className="asset-cell"><strong>{asset.name}</strong><small>{asset.symbol}</small></span> },
    { id: "category", header: "类别", cell: (asset) => asset.category, filter: { label: "筛选类别", options: [...new Set(allAssets.map((asset) => asset.category))].map((value) => ({ value, label: value })), selectedValues: filter, onSelectedValuesChange: (next) => { setFilter(next); setPage(1); } } },
    { id: "value", header: "市值", align: "right", sortable: true, cell: (asset) => formatMoney(asset.value) },
    { id: "change", header: "今日变化", align: "right", sortable: true, cell: (asset) => <span className={asset.change >= 0 ? "positive" : "negative"}>{asset.change > 0 ? "+" : ""}{asset.change.toFixed(2)}%</span> },
  ], [filter]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allAssets.filter((asset) => {
      const matchesQuery = !normalized || `${asset.name} ${asset.symbol} ${asset.category}`.toLowerCase().includes(normalized);
      return matchesQuery && (!filter.length || filter.includes(asset.category));
    });
  }, [query, filter]);

  const sorted = useMemo(() => {
    if (!sortColumn || !sortDirection) return filtered;
    return [...filtered].sort((a, b) => {
      const left = a[sortColumn as keyof Asset];
      const right = b[sortColumn as keyof Asset];
      const result = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
      return sortDirection === "ascending" ? result : -result;
    });
  }, [filtered, sortColumn, sortDirection]);

  const pageSize = 3;
  const visibleRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const navigate = (next: Section) => {
    setSection(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="atelier-shell">
    <aside className="rail">
      <a className="brand-mark" href="#top" aria-label="Common Components"><span>c.</span></a>
      <div className="rail-divider" />
      {([...["select", "table", "primitives", "antd"]] as Section[]).map((id, index) => {
        const names = ["Select", "DataTable", "Primitives", "Ant Design"];
        const icons = [<SlidersHorizontal />, <Layers3 />, <Command />, <Sparkles />];
        return <button key={id} className={`rail-link ${section === id ? "is-active" : ""}`} onClick={() => navigate(id)} aria-label={names[index]} title={names[index]}>{icons[index]}<span>{String(index + 1).padStart(2, "0")}</span></button>;
      })}
      <div className="rail-bottom"><a href="https://github.com/Code-suphub/common-components" aria-label="GitHub"><Github /></a><span>v0.1</span></div>
    </aside>

    <main id="top" className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>COMMON COMPONENTS</span><i>/</i><b>ATELIER</b></div><div className="live-indicator"><span />INTERACTIVE PREVIEW</div></header>
      <section className="intro">
        <div className="intro-copy"><div className="eyebrow"><Sparkles size={13} /> COMPONENT LIBRARY <span>— 2026</span></div><h1>Build with<br /><em>good pieces.</em></h1><p>组件不只是截图。试试交互、切换状态，感受每个公共构件的真实行为。</p></div>
        <div className="intro-art" aria-hidden="true"><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-core"><span>c.</span></div><div className="art-caption">A SMALL SYSTEM<br />FOR REAL WORK</div></div>
      </section>

      <nav className="section-nav" aria-label="组件分类">
        {(["select", "table", "primitives", "antd"] as Section[]).map((id, index) => <button key={id} onClick={() => navigate(id)} className={section === id ? "selected" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{["选择器", "数据表格", "基础控件", "Ant Design 主题"][index]}<ChevronDown size={14} /></button>)}
      </nav>

      <section className="content-section">
        {section === "select" && <>
          <SectionHeading number="01" kicker="CHOOSE WELL" title="选择器" description="单选、多选、自由输入。相同的数据接口，覆盖不同的选择场景。" />
          <div className="showcase-toolbar"><div><span className="status-dot"/> LIVE COMPONENT <span className="divider-slash">/</span> <code>react/select</code></div><label>外观预设 <select value={variant} onChange={(event) => setVariant(event.target.value as SelectVariant)}>{variants.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>
          <div className="select-grid">
            <DemoCard index="A" title="单选 + 搜索" note="SEARCHABLE · SINGLE"><Select label="选择资产" variant={variant} searchable options={options} value={single} onValueChange={(value) => setSingle(value as string)} clearable /></DemoCard>
            <DemoCard index="B" title="多选 + Tag" note="MULTIPLE · CLEARABLE"><Select label="选择多个资产" variant={variant} mode="multiple" searchable options={options} value={multi} onValueChange={(value) => setMulti(value as string[])} placeholder="添加资产" clearable /></DemoCard>
            <DemoCard index="C" title="自由输入" note="COMBOBOX · CUSTOM VALUE"><Select label="输入或选择代码" variant={variant} mode="combobox" options={options} value={custom.join(",")} onValueChange={(value) => setCustom(String(value).split(",").filter(Boolean))} allowCustomValue placeholder="搜索或输入代码" clearable /></DemoCard>
            <DemoCard index="D" title="禁用状态" note="DISABLED OPTION"><Select label="部分选项禁用" variant={variant} options={options} defaultValue="disabled" disabled /></DemoCard>
          </div>
          <div className="variant-strip"><div><span>STYLE COLLECTION</span><b>{variants.length} curated variants</b></div><div className="variant-pills">{variants.map((item) => <button className={variant === item ? "active" : ""} key={item} onClick={() => setVariant(item)}>{item}</button>)}</div></div>
          <CodeNote>从 <code>@local/common-components/react/select</code> 导入。CSS 主题可切换预设；数据仍由调用方控制。</CodeNote>
        </>}

        {section === "table" && <>
          <SectionHeading number="02" kicker="MAKE SENSE OF DATA" title="数据表格" description="搜索、筛选、排序和分页都受控。数据怎么来，由你的应用决定。" />
          <div className="showcase-toolbar"><div><span className="status-dot"/> LIVE COMPONENT <span className="divider-slash">/</span> <code>react/table</code></div><span className="toolbar-hint"><ArrowUpDown size={14}/> 点击列头排序 · 类别图标筛选</span></div>
          <div className="table-frame"><DataTable label="投资资产" rows={visibleRows} columns={columns} rowKey={(row) => row.id} search={{ value: query, onValueChange: (value) => { setQuery(value); setPage(1); }, placeholder: "搜索资产名称或代码", ariaLabel: "搜索资产" }} sort={{ columnId: sortColumn, direction: sortDirection, onChange: (id, direction) => { setSortColumn(direction ? id : null); setSortDirection(direction); } }} pagination={{ page, pageSize, total: sorted.length, onPageChange: setPage }} footerNote={<span className="table-foot-note"><span className="status-dot"/> 数据由本地演示集提供 · {filtered.length} 项符合当前条件</span>} /></div>
          <CodeNote>DataTable 不请求、不修改数据；本地过滤、远程 API 或缓存策略都留在调用方。</CodeNote>
        </>}

        {section === "primitives" && <>
          <SectionHeading number="03" kicker="THE EVERYDAY SET" title="基础控件" description="表单里的日常零件：输入、反馈、状态与动作，保持同一套视觉语言。" />
          <div className="primitive-grid">
            <DemoCard index="A" title="输入与表单字段" note="INPUT · FIELD · TEXTAREA"><div className="stacked-controls"><Field><FieldLabel htmlFor="atelier-email">联系邮箱</FieldLabel><Input id="atelier-email" type="email" placeholder="name@example.com" /></Field><Field><FieldLabel htmlFor="atelier-note">备注</FieldLabel><Textarea id="atelier-note" placeholder="补充一些信息…" /></Field></div></DemoCard>
            <DemoCard index="B" title="动作按钮" note="VARIANTS · LOADING · DISABLED"><div className="button-gallery"><Button variant="primary">保存更改</Button><Button variant="secondary">取消</Button><Button variant="outline">查看详情</Button><Button variant="ghost">更多选项</Button><Button variant="danger">删除记录</Button><Button variant="primary" loading>正在保存</Button><Button variant="outline" disabled>不可用</Button></div></DemoCard>
            <DemoCard index="C" title="状态与选择" note="CHECKBOX · SWITCH · BADGE"><div className="state-gallery"><label><Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} /> <span>邮件通知</span></label><label><Switch checked={switchOn} onChange={(event) => setSwitchOn(event.target.checked)} /> <span>自动同步</span></label><div className="badge-gallery"><Badge>默认</Badge><Badge variant="success">已完成</Badge><Badge variant="warning">待处理</Badge><Badge variant="danger">需关注</Badge></div></div></DemoCard>
            <DemoCard index="D" title="反馈与容器" note="SKELETON · SPINNER · DIALOG"><div className="feedback-gallery"><Spinner /><Skeleton className="skeleton-line" /><Button variant="outline" onClick={() => setDialogOpen(true)}>打开确认弹窗</Button>{dialogOpen && <div className="dialog-scrim" role="presentation" onClick={() => setDialogOpen(false)}><div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onClick={(event) => event.stopPropagation()}><span className="eyebrow">CONFIRM ACTION</span><h3 id="dialog-title">继续保存更改？</h3><p>这是公共 Dialog 的交互预览。</p><div><Button variant="ghost" onClick={() => setDialogOpen(false)}>返回</Button><Button variant="primary" onClick={() => setDialogOpen(false)}>确定</Button></div></div></div>}</div></DemoCard>
          </div>
          <CodeNote>基础组件保留 HTML 表单语义和受控状态；表单校验编排仍属于具体应用。</CodeNote>
        </>}

        {section === "antd" && <>
          <SectionHeading number="04" kicker="SHARED THEME TOKENS" title="Ant Design 主题" description="基础组件直接使用 AntD。公共包只统一 Token，不复制它庞大的组件 API。" />
          <div className="showcase-toolbar"><div><span className="status-dot"/> ANTD CONFIGPROVIDER <span className="divider-slash">/</span> <code>commonAntdTheme</code></div><span className="toolbar-hint">共享默认值 · 调用方可局部覆盖</span></div>
          <ConfigProvider theme={createCommonAntdTheme()}><div className="antd-preview"><div className="antd-preview-head"><div><span className="eyebrow">LIVE ANTD COMPONENTS</span><h3>熟悉的组件，共享的底色。</h3><p>真实 ConfigProvider + Input + Select + Button</p></div><div className="antd-swatch"><span/><code>{createCommonAntdTheme().token.colorPrimary}</code></div></div><div className="antd-controls"><AntInput placeholder="输入名称" /><AntSelect defaultValue="vti" options={options.filter((option) => !option.disabled).map(({ value, label }) => ({ value, label }))} /><AntButton type="primary"><Check size={15}/> 主要操作</AntButton><AntButton>次要操作</AntButton></div><div className="token-list">{Object.entries(createCommonAntdTheme().token).slice(0, 8).map(([key, value]) => <div key={key}><span>{key}</span><code>{value}</code></div>)}</div></div></ConfigProvider>
          <CodeNote>引入 <code>createCommonAntdTheme()</code>，并直接用 AntD 的 <code>ConfigProvider</code> 包裹页面或应用。</CodeNote>
        </>}
      </section>

      <footer className="page-footer"><span>COMMON COMPONENTS <i>·</i> COMPONENT ATELIER</span><span>MADE TO BE REUSED <b>↗</b></span></footer>
    </main>
  </div>;
}

function SectionHeading({ number, kicker, title, description }: { number: string; kicker: string; title: string; description: string }) {
  return <div className="section-heading"><div className="section-index">{number}<span>—</span></div><div><span className="eyebrow">{kicker}</span><h2>{title}</h2><p>{description}</p></div></div>;
}

function DemoCard({ index, title, note, children }: { index: string; title: string; note: string; children: React.ReactNode }) {
  return <Card className="demo-card"><CardHeader><div className="demo-title"><span>{index}</span><div><CardTitle>{title}</CardTitle><CardDescription>{note}</CardDescription></div></div><ArrowDown size={15}/></CardHeader><CardContent>{children}</CardContent></Card>;
}

function CodeNote({ children }: { children: React.ReactNode }) {
  return <div className="code-note"><span>NOTE</span><p>{children}</p></div>;
}

createRoot(document.getElementById("root")!).render(<App />);
