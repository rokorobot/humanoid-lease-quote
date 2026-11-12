import { formatUsd, type Quote } from "@/domain/quote";

export function QuoteTable({ quote }: { quote: Quote }) {
  const rows: [string, string][] = [
    ["List price", formatUsd(quote.listCents)],
    [
      `Volume discount ${quote.volumePercent}%`,
      formatUsd(-quote.volumeDiscountCents),
    ],
    [
      `Term discount ${quote.termPercent}%`,
      formatUsd(-quote.termDiscountCents),
    ],
    ["Full maintenance", `+${formatUsd(quote.maintenanceCents)}`],
    ["Monthly price", formatUsd(quote.monthlyCents)],
    [`Total over ${quote.request.term} months`, formatUsd(quote.totalCents)],
  ];
  return (
    <table aria-label="Quote">
      <tbody>
        {rows.map(([label, amount]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
