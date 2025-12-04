export default function ActionRow({ action }: any) {
  return (
    <div className="flex justify-between py-1 px-2 border-b">
      <span className="font-semibold">{action.player}</span>
      <span>{action.action}</span>
      <span>{action.size ?? "—"}</span>
    </div>
  );
}
