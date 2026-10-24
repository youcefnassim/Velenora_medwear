import type { Order, OrderItemRecord } from '../../types/order';
import { Printer, X, Scissors, Award } from 'lucide-react';

interface ProductionWorksheetModalProps {
  order: Order;
  item: OrderItemRecord;
  onClose: () => void;
}

export const ProductionWorksheetModal: React.FC<ProductionWorksheetModalProps> = ({
  order,
  item,
  onClose,
}) => {
  const cust = item.configurationSnapshot?.config;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-velenora-grey max-h-[92vh] overflow-y-auto">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-velenora-grey no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono font-bold text-velenora-navy">
              FICHE ATELIER • {order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-velenora-navy hover:bg-velenora-navy-light text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer la Fiche</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-velenora-charcoal/60 hover:text-velenora-navy rounded-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Production Sheet Content */}
        <div className="mt-6 space-y-6 text-velenora-charcoal print:text-black print:m-0">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-velenora-navy">
            <div>
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-velenora-teal" />
                <h1 className="text-xl font-serif font-bold text-velenora-navy">
                  VELENORA MEDWEAR — FICHE TECHNIQUE ATELIER
                </h1>
              </div>
              <p className="text-xs text-velenora-charcoal/70 mt-1">
                Bon de coupe et de broderie sur-mesure • Confection Algérie
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-mono font-bold text-velenora-navy block">
                {order.orderNumber}
              </span>
              <span className="text-xs text-velenora-charcoal/60">
                Date : {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Customer & Destination Block */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-velenora-grey/30 rounded-xl border border-velenora-grey/60 text-xs">
            <div>
              <span className="font-bold text-velenora-navy block">Client / Praticien :</span>
              <p className="text-sm font-semibold mt-0.5">{order.customerDetails.fullName}</p>
              <p className="text-velenora-charcoal/80" dir="ltr">{order.customerDetails.phone}</p>
            </div>
            <div>
              <span className="font-bold text-velenora-navy block">Destination :</span>
              <p>{order.customerDetails.wilayaName}</p>
              <p className="text-velenora-charcoal/80">Commune : {order.customerDetails.commune}</p>
            </div>
          </div>

          {/* Garment Specifications Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy flex items-center gap-1.5">
              <Award className="w-4 h-4 text-velenora-teal" />
              <span>1. Spécifications de Coupe & Patronage</span>
            </h3>

            <table className="w-full text-xs border border-velenora-grey/80 rounded-lg overflow-hidden">
              <tbody className="divide-y divide-velenora-grey/60">
                <tr className="bg-velenora-grey/20">
                  <td className="p-2.5 font-bold text-velenora-navy w-1/3">Modèle / Article</td>
                  <td className="p-2.5 font-semibold">{item.productNameSnapshot} (Taille : {item.size})</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-velenora-navy">Quantité à découper</td>
                  <td className="p-2.5 font-bold text-velenora-teal">{item.quantity} pièce(s)</td>
                </tr>
                {cust && (
                  <>
                    <tr className="bg-velenora-grey/20">
                      <td className="p-2.5 font-bold text-velenora-navy">Tissu & Teinte Haut</td>
                      <td className="p-2.5 flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/30 inline-block"
                          style={{ backgroundColor: cust.topColor.hex }}
                        />
                        <span>{cust.topColor.name.fr} ({cust.topColor.hex})</span>
                      </td>
                    </tr>
                    {cust.garmentType !== 'top' && (
                      <tr>
                        <td className="p-2.5 font-bold text-velenora-navy">Tissu & Teinte Pantalon</td>
                        <td className="p-2.5 flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/30 inline-block"
                            style={{ backgroundColor: cust.pantsColor.hex }}
                          />
                          <span>{cust.pantsColor.name.fr} ({cust.pantsColor.hex})</span>
                        </td>
                      </tr>
                    )}
                    <tr className="bg-velenora-grey/20">
                      <td className="p-2.5 font-bold text-velenora-navy">Biais & Finitions Accent</td>
                      <td className="p-2.5">{cust.accentColor.name.fr} ({cust.accentColor.hex})</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-velenora-navy">Forme de Col</td>
                      <td className="p-2.5 font-semibold uppercase">{cust.neckline}</td>
                    </tr>
                    <tr className="bg-velenora-grey/20">
                      <td className="p-2.5 font-bold text-velenora-navy">Longueur Manches</td>
                      <td className="p-2.5 font-semibold">{cust.sleeve === 'long' ? 'Manches Longues avec Poignets' : 'Manches Courtes'}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-velenora-navy">Montage Poches</td>
                      <td className="p-2.5 font-semibold">{cust.pocket}</td>
                    </tr>
                    {cust.garmentType !== 'top' && (
                      <tr className="bg-velenora-grey/20">
                        <td className="p-2.5 font-bold text-velenora-navy">Bas de Pantalon & Ceinture</td>
                        <td className="p-2.5 font-semibold">{cust.pantsFit} • {cust.waistband}</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Embroidery Specifications */}
          {cust?.embroidery.enabled ? (
            <div className="space-y-2 p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
              <h3 className="font-bold text-amber-900 uppercase tracking-wider">
                2. Programme Broderie Numérique
              </h3>
              <div className="space-y-1.5">
                <p>
                  <span className="font-bold">Ligne 1 (Nom & Prénom) :</span>{' '}
                  <span className="text-sm font-bold text-velenora-navy bg-white px-2 py-0.5 rounded border border-amber-200">
                    {cust.embroidery.line1}
                  </span>
                </p>
                {cust.embroidery.line2 && (
                  <p>
                    <span className="font-bold">Ligne 2 (Titre / Spécialité) :</span>{' '}
                    <span className="text-sm italic text-velenora-navy bg-white px-2 py-0.5 rounded border border-amber-200">
                      {cust.embroidery.line2}
                    </span>
                  </p>
                )}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
                  <div>
                    <span className="font-semibold block text-velenora-charcoal/70">Position :</span>
                    <b>{cust.embroidery.position}</b>
                  </div>
                  <div>
                    <span className="font-semibold block text-velenora-charcoal/70">Police d'écriture :</span>
                    <b>{cust.embroidery.font}</b>
                  </div>
                  <div>
                    <span className="font-semibold block text-velenora-charcoal/70">Couleur Fil Broderie :</span>
                    <b>{cust.embroidery.colorName} ({cust.embroidery.colorHex})</b>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-velenora-grey/30 rounded-lg text-xs text-velenora-charcoal/70">
              Aucune broderie nominative demandée pour cet article.
            </div>
          )}

          {/* Quality Checklist for Workshop Operator */}
          <div className="p-4 border border-dashed border-velenora-grey-dark/50 rounded-xl space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-velenora-navy block">
              3. Checklist Contrôle Qualité & Visa Atelier
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" className="rounded" /> Conformité des mesures patron taille {item.size}
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" className="rounded" /> Orthographe et centrage broderie
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" className="rounded" /> Solidité coutures & surjet 4 fils
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" className="rounded" /> Ébarbage des fils & repassage vapeur
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs border-t border-velenora-grey/80">
              <span>Visa Chef d’Atelier : ___________________</span>
              <span>Colisage & Expédition : ___________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
