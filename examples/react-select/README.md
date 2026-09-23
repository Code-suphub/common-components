# Select 示例

```tsx
import { useState } from "react";
import { Select, type SelectOption } from "@local/common-components/react/select";
import "@local/common-components/react/select/styles.css";

const options: SelectOption[] = [
  { value: "daily", label: "日常账户" },
  { value: "broker", label: "证券账户" },
];

export function Example() {
  const [account, setAccount] = useState<string | string[]>("");
  return <Select options={options} value={account} onValueChange={setAccount} label="账户" />;
}
```
