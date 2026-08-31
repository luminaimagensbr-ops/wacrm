"use client";

/**
 * Reusable field components shared across every per-node form.
 *
 * `NodeKeySelect` — picks a node from the flow's node list, rendered
 * with the source node's icon so the dropdown reads as
 * "destination = ◇ menu" rather than an opaque slug.
 *
 * `NextNodeRow` — wraps NodeKeySelect with a label; the most common
 * per-node form row ("after this node, advance to…").
 *
 * `TextRow` — wraps Input or Textarea behind a label. Pure UI sugar
 * to keep per-node forms uncluttered.
 *
 * Lives in src/components/flows/forms/ so both the list view's
 * collapsed-card editor and the canvas view's side-panel editor
 * (introduced in this PR) mount the exact same form components.
 */

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { NODE_META, type BuilderNode } from "../shared";

export function TextRow({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      {rows > 1 ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="bg-muted min-h-[80px] resize-y text-xs"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-muted text-xs"
        />
      )}
    </div>
  );
}

export function NextNodeRow({
  value,
  allNodes,
  currentKey,
  onChange,
  label,
}: {
  value: string;
  allNodes: BuilderNode[];
  currentKey: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <NodeKeySelect
        value={value || null}
        nodes={allNodes}
        excludeKey={currentKey}
        onChange={(v) => onChange(v ?? "")}
        placeholder={useTranslations("Flows.builder.form")("pickNextNode")}
      />
    </div>
  );
}

export function NodeKeySelect({
  value,
  nodes,
  excludeKey,
  onChange,
  placeholder,
  className,
}: {
  value: string | null;
  nodes: BuilderNode[];
  excludeKey?: string;
  onChange: (v: string | null) => void;
  placeholder?: string;
  className?: string;
}) {
  const t = useTranslations("Flows.builder.form");
  const options = nodes.filter((n) => n.node_key !== excludeKey);
  return (
    <Select
      value={value ?? "__none__"}
      onValueChange={(v) => onChange(v === "__none__" ? null : v)}
    >
      <SelectTrigger className={cn("bg-muted", className)}>
        <SelectValue placeholder={placeholder ?? "—"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">{t("none")}</SelectItem>
        {options.map((n) => {
          const Icon = NODE_META[n.node_type].icon;
          return (
            <SelectItem key={n.node_key} value={n.node_key}>
              <span className="inline-flex items-center gap-1.5">
                <Icon
                  className={cn("h-3 w-3", NODE_META[n.node_type].color)}
                />
                {n.node_key}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function TypingSimulationFields({
  cfg,
  onUpdateConfig,
  isAudio = false,
}: {
  cfg: { simulate_typing?: boolean; typing_seconds?: number };
  onUpdateConfig: (patch: Record<string, unknown>) => void;
  isAudio?: boolean;
}) {
  const enabled = cfg.simulate_typing ?? false;
  const seconds = cfg.typing_seconds ?? 3;

  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="grid gap-0.5">
          <span className="text-xs font-medium text-foreground">
            {isAudio ? "Simular gravando áudio" : "Simular digitação"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isAudio
              ? "Exibe 'gravando áudio...' no WhatsApp antes de enviar"
              : "Exibe 'digitando...' no WhatsApp antes de enviar"}
          </span>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => {
            onUpdateConfig({
              simulate_typing: checked,
              typing_seconds: checked ? cfg.typing_seconds ?? 3 : cfg.typing_seconds,
            });
          }}
        />
      </div>

      {enabled && (
        <div className="flex items-center gap-3 pt-2 border-t border-border/40">
          <label className="text-xs text-muted-foreground flex-1">
            Tempo de exibição (segundos)
          </label>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min={1}
              max={25}
              value={seconds}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                const clamped = isNaN(val) ? 3 : Math.min(Math.max(val, 1), 25);
                onUpdateConfig({ typing_seconds: clamped });
              }}
              className="h-7 w-16 bg-muted text-xs text-center font-mono"
            />
            <span className="text-xs text-muted-foreground">s</span>
          </div>
        </div>
      )}
    </div>
  );
}
