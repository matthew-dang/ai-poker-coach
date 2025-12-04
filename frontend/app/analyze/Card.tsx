export default function Card({ value }: { value: string }) {
  return (
    <div className="border rounded p-2 text-xl font-mono w-10 text-center bg-white shadow">
      {value}
    </div>
  );
}