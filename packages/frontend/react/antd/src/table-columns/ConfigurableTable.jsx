import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Checkbox, Popover, Table } from 'antd';
import { columnIsVisible, columnStorageKey, readColumnPreferences } from './preferences.js';
import './styles.css';

function columnLabel(column, key) {
  return column.columnLabel || (typeof column.title === 'string' ? column.title : column.title?.props?.label) || key;
}

/** Thin AntD adapter. Business rendering, filters, sorting and pagination stay native. */
export function ConfigurableTable(props) {
  return <ConfiguredTableContent key={props.tableId} {...props} />;
}

function ConfiguredTableContent({ tableId, columns = [], defaultHiddenColumns = [], requiredColumns = [], columnTools, toolbarTarget, ...tableProps }) {
  const [preferences, setPreferences] = useState(() => readColumnPreferences(() => window.localStorage, tableId));
  const [open, setOpen] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector('input:not(:disabled)')?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  const choices = columns.map((column, index) => {
    const key = String(column.key ?? column.dataIndex ?? index);
    const required = index === 0 || requiredColumns.includes(key);
    const filtered = Boolean(column.filteredValue?.length);
    return { key, label: columnLabel(column, key), required, filtered, visible: filtered || columnIsVisible(preferences, key, defaultHiddenColumns, required), column };
  });
  const visibleColumns = choices.filter(choice => choice.visible).map(choice => {
    const { columnLabel: _label, ...column } = choice.column;
    return column;
  });
  function save(next, reset = false) {
    setPreferences(next);
    try {
      if (reset) window.localStorage.removeItem(columnStorageKey(tableId));
      else window.localStorage.setItem(columnStorageKey(tableId), JSON.stringify(next));
      setStorageError(false);
    } catch { setStorageError(true); }
  }
  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const width = visibleColumns.every(column => Number.isFinite(column.width)) ? visibleColumns.reduce((sum, column) => sum + column.width, 0) : undefined;
  const popup = <div ref={panelRef} className="fb-column-settings-panel" role="dialog" aria-label="选择显示的列" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); } }}>
    <div className="fb-column-settings-heading"><strong>显示列</strong><Button type="text" aria-label="关闭列设置" onClick={close}>×</Button></div>
    <div className="fb-column-settings-options">{choices.map(choice => <Checkbox key={choice.key} checked={choice.visible} disabled={choice.required || choice.filtered} onChange={event => save({ ...preferences, [choice.key]: event.target.checked })}>{choice.label}{choice.required ? <small>必选</small> : choice.filtered ? <small>筛选中</small> : null}</Checkbox>)}</div>
    <div className="fb-column-settings-actions"><Button onClick={() => save(Object.fromEntries(choices.map(choice => [choice.key, true])))}>显示全部</Button><Button onClick={() => save({}, true)}>恢复默认</Button></div>
    <small role={storageError ? 'status' : undefined}>{storageError ? '当前浏览器无法保存，刷新后将恢复默认。' : '设置仅保存在当前浏览器。'}</small>
  </div>;
  const toolbar = <div className={`fb-column-toolbar${toolbarTarget ? ' is-external' : ''}`}>{columnTools}<Popover open={open} onOpenChange={setOpen} trigger="click" placement="bottomRight" align={{overflow:{shiftX:true,shiftY:true}}} content={popup} styles={{container:{padding:12}}}>
      <Button type="text" ref={triggerRef} className="fb-column-settings-trigger" aria-label="设置显示列" aria-expanded={open} aria-haspopup="dialog" style={{minHeight:44,height:44,padding:'8px 10px',fontSize:12}}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="currentColor"/><path d="M6 3v10m4-10v10" stroke="currentColor"/></svg>显示列</Button>
    </Popover></div>;
  return <div className="fb-configurable-table">
    {toolbarTarget ? createPortal(toolbar, toolbarTarget) : toolbar}
    <Table {...tableProps} columns={visibleColumns} scroll={width ? {...tableProps.scroll,x:width} : tableProps.scroll} onChange={(pagination, filters, sorter, extra) => {
      const hiddenFilters = Object.fromEntries(choices.filter(choice => !choice.visible && choice.column.filteredValue).map(choice => [choice.key, choice.column.filteredValue]));
      tableProps.onChange?.(pagination, {...hiddenFilters,...filters}, sorter, extra);
    }} />
  </div>;
}
