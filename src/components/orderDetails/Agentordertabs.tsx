import { Rb_Button } from "@rentbook/rentbook-ui-lib";

export type OrderTab<TKey extends string> = {
  key: TKey;
  label: string;
};

type AgentOrderTabsProps<TKey extends string> = {
  tabs: readonly OrderTab<TKey>[];
  activeTab: TKey;
  counts: Partial<Record<TKey, number>>;
  onChange: (key: TKey) => void;
};

export function AgentOrderTabs<TKey extends string>({
  tabs,
  activeTab,
  counts,
  onChange,
}: AgentOrderTabsProps<TKey>) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key] ?? 0;

        return (
          <Rb_Button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`
              inline-flex h-9 min-w-fit items-center
              justify-center gap-2 rounded-full
              px-3 py-0 text-xs font-medium
              whitespace-nowrap sm:text-sm
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
              }
            `}
          >
            <span>{tab.label}</span>

           <span
  className={`
    rounded-full px-2 py-0.5
    text-xs font-semibold
    ${
      isActive
        ? "bg-white/20 text-white"
        : "bg-white text-gray-600"
    }
  `}
>
  {count}
</span>
          </Rb_Button>
        );
      })}
    </div>
  );
}

