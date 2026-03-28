import Link from "next/link";

const catalogItems = [
  {
    title: "Limestone Cement 42.5R",
    price: "NGN 12,500 / 50kg bag",
    stock: "In Stock",
    stockClass: "pill pill-green",
    leadTime: "Lead Time: 24h",
  },
  {
    title: "Ordinary Portland Cement",
    price: "NGN 12,100 / 50kg bag",
    stock: "Limited",
    stockClass: "pill pill-amber",
    leadTime: "Lead Time: 48h",
  },
  {
    title: "Portland Limestone Blend",
    price: "NGN 11,900 / 50kg bag",
    stock: "In Stock",
    stockClass: "pill pill-green",
    leadTime: "Lead Time: 24h",
  },
];

export default function HomePage() {
  return (
    <div className="portal-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            Resident<span className="accent">Ciment</span> B2B
          </div>
          <nav className="topnav">
            <a href="#dashboard">Dashboard</a>
            <a href="#catalog">Products</a>
            <a href="#orders">Orders</a>
            <a href="#invoices">Invoices</a>
            <a href="#account">Account</a>
          </nav>
          <Link href="/login" className="toolbar-cta">
            Partner Sign In
          </Link>
        </div>
      </header>

      <main className="main-wrap">
        <section className="hero-grid" id="dashboard">
          <article className="panel hero-panel">
            <div className="eyebrow">Resident Ciment Bauchi Ltd</div>
            <h1 className="hero-title">
              B2B Order Hub for Enterprise
              <br />
              Cement Procurement
            </h1>
            <p className="hero-text">
              Built from the approved dark-gold Stitch direction for fast partner operations:
              real-time catalog, committed allocations, invoice visibility, and operational sync
              into ERP workflows at <strong>rcerp.nyamabo.com</strong>.
            </p>
            <div className="chip-row">
              <span className="chip">Factory Allocation</span>
              <span className="chip">Credit-Control Orders</span>
              <span className="chip">Invoice Reconciliation</span>
              <span className="chip">Live Logistics Updates</span>
            </div>
          </article>

          <aside className="panel stat-panel">
            <div className="section-title-row">
              <h2 className="section-title">Live Operations</h2>
              <span className="section-hint">03:30 UTC</span>
            </div>
            <div className="stat-grid">
              <div className="stat-card">
                <h3>2,140</h3>
                <p>Bags Reserved</p>
              </div>
              <div className="stat-card">
                <h3>37</h3>
                <p>Open B2B Orders</p>
              </div>
              <div className="stat-card">
                <h3>12</h3>
                <p>Pending Invoices</p>
              </div>
              <div className="stat-card">
                <h3>99.2%</h3>
                <p>Fulfillment SLA</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="section" id="catalog">
          <div className="section-title-row">
            <h2 className="section-title">Product Catalog</h2>
            <span className="section-hint">B2B Stock View</span>
          </div>
          <div className="catalog-grid">
            {catalogItems.map((item) => (
              <article className="catalog-card" key={item.title}>
                <h4>{item.title}</h4>
                <div className="catalog-meta">{item.price}</div>
                <div className="catalog-row">
                  <span>{item.leadTime}</span>
                  <span className={item.stockClass}>{item.stock}</span>
                </div>
                <div className="action-row">
                  <button className="action-btn primary">Add to Cart</button>
                  <button className="action-btn">Spec Sheet</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-title-row">
            <h2 className="section-title">Portal Integrations</h2>
            <span className="section-hint">Cross-System Sync</span>
          </div>
          <div className="integration-grid">
            <article className="integration-card" id="orders">
              <h4>ERP Sync</h4>
              <p>
                Purchase orders, inventory reservations, and payment status are synchronized with
                the ERP module to preserve operational consistency across finance and fulfillment.
              </p>
              <a
                href="https://rcerp.nyamabo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Open ERP Console
              </a>
            </article>
            <article className="integration-card" id="invoices">
              <h4>Dealer Visibility</h4>
              <p>
                Fulfilled B2B allocations are exposed to the dealer portal to maintain accurate
                downstream stock and dispatch transparency.
              </p>
              <a
                href="https://rcdportal.nyamabo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Open Dealer Portal
              </a>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

