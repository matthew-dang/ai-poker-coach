export default function HandViewer({ hand }: any) {
  if (!hand) return null;

  const normalizeCard = (value: any): string => {
    if (!value) return "";
    if (Array.isArray(value) && value.length) value = value[0];
    value = String(value).trim().toUpperCase();

    // valid ranks only
    const match = value.match(/^([AKQJT2-9])$/);
    return match ? match[1] : "";
  };

  const card = (v: any, i: number) => {
    const text = normalizeCard(v);
    if (!text) return null;

    return (
      <div
        key={i}
        className="w-12 h-16 flex items-center justify-center 
                   text-xl font-bold bg-white text-black 
                   rounded-md shadow-md"
      >
        {text}
      </div>
    );
  };

  const flop = hand.streets?.flop?.board || [];
  const turn = hand.streets?.turn?.board ? [hand.streets.turn.board] : [];
  const river = hand.streets?.river?.board ? [hand.streets.river.board] : [];

  // full board row: flop + turn + river
  const fullBoard = [...flop, ...turn, ...river];

  return (
    <div className="flex flex-col items-center w-full h-full">

      {/* ================= POKER TABLE ================= */}
      <div
        className="
          relative w-[80%] h-[55%]
          rounded-[900px]
          bg-[#0c3a2e]
          shadow-[0_0_40px_rgba(0,0,0,0.6)]
          border-[6px] border-[#12201a]
          flex flex-col items-center justify-between
          pt-8 pb-8
          overflow-hidden
        "
      >

        {/* VILLAIN */}
        <div className="text-center text-white">
          <div className="font-bold text-lg">Villain</div>
          <div className="text-sm opacity-70">{hand.positions?.villain}</div>
        </div>

        {/* BOARD (ONE HORIZONTAL ROW) */}
        <div className="flex gap-3 justify-center mt-4 mb-4">
          {fullBoard.map((c: any, i: number) => card(c, i))}
        </div>

        {/* HERO */}
        <div className="text-center text-white mb-3">
          <div className="font-bold text-lg">Hero</div>

          <div className="flex gap-3 justify-center mt-2">
            {hand.hero_hand &&
              hand.hero_hand.split("").map((c: any, i: number) => card(c, i))}
          </div>

          <div className="text-sm opacity-70 mt-1">{hand.positions?.hero}</div>
        </div>

      </div>

        {/* =============== ACTION LOG PANEL =============== */}
        <div
        className="
            mt-6 p-6 
            bg-[#111315] text-white 
            rounded-xl shadow-xl 
            w-[55%] 
            border border-[#2a2a2e]
        "
        >
        <h2 className="font-bold text-xl mb-4 text-center tracking-wide">
            Hand Actions
        </h2>

        {/* STREET BLOCK COMPONENT */}
        {[
            { street: "Flop", data: hand.streets?.flop?.actions },
            { street: "Turn", data: hand.streets?.turn?.actions },
            { street: "River", data: hand.streets?.river?.actions },
        ].map(({ street, data }, idx) => (
            <div key={street} className="mb-5">
            <div className="text-lg font-semibold mb-2 text-[#e5e5e5]">
                {street}
            </div>

            {!data || data.length === 0 ? (
                <div className="text-gray-500 text-sm ml-1">No actions</div>
            ) : (
                <div className="space-y-2">
                {data.map((a: any, i: number) => {
                    const action = a.action.toLowerCase();
                    const size = a.size ? ` (${a.size})` : "";

                    // COLOR TAGS
                    const color =
                    action === "bet"
                        ? "bg-blue-600"
                        : action === "raise"
                        ? "bg-purple-600"
                        : action === "call"
                        ? "bg-yellow-600"
                        : action === "check"
                        ? "bg-gray-600"
                        : action === "fold"
                        ? "bg-red-600"
                        : "bg-slate-600";

                    return (
                    <div key={street + "-a-" + i} className="flex items-center gap-3">

                        {/* CHIP ICON */}
                        <div
                        className={`w-4 h-4 rounded-full ${color} shadow-sm`}
                        ></div>

                        {/* TEXT */}
                        <div className="text-sm tracking-wide">
                        <span className="font-semibold capitalize">
                            {a.player ?? "Hero"}
                        </span>{" "}
                        {action}
                        {size}
                        </div>
                    </div>
                    );
                })}
                </div>
            )}

            {/* Street Divider (except last one) */}
            {idx < 2 && <div className="h-[1px] w-full bg-[#2a2a2e] my-3"></div>}
            </div>
        ))}
        </div>


    </div>
  );
}
