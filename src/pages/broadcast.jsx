import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Broadcast() {
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleBroadcast = async () => {
    if (!pesan.trim()) {
      alert("Pesan tidak boleh kosong!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://bot-ppdb-production.up.railway.app/send-broadcast",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pesan }),
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Gagal kirim broadcast. Coba lagi!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Broadcast Pesan WA</h1>

      <Card className="max-w-lg">
        <CardContent className="space-y-4 p-4">
          <Textarea
            placeholder="Tulis pesan broadcast di sini..."
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            className="min-h-[120px]"
          />

          <Button
            onClick={handleBroadcast}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Mengirim..." : "Kirim Broadcast"}
          </Button>

          {result && (
            <div className="mt-3 text-sm">
              {result.error ? (
                <p className="text-red-600">{result.error}</p>
              ) : (
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
