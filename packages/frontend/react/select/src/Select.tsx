import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import type { SelectOption, SelectProps } from "./types";

function join(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function normalizeValue(value: string | string[] | undefined, multiple: boolean): string | string[] {
  if (multiple) return Array.isArray(value) ? value.map(String) : value == null || value === "" ? [] : [String(value)];
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}

export function Select({
  mode = "single",
  options: inputOptions = [],
  value: controlledValue,
  defaultValue,
  onValueChange,
  onChange,
  loadOptions,
  onSearchChange,
  searchable = false,
  allowCustomValue = false,
  placeholder = "请选择",
  searchPlaceholder = "搜索选项…",
  emptyMessage = "没有匹配选项",
  loadingMessage = "正在加载…",
  errorMessage = "加载失败",
  label,
  name,
  id,
  disabled = false,
  required = false,
  clearable = false,
  closeOnSelect = false,
  maxSelectedLabels = 2,
  className,
  classNames,
  appearance = "default",
  variant = "classic",
  icons,
  style,
  renderOption,
}: SelectProps) {
  const multiple = mode === "multiple";
  const combobox = mode === "combobox";
  const generatedId = useId().replace(/:/g, "");
  const controlId = id ?? `common-select-${generatedId}`;
  const listboxId = `${controlId}-listbox`;
  const searchId = `${controlId}-search`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[]>(normalizeValue(defaultValue, multiple));
  const currentValue = normalizeValue(isControlled ? controlledValue : internalValue, multiple);
  const selectedValues = multiple ? currentValue as string[] : [currentValue as string];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loadedOptions, setLoadedOptions] = useState<SelectOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sourceOptions = loadOptions ? loadedOptions ?? inputOptions : inputOptions;
  const visibleOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery || loadOptions) return sourceOptions;
    return sourceOptions.filter((option) =>
      [option.label, option.group ?? "", ...(option.keywords ?? [])]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [loadOptions, query, sourceOptions]);
  const selectedOptions = [...inputOptions, ...sourceOptions]
    .filter((option, index, all) => all.findIndex((candidate) => String(candidate.value) === String(option.value)) === index)
    .filter((option) => selectedValues.includes(String(option.value)));

  useEffect(() => {
    if (!open || !loadOptions) return;
    const currentRequest = ++requestId.current;
    setLoading(true);
    setLoadError(false);
    loadOptions(query)
      .then((nextOptions) => {
        if (requestId.current === currentRequest) setLoadedOptions(nextOptions);
      })
      .catch(() => {
        if (requestId.current === currentRequest) setLoadError(true);
      })
      .finally(() => {
        if (requestId.current === currentRequest) setLoading(false);
      });
    return () => {
      requestId.current += 1;
    };
  }, [loadOptions, open, query]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open && searchable && !combobox) inputRef.current?.focus();
  }, [combobox, open, searchable]);

  useEffect(() => {
    if (visibleOptions[activeIndex] && !visibleOptions[activeIndex].disabled) return;
    const firstEnabledIndex = visibleOptions.findIndex((option) => !option.disabled);
    if (firstEnabledIndex >= 0 && firstEnabledIndex !== activeIndex) setActiveIndex(firstEnabledIndex);
  }, [activeIndex, visibleOptions]);

  const emitValue = (next: string | string[]) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
    onChange?.(next);
  };

  const openPopup = () => {
    if (disabled) return;
    setQuery("");
    const selectedIndex = sourceOptions.findIndex((option) => selectedValues.includes(String(option.value)) && !option.disabled);
    const firstEnabledIndex = sourceOptions.findIndex((option) => !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : Math.max(0, firstEnabledIndex));
    setOpen(true);
  };

  const closePopup = (restoreFocus = false) => {
    setOpen(false);
    if (combobox) setQuery("");
    if (restoreFocus) requestAnimationFrame(() => (combobox ? inputRef.current : triggerRef.current)?.focus());
  };

  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    const optionValue = String(option.value);
    if (multiple) {
      const selected = selectedValues.includes(optionValue);
      emitValue(selected ? selectedValues.filter((item) => item !== optionValue) : [...selectedValues, optionValue]);
      if (closeOnSelect) closePopup(true);
      return;
    }
    emitValue(optionValue);
    closePopup(true);
  };

  const moveActive = (direction: 1 | -1) => {
    if (!visibleOptions.length) return;
    setActiveIndex((current) => {
      for (let offset = 1; offset <= visibleOptions.length; offset += 1) {
        const candidate = (current + direction * offset + visibleOptions.length) % visibleOptions.length;
        if (!visibleOptions[candidate]?.disabled) return candidate;
      }
      return current;
    });
  };

  const commitCustomValue = () => {
    const customValue = query.trim();
    if (!allowCustomValue || !customValue) return;
    emitValue(customValue);
    closePopup(true);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setActiveIndex(0);
    onSearchChange?.(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        closePopup(true);
      }
      return;
    }
    if ((event.target as HTMLElement).closest(".cc-select__clear, .cc-select__footer")) return;
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openPopup();
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      moveActive(direction);
    } else if (event.key === "Home" && !combobox) {
      event.preventDefault();
      setActiveIndex(Math.max(0, visibleOptions.findIndex((option) => !option.disabled)));
    } else if (event.key === "End" && !combobox) {
      event.preventDefault();
      setActiveIndex(visibleOptions.reduce((last, option, index) => option.disabled ? last : index, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = visibleOptions[activeIndex];
      if (option) choose(option);
      else commitCustomValue();
    } else if (event.key === "Tab") {
      closePopup();
    }
  };

  const selectedLabel = multiple
    ? selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length > maxSelectedLabels
        ? `已选 ${selectedOptions.length} 项`
        : selectedOptions.map((option) => option.label).join("、")
    : selectedOptions[0]?.label ?? (combobox && typeof currentValue === "string" ? currentValue : placeholder);

  const optionList = (
    <div id={listboxId} className="cc-select__listbox" role="listbox" aria-label={label ?? placeholder} aria-multiselectable={multiple || undefined}>
      {visibleOptions.map((option, index) => {
        const optionValue = String(option.value);
        const selected = selectedValues.includes(optionValue);
        const active = index === activeIndex;
        const previousGroup = visibleOptions[index - 1]?.group;
        return (
          <span className="cc-select__option-wrap" key={optionValue}>
            {option.group && option.group !== previousGroup && <span className="cc-select__group">{option.group}</span>}
            <button
              id={`${controlId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={selected}
              aria-disabled={option.disabled || undefined}
              disabled={option.disabled}
              className={join("cc-select__option", classNames?.option)}
              data-active={active || undefined}
              data-selected={selected || undefined}
              onMouseEnter={() => { if (!option.disabled) setActiveIndex(index); }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
            >
              {renderOption?.(option, { selected, active }) ?? <>
                <span className="cc-select__option-label">{option.label}</span>
                <span className="cc-select__check" aria-hidden="true">{selected ? icons?.check ?? "✓" : ""}</span>
              </>}
            </button>
          </span>
        );
      })}
      {!loading && !loadError && visibleOptions.length === 0 && (
        <div className={join("cc-select__empty", classNames?.empty)} role="status">{emptyMessage}</div>
      )}
      {loading && <div className="cc-select__status" role="status">{loadingMessage}</div>}
      {loadError && <div className="cc-select__status cc-select__status--error" role="alert">{errorMessage}</div>}
      {allowCustomValue && combobox && query.trim() && !visibleOptions.some((option) => option.value === query.trim()) && (
        <button type="button" className="cc-select__option cc-select__create" role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={commitCustomValue}>
          使用“{query.trim()}”
        </button>
      )}
    </div>
  );

  return (
    <div ref={rootRef} data-appearance={appearance} data-variant={appearance === "default" ? variant : undefined} className={join("cc-select", `cc-select--${mode}`, className, classNames?.root)} style={style} onKeyDown={handleKeyDown}>
      {name && <input type="hidden" name={name} value={multiple ? (currentValue as string[]).join(",") : currentValue as string} disabled={disabled} />}
      {combobox ? (
        <div className="cc-select__combobox-shell">
          <input
            ref={inputRef}
            id={controlId}
            role="combobox"
            aria-label={label ?? placeholder}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={open && visibleOptions[activeIndex] ? `${controlId}-option-${activeIndex}` : undefined}
            aria-required={required || undefined}
            value={open ? query : selectedLabel === placeholder ? "" : selectedLabel}
            placeholder={placeholder}
            disabled={disabled}
            className={join("cc-select__trigger cc-select__input", classNames?.trigger)}
            onFocus={() => { if (!disabled) setOpen(true); }}
            onChange={handleSearchChange}
          />
          {clearable && currentValue && <button type="button" className="cc-select__clear" aria-label="清除选择" onClick={() => { emitValue(""); setQuery(""); inputRef.current?.focus(); }}>{icons?.clear ?? "×"}</button>}
          <span className="cc-select__chevron" aria-hidden="true">{icons?.chevron ?? "⌄"}</span>
        </div>
      ) : (
        <div className="cc-select__button-shell"><button
          ref={triggerRef}
          id={controlId}
          type="button"
          className={join("cc-select__trigger", clearable && selectedOptions.length > 0 ? "cc-select__trigger--clearable" : undefined, classNames?.trigger)}
          disabled={disabled}
          role="combobox"
          aria-label={label ?? placeholder}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-required={required || undefined}
          onClick={() => open ? closePopup() : openPopup()}
        >
          <span className={join("cc-select__value", selectedOptions.length === 0 && "cc-select__placeholder", classNames?.value)}>
            {multiple && selectedOptions.length > 0 && selectedOptions.length <= maxSelectedLabels
              ? <span className="cc-select__tags">{selectedOptions.map((option) => <span className="cc-select__tag" key={option.value}>{option.label}</span>)}</span>
              : selectedLabel}
          </span>
          <span className="cc-select__chevron" aria-hidden="true">{icons?.chevron ?? "⌄"}</span>
        </button>{clearable && selectedOptions.length > 0 && !disabled && <button type="button" className="cc-select__clear cc-select__clear--button" aria-label="清除选择" onClick={() => { emitValue(multiple ? [] : ""); setQuery(""); closePopup(true); }}>{icons?.clear ?? "×"}</button>}</div>
      )}
      {open && (
        <div className={join("cc-select__popup", classNames?.popup)}>
          {searchable && !combobox && (
            <input ref={inputRef} id={searchId} type="search" className={join("cc-select__search", classNames?.search)} value={query} placeholder={searchPlaceholder} aria-label={`搜索${label ?? "选项"}`} aria-controls={listboxId} aria-activedescendant={visibleOptions[activeIndex] ? `${controlId}-option-${activeIndex}` : undefined} onChange={handleSearchChange} />
          )}
          {optionList}
          {multiple && <div className={join("cc-select__footer", classNames?.footer)}>
            <button type="button" onClick={() => emitValue([])}>清空</button>
            <button type="button" onClick={() => closePopup(true)}>完成</button>
          </div>}
        </div>
      )}
    </div>
  );
}

export default Select;
