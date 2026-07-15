import { KENANGAN_TIERS, getKenanganTier } from "@/types/kenangan";

/** Paket selector as comparable cards (name · guest cap · price), replacing the
 *  old <select>. Native radios so it submits inside a server-action form with no
 *  JS; selection styling is pure CSS (:has(:checked)). Shared by the create form
 *  and the event settings form.
 *
 *  locked = a confirmed Paket (money moved); the tier can't change. Renders the
 *  chosen tier as a static card + a hidden input so the value still posts. */
export default function KenanganTierCards({
  value,
  locked = false,
  name = "tier",
}: {
  value?: string;
  locked?: boolean;
  name?: string;
}) {
  const selected = getKenanganTier(value);

  if (locked) {
    return (
      <div className="kk-tier-cards">
        <div className="kk-tier-card" data-locked aria-current="true">
          <div className="kk-tier-row">
            <span className="kk-tier-name">{selected.name}</span>
            <span className="kk-tier-price">Rp {selected.priceIdr.toLocaleString("id-ID")}</span>
          </div>
          <span className="kk-tier-cap">≤{selected.guestCap} tamu · terkunci</span>
        </div>
        <input type="hidden" name={name} value={selected.id} />
      </div>
    );
  }

  return (
    <div className="kk-tier-cards" role="radiogroup" aria-label="Paket">
      {KENANGAN_TIERS.map((tier) => (
        <label key={tier.id} className="kk-tier-card">
          <input
            type="radio"
            name={name}
            value={tier.id}
            defaultChecked={tier.id === selected.id}
            className="kk-tier-radio"
          />
          <div className="kk-tier-row">
            <span className="kk-tier-name">{tier.name}</span>
            <span className="kk-tier-price">Rp {tier.priceIdr.toLocaleString("id-ID")}</span>
          </div>
          <span className="kk-tier-cap">≤{tier.guestCap} tamu</span>
        </label>
      ))}
    </div>
  );
}
