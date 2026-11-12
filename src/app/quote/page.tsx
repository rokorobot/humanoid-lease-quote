import { Suspense } from "react";
import {
  calculateQuote,
  formatUsd,
  MAX_QUANTITY,
  MIN_QUANTITY,
  MODELS,
  parseQuoteRequest,
  SERVICES,
  TERMS,
} from "@/domain/quote";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

// The heading is static. The form and result depend on the URL, so they render per request.
export default function QuotePage(props: { searchParams: SearchParams }) {
  return (
    <main>
      <h1>Lease quote</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <QuoteForm searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

function Choice(props: {
  label: string;
  name: string;
  value: string;
  options: [string, string][];
}) {
  return (
    <label>
      {props.label}{" "}
      <select name={props.name} defaultValue={props.value}>
        {props.options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>{" "}
    </label>
  );
}

async function QuoteForm({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = {
    model: first(params.model),
    quantity: first(params.quantity),
    term: first(params.term),
    service: first(params.service),
  };
  const submitted = Object.values(raw).some((value) => value !== undefined);
  const parsed = submitted ? parseQuoteRequest(raw) : undefined;
  const quote = parsed?.ok ? calculateQuote(parsed.value) : undefined;
  const rows: [string, string][] = quote
    ? [
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
        [
          `Total over ${quote.request.term} months`,
          formatUsd(quote.totalCents),
        ],
      ]
    : [];

  return (
    <>
      <form method="get">
        <Choice
          label="Robot model"
          name="model"
          value={raw.model ?? "standard"}
          options={Object.entries(MODELS).map(([key, model]) => [
            key,
            model.label,
          ])}
        />
        <label>
          Quantity{" "}
          <input
            name="quantity"
            type="number"
            min={MIN_QUANTITY}
            max={MAX_QUANTITY}
            step={1}
            defaultValue={raw.quantity ?? "10"}
          />{" "}
        </label>
        <Choice
          label="Lease term"
          name="term"
          value={raw.term ?? "24"}
          options={TERMS.map((term) => [String(term), `${term} months`])}
        />
        <Choice
          label="Service"
          name="service"
          value={raw.service ?? "basic"}
          options={Object.entries(SERVICES).map(([key, service]) => [
            key,
            service.label,
          ])}
        />
        <button type="submit">Get quote</button>
      </form>

      {parsed && !parsed.ok && (
        <ul role="alert" aria-label="Problems with the quote">
          {parsed.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {quote && (
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
      )}
    </>
  );
}
